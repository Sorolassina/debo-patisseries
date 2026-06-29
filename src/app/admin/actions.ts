"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { resolveProductImageUrl, resolveImageField } from "@/lib/admin/product-image";
import {
  parsePackagingItemsJson,
  resolvePackagingPriceCents,
  syncPackagingItems,
} from "@/lib/admin/packaging-items";
import {
  COOKIE_NAME,
  getAdminSessionCookieValue,
  requireAdmin,
  slugify,
} from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidCategorySlug } from "@/lib/supabase/categories";
import { cookies } from "next/headers";

export async function loginAdmin(
  _prev: { error?: string } | null,
  formData: FormData,
) {
  const password = formData.get("password")?.toString() ?? "";
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected || password !== expected) {
    return { error: "Mot de passe incorrect" };
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, getAdminSessionCookieValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin/products");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/admin/login");
}

export async function createProduct(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
) {
  await requireAdmin();

  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const priceInput = formData.get("price")?.toString();
  const category = formData.get("category")?.toString();
  const slugInput = formData.get("slug")?.toString().trim();
  const isChefsPick = formData.get("is_chefs_pick") === "on";
  const isSeasonal = formData.get("is_seasonal") === "on";
  const isActive = formData.get("is_active") === "on";

  if (!name || !priceInput || !category) {
    return { error: "Nom, prix et catégorie sont obligatoires" };
  }

  if (!(await isValidCategorySlug(category))) {
    return { error: "Catégorie invalide" };
  }

  const priceFcfa = Math.round(parseFloat(priceInput.replace(/\s/g, "").replace(",", ".")));
  if (Number.isNaN(priceFcfa) || priceFcfa < 0) {
    return { error: "Prix invalide" };
  }

  const slug = slugInput || slugify(name);

  let imageUrl: string | null;
  try {
    imageUrl = await resolveProductImageUrl(formData, slug);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erreur upload image" };
  }

  const supabase = createAdminClient();

  const { error } = await supabase.from("products").insert({
    slug,
    name,
    description,
    price_cents: priceFcfa,
    image_url: imageUrl,
    category,
    is_chefs_pick: isChefsPick,
    is_seasonal: isSeasonal,
    is_active: isActive,
  });

  if (error) {
    if (error.code === "23505") return { error: "Ce slug existe déjà" };
    return { error: error.message };
  }

  revalidatePath("/menu");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function updateProduct(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
) {
  await requireAdmin();

  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const priceInput = formData.get("price")?.toString();
  const category = formData.get("category")?.toString();
  const productSlug = formData.get("slug")?.toString().trim() || "product";
  const isChefsPick = formData.get("is_chefs_pick") === "on";
  const isSeasonal = formData.get("is_seasonal") === "on";
  const isActive = formData.get("is_active") === "on";
  const currentImageUrl = formData.get("current_image_url")?.toString() || null;

  if (!id || !name || !priceInput || !category) {
    return { error: "Champs obligatoires manquants" };
  }

  if (!(await isValidCategorySlug(category))) {
    return { error: "Catégorie invalide" };
  }

  const priceFcfa = Math.round(parseFloat(priceInput.replace(/\s/g, "").replace(",", ".")));
  if (Number.isNaN(priceFcfa) || priceFcfa < 0) {
    return { error: "Prix invalide" };
  }

  let imageUrl: string | null;
  try {
    imageUrl = await resolveProductImageUrl(formData, productSlug, currentImageUrl);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erreur upload image" };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("products")
    .update({
      name,
      description,
      price_cents: priceFcfa,
      image_url: imageUrl,
      category,
      is_chefs_pick: isChefsPick,
      is_seasonal: isSeasonal,
      is_active: isActive,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/menu");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteProduct(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
) {
  await requireAdmin();

  const id = formData.get("id")?.toString();
  if (!id) return { error: "ID manquant" };

  const supabase = createAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/menu");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function createCategory(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
) {
  await requireAdmin();

  const label = formData.get("label")?.toString().trim();
  const slugInput = formData.get("slug")?.toString().trim();
  const sortOrderInput = formData.get("sort_order")?.toString();
  const showOnMenu = formData.get("show_on_menu") === "on";
  const showInCoffret = formData.get("show_in_coffret") === "on";

  if (!label) return { error: "Le libellé est obligatoire" };

  const slug = slugInput || slugify(label);
  const sort_order = sortOrderInput ? parseInt(sortOrderInput, 10) : 0;

  const supabase = createAdminClient();
  const { error } = await supabase.from("categories").insert({
    slug,
    label,
    sort_order: Number.isNaN(sort_order) ? 0 : sort_order,
    show_on_menu: showOnMenu,
    show_in_coffret: showInCoffret,
    is_active: true,
  });

  if (error) {
    if (error.code === "23505") return { error: "Ce slug existe déjà" };
    return { error: error.message };
  }

  revalidatePath("/menu");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function updateCategory(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
) {
  await requireAdmin();

  const id = formData.get("id")?.toString();
  const label = formData.get("label")?.toString().trim();
  const sortOrderInput = formData.get("sort_order")?.toString();
  const showOnMenu = formData.get("show_on_menu") === "on";
  const showInCoffret = formData.get("show_in_coffret") === "on";
  const isActive = formData.get("is_active") === "on";

  if (!id || !label) return { error: "Champs obligatoires manquants" };

  const sort_order = sortOrderInput ? parseInt(sortOrderInput, 10) : 0;

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("categories")
    .update({
      label,
      sort_order: Number.isNaN(sort_order) ? 0 : sort_order,
      show_on_menu: showOnMenu,
      show_in_coffret: showInCoffret,
      is_active: isActive,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/menu");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteCategory(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
) {
  await requireAdmin();

  const id = formData.get("id")?.toString();
  const slug = formData.get("slug")?.toString();
  if (!id || !slug) return { error: "ID manquant" };

  const supabase = createAdminClient();
  const { count } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category", slug);

  if (count && count > 0) {
    return {
      error: `Impossible : ${count} produit(s) utilisent encore cette catégorie.`,
    };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/menu");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function createPackaging(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
) {
  await requireAdmin();

  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const slugInput = formData.get("slug")?.toString().trim();
  const sortOrderInput = formData.get("sort_order")?.toString();
  const autoPrice = formData.get("auto_price") === "on";
  const isActive = formData.get("is_active") === "on";
  const priceInput = formData.get("price")?.toString();
  const items = parsePackagingItemsJson(formData.get("items_json")?.toString());

  if (!name) return { error: "Le nom est obligatoire" };
  if (items.length === 0) return { error: "Ajoutez au moins un produit au packaging" };

  const slug = slugInput || slugify(name);
  const sort_order = sortOrderInput ? parseInt(sortOrderInput, 10) : 0;
  const manualPrice = priceInput
    ? Math.round(parseFloat(priceInput.replace(/\s/g, "").replace(",", ".")))
    : 0;

  if (!autoPrice && (Number.isNaN(manualPrice) || manualPrice < 0)) {
    return { error: "Prix invalide" };
  }

  const price_cents = await resolvePackagingPriceCents(items, autoPrice, manualPrice);
  if (price_cents <= 0) return { error: "Le prix du packaging doit être supérieur à 0" };

  let imageUrl: string | null;
  try {
    imageUrl = await resolveProductImageUrl(formData, slug);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erreur upload image" };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("packagings")
    .insert({
      slug,
      name,
      description,
      image_url: imageUrl,
      price_cents,
      auto_price: autoPrice,
      is_active: isActive,
      sort_order: Number.isNaN(sort_order) ? 0 : sort_order,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") return { error: "Ce slug existe déjà" };
    return { error: error.message };
  }

  await syncPackagingItems(data.id, items);

  revalidatePath("/packagings");
  revalidatePath("/coffret");
  revalidatePath("/admin/packagings");
  return { success: true };
}

export async function updatePackaging(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
) {
  await requireAdmin();

  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const sortOrderInput = formData.get("sort_order")?.toString();
  const packagingSlug = formData.get("slug")?.toString().trim() || "packaging";
  const autoPrice = formData.get("auto_price") === "on";
  const isActive = formData.get("is_active") === "on";
  const priceInput = formData.get("price")?.toString();
  const currentImageUrl = formData.get("current_image_url")?.toString() || null;
  const items = parsePackagingItemsJson(formData.get("items_json")?.toString());

  if (!id || !name) return { error: "Champs obligatoires manquants" };
  if (items.length === 0) return { error: "Ajoutez au moins un produit au packaging" };

  const sort_order = sortOrderInput ? parseInt(sortOrderInput, 10) : 0;
  const manualPrice = priceInput
    ? Math.round(parseFloat(priceInput.replace(/\s/g, "").replace(",", ".")))
    : 0;

  if (!autoPrice && (Number.isNaN(manualPrice) || manualPrice < 0)) {
    return { error: "Prix invalide" };
  }

  const price_cents = await resolvePackagingPriceCents(items, autoPrice, manualPrice);
  if (price_cents <= 0) return { error: "Le prix du packaging doit être supérieur à 0" };

  let imageUrl: string | null;
  try {
    imageUrl = await resolveProductImageUrl(formData, packagingSlug, currentImageUrl);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erreur upload image" };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("packagings")
    .update({
      name,
      description,
      image_url: imageUrl,
      price_cents,
      auto_price: autoPrice,
      is_active: isActive,
      sort_order: Number.isNaN(sort_order) ? 0 : sort_order,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  await syncPackagingItems(id, items);

  revalidatePath("/packagings");
  revalidatePath("/coffret");
  revalidatePath("/admin/packagings");
  return { success: true };
}

export async function deletePackaging(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
) {
  await requireAdmin();

  const id = formData.get("id")?.toString();
  if (!id) return { error: "ID manquant" };

  const supabase = createAdminClient();
  const { error } = await supabase.from("packagings").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/packagings");
  revalidatePath("/coffret");
  revalidatePath("/admin/packagings");
  return { success: true };
}

export async function updateSiteSettings(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
) {
  await requireAdmin();

  const site_name = formData.get("site_name")?.toString().trim();
  if (!site_name) return { error: "Le nom du site est obligatoire" };

  const tagline = formData.get("tagline")?.toString().trim() || "";
  const description = formData.get("description")?.toString().trim() || "";
  const city = formData.get("city")?.toString().trim() || "Abidjan";
  const country = formData.get("country")?.toString().trim() || "Côte d'Ivoire";
  const craft_badge = formData.get("craft_badge")?.toString().trim() || "";
  const contact_email = formData.get("contact_email")?.toString().trim() || null;
  const contact_phone = formData.get("contact_phone")?.toString().trim() || null;
  const contact_address = formData.get("contact_address")?.toString().trim() || null;
  const whatsapp = formData.get("whatsapp")?.toString().trim() || null;
  const instagram_url = formData.get("instagram_url")?.toString().trim() || null;
  const facebook_url = formData.get("facebook_url")?.toString().trim() || null;
  const currentLogo = formData.get("current_logo_url")?.toString() || null;
  const currentHero = formData.get("current_hero_url")?.toString() || null;

  let logo_url: string | null;
  let hero_image_url: string | null;
  try {
    logo_url = await resolveImageField(formData, "logo", "site", currentLogo);
    hero_image_url = await resolveImageField(formData, "hero", "site", currentHero);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erreur upload image" };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("site_settings").upsert({
    id: 1,
    site_name,
    tagline,
    description,
    logo_url,
    hero_image_url,
    city,
    country,
    craft_badge,
    contact_email,
    contact_phone,
    contact_address,
    whatsapp,
    instagram_url,
    facebook_url,
    updated_at: new Date().toISOString(),
  });

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/contact");
  revalidatePath("/menu");
  revalidatePath("/coffret");
  revalidatePath("/admin/settings");
  return { success: true };
}
