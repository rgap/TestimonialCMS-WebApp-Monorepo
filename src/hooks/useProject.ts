'use client';

import { useState, useEffect } from 'react';
import { getApiUrl } from "@/lib/supabase/info";

interface Project {
  id: string;
  name: string;
  type: string;
  testimonialsCount: number;
  createdAt: string;
  updatedAt: string;
  ownerId?: string;
  ownerEmail?: string;
  role?: string; // 'owner' or 'editor'
}

/**
 * Custom hook to load and access project data
 */
export function useProject(projectId?: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  useEffect(() => {
    loadProject();
  }, [projectId]);
  
  const loadProject = async () => {
    const accessToken = localStorage.getItem('access_token');
    
    if (!accessToken || !projectId) {
      setLoading(false);
      return;
    }
    
    try {
      const apiUrl = getApiUrl(`/projects/${projectId}`);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error loading project:', data);
        setError(data.error || 'Error al cargar el proyecto');
        return;
      }
      
      console.log('Project loaded:', data.project);
      setProject(data.project);
    } catch (error: any) {
      console.error('Error loading project:', error);
      setError('Error al cargar el proyecto. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  return { project, loading, error };
}