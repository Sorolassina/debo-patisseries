"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { resolveProductImageUrl } from "@/lib/admin/product-image";
import {
  COOKIE_NAME,
  getAdminSessionCookieValue,
  requireAdmin,
  slugify,
} from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { MENU_CATEGORY_VALUES } from "@/lib/constants/categories";
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

  if (!MENU_CATEGORY_VALUES.includes(category as (typeof MENU_CATEGORY_VALUES)[number])) {
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
