import { CLOUDINARY_FOLDERS, cloudinaryConfig } from "./config";

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  secureUrl: string;
}

export interface UploadOptions {
  folder?: keyof typeof CLOUDINARY_FOLDERS;
  transformation?: string;
  resourceType?: "image" | "video" | "raw" | "auto";
}

/**
 * Upload an image to Cloudinary using the server-side API
 * This is more secure as it keeps credentials on the server
 */
export async function uploadToCloudinary(file: File, options: UploadOptions = {}): Promise<UploadResult> {
  const { folder = "testimonials", resourceType = "image" } = options;

  // Convert file to base64
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // Use server-side API route
  const response = await fetch("/api/cloudinary/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file: base64,
      folder: CLOUDINARY_FOLDERS[folder],
      resourceType,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to upload image to Cloudinary");
  }

  const data = await response.json();

  return {
    url: data.url,
    publicId: data.publicId,
    width: data.width,
    height: data.height,
    format: data.format,
    secureUrl: data.secureUrl,
  };
}

/**
 * Upload a base64 encoded image to Cloudinary using the server-side API
 */
export async function uploadBase64ToCloudinary(base64String: string, options: UploadOptions = {}): Promise<UploadResult> {
  const { folder = "testimonials", resourceType = "image" } = options;

  // Use server-side API route
  const response = await fetch("/api/cloudinary/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file: base64String,
      folder: CLOUDINARY_FOLDERS[folder],
      resourceType,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to upload image to Cloudinary");
  }

  const data = await response.json();

  return {
    url: data.url,
    publicId: data.publicId,
    width: data.width,
    height: data.height,
    format: data.format,
    secureUrl: data.secureUrl,
  };
}

/**
 * Generate a Cloudinary URL with transformations
 */
export function getCloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: "fill" | "fit" | "scale" | "crop" | "thumb";
    quality?: "auto" | number;
    format?: "auto" | "jpg" | "png" | "webp";
  } = {}
): string {
  const { width, height, crop = "fill", quality = "auto", format = "auto" } = options;

  const cloudName = cloudinaryConfig.cloudName;
  if (!cloudName) {
    return publicId; // Return original if not configured
  }

  let transformations = [];

  if (width || height) {
    let transform = `c_${crop}`;
    if (width) transform += `,w_${width}`;
    if (height) transform += `,h_${height}`;
    transformations.push(transform);
  }

  if (quality) {
    transformations.push(`q_${quality}`);
  }

  if (format) {
    transformations.push(`f_${format}`);
  }

  const transformString = transformations.length > 0 ? transformations.join(",") + "/" : "";

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}${publicId}`;
}

/**
 * Delete an image from Cloudinary (server-side only)
 * This requires server-side API call with credentials
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  // This should be called from a server-side API route
  const response = await fetch("/api/cloudinary/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ publicId }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete image from Cloudinary");
  }
}
