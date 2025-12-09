'use client';

import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/Button";
import { FileText, Play, Image } from 'lucide-react';
import { useProject } from '@/hooks';

export function ProjectImportSourcePage() {
  const params = useParams();
  const projectId = typeof params.projectId === 'string' ? params.projectId : undefined;
  const { project } = useProject(projectId);
  
  return (
    
      <div className="container max-w-3xl py-12">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-[var(--color-text-primary)]">
            ¿De dónde proviene tu testimonio?
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Selecciona el formato o plataforma desde la que importarás
          </p>
        </div>
        
        {/* Type Buttons */}
        <div className="space-y-10">
          <div>
            <h4 className="mb-6 text-[var(--color-text-primary)]">Por formato</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Button
                href={`/dashboard/projects/${projectId}/import-testimonials/text`}
                variant="outline"
                className="h-auto py-10 flex-col"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-primary-100)] to-[var(--color-primary-200)] rounded-2xl flex items-center justify-center mb-5 shadow-sm">
                  <FileText size={36} className="text-[var(--color-primary-600)]" />
                </div>
                <span className="block text-base">Testimonio de texto</span>
              </Button>
              
              <Button
                href={`/dashboard/projects/${projectId}/import-testimonials/image`}
                variant="outline"
                className="h-auto py-10 flex-col"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-accent-100)] to-[var(--color-accent-200)] rounded-2xl flex items-center justify-center mb-5 shadow-sm">
                  <Image size={36} className="text-[var(--color-accent-600)]" />
                </div>
                <span className="block text-base">Testimonio de imagen</span>
              </Button>
              
              <Button
                href={`/dashboard/projects/${projectId}/import-testimonials/video`}
                variant="outline"
                className="h-auto py-10 flex-col"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-secondary-100)] to-[var(--color-secondary-200)] rounded-2xl flex items-center justify-center mb-5 shadow-sm">
                  <Play size={36} className="text-[var(--color-secondary-600)]" />
                </div>
                <span className="block text-base">Testimonio de video</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    
  );
}