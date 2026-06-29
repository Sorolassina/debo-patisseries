import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "products";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function uploadProductImage(
  file: File,
  slug: string,
): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Format accepté : JPG, PNG, WebP ou GIF");
  }

  if (file.size > MAX_BYTES) {
    throw new Error("Image trop volumineuse (max 5 Mo)");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeSlug = slug.replace(/[^a-z0-9-]/g, "-");
  const path = `${safeSlug}-${Date.now()}.${ext}`;

  const supabase = createAdminClient();
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(`Upload échoué : ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function resolveProductImageUrl(
  formData: FormData,
  slug: string,
  currentUrl?: string | null,
): Promise<string | null> {
  const file = formData.get("image_file");

  if (file instanceof File && file.size > 0) {
    return uploadProductImage(file, slug);
  }

  const url = formData.get("image_url")?.toString().trim();
  if (url) return url;

  return currentUrl ?? null;
}
