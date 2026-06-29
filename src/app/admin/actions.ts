"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  COOKIE_NAME,
  getAdminSessionCookieValue,
  requireAdmin,
  slugify,
} from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { cookies } from "next/headers";

const PRODUCT_CATEGORIES = [
  "mignardises",
  "macarons",
  "tartelettes",
  "entremets",
  "accompaniment",
] as const;

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
  const priceEuros = formData.get("price")?.toString();
  const category = formData.get("category")?.toString();
  const imageUrl = formData.get("image_url")?.toString().trim() || null;
  const slugInput = formData.get("slug")?.toString().trim();
  const isChefsPick = formData.get("is_chefs_pick") === "on";
  const isSeasonal = formData.get("is_seasonal") === "on";
  const isActive = formData.get("is_active") === "on";

  if (!name || !priceEuros || !category) {
    return { error: "Nom, prix et catégorie sont obligatoires" };
  }

  if (!PRODUCT_CATEGORIES.includes(category as (typeof PRODUCT_CATEGORIES)[number])) {
    return { error: "Catégorie invalide" };
  }

  const priceCents = Math.round(parseFloat(priceEuros.replace(",", ".")) * 100);
  if (Number.isNaN(priceCents) || priceCents < 0) {
    return { error: "Prix invalide" };
  }

  const slug = slugInput || slugify(name);
  const supabase = createAdminClient();

  const { error } = await supabase.from("products").insert({
    slug,
    name,
    description,
    price_cents: priceCents,
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
  const priceEuros = formData.get("price")?.toString();
  const category = formData.get("category")?.toString();
  const imageUrl = formData.get("image_url")?.toString().trim() || null;
  const isChefsPick = formData.get("is_chefs_pick") === "on";
  const isSeasonal = formData.get("is_seasonal") === "on";
  const isActive = formData.get("is_active") === "on";

  if (!id || !name || !priceEuros || !category) {
    return { error: "Champs obligatoires manquants" };
  }

  const priceCents = Math.round(parseFloat(priceEuros.replace(",", ".")) * 100);
  if (Number.isNaN(priceCents) || priceCents < 0) {
    return { error: "Prix invalide" };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("products")
    .update({
      name,
      description,
      price_cents: priceCents,
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
