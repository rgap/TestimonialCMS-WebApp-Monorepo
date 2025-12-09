// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '',
  apiSecret: process.env.CLOUDINARY_API_SECRET || '',
};

// Upload preset for unsigned uploads (recommended for client-side)
export const CLOUDINARY_UPLOAD_PRESET = 'testimonials_preset';

// Folder structure
export const CLOUDINARY_FOLDERS = {
  testimonials: 'testimonials',
  avatars: 'avatars',
  projects: 'projects',
};


