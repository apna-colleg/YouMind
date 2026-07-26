import { supabase } from '../lib/supabaseClient';

const BUCKET_NAME = 'note-images';

/**
 * Upload an image file to Supabase Storage.
 * Returns the public URL of the uploaded image.
 */
export async function uploadImage(file, userId) {
  const ext = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  return data.publicUrl;
}

/**
 * Delete an image from Supabase Storage by its public URL.
 */
export async function deleteImage(publicUrl) {
  const urlObj = new URL(publicUrl);
  const pathParts = urlObj.pathname.split(`/storage/v1/object/public/${BUCKET_NAME}/`);
  if (pathParts.length < 2) return;

  const filePath = pathParts[1];

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) throw error;
}
