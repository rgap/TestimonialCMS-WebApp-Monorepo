/* Supabase configuration - now using environment variables */

// Extract project ID from Supabase URL if available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rjeslutegnjaplspygwx.supabase.co";
const urlParts = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);

export const projectId = urlParts?.[1] || "rjeslutegnjaplspygwx";
export const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZXNsdXRlZ25qYXBsc3B5Z3d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MTM2NDQsImV4cCI6MjA3OTQ4OTY0NH0.zok4D-Gc1ucht24FdbYw941prEZEbom2rN5S9YD59-w";

// Edge Function name - centralized configuration
export const edgeFunctionName = process.env.NEXT_PUBLIC_EDGE_FUNCTION_NAME || "make-server-68ddca03";

// Helper to build API URLs
export const getApiUrl = (endpoint: string = '') => {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL 
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/${edgeFunctionName}`
    : `https://${projectId}.supabase.co/functions/v1/${edgeFunctionName}`;
  
  return endpoint ? `${baseUrl}${endpoint}` : baseUrl;
};