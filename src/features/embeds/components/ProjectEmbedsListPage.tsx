'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Share2, Copy, Grid3x3, Shuffle, CheckCircle, Tag, Palette, Settings, MessageSquare, ChevronDown } from 'lucide-react';
import { useProject } from '@/hooks';

interface EmbedConfig {
  autoplay: boolean;
  showNavigation: boolean;
  columns: number;
  theme: 'light' | 'dark';
  limit: string; // 'all' or a number string like '5', '10', etc.
}

export function ProjectEmbedsListPage() {
  const params = useParams();
  const projectId = typeof params.projectId === 'string' ? params.projectId : undefined;
  const { project } = useProject(projectId);
  const router = useRouter();
  
  const [carouselConfig, setCarouselConfig] = useState<EmbedConfig>({
    autoplay: true,
    showNavigation: true,
    columns: 1,
    theme: 'light',
    limit: 'all'
  });
  
  const [gridConfig, setGridConfig] = useState<EmbedConfig>({
    autoplay: false,
    showNavigation: false,
    columns: 3,
    theme: 'light',
    limit: 'all'
  });
  
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const buildEmbedUrl = (type: 'carousel' | 'grid', config: EmbedConfig) => {
    const params = new URLSearchParams({
      project: projectId || '',
      type: type,
      status: 'approved',
      ...(type === 'carousel' && { autoplay: config.autoplay.toString(), navigation: config.showNavigation.toString() }),
      ...(type === 'grid' && { columns: config.columns.toString() }),
      theme: config.theme,
      limit: config.limit
    });
    
    return `https://bush-amend-64313196.figma.site/embed?${params.toString()}`;
  };
  
  const buildLocalEmbedUrl = (type: 'carousel' | 'grid', config: EmbedConfig) => {
    const params = new URLSearchParams({
      project: projectId || '',
      type: type,
      status: 'approved',
      ...(type === 'carousel' && { autoplay: config.autoplay.toString(), navigation: config.showNavigation.toString() }),
      ...(type === 'grid' && { columns: config.columns.toString() }),
      theme: config.theme,
      limit: config.limit
    });
    
    return `/embed?${params.toString()}`;
  };
  
  const buildIframeCode = (type: 'carousel' | 'grid', config: EmbedConfig) => {
    const url = buildEmbedUrl(type, config);
    const height = type === 'carousel' ? '500' : '800';
    return `<iframe src="${url}" width="100%" height="${height}" frameborder="0" loading="lazy" allowtransparency="true" style="border: none; display: block;"></iframe>`;
  };
  
  const handleCopy = (id: string, text: string) => {
    try {
      // Fallback method that works in more contexts
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
      
      document.body.removeChild(textArea);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
  
  return (
    
      <div className="container max-w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="mb-3 text-[var(--color-text-primary)]\">Embeds</h2>
            <p className="text-lg text-[var(--color-text-secondary)]">
              Integra testimonios en tu sitio web con estos widgets predefinidos
            </p>
          </div>
          
          {/* Button to testimonials */}
          <Button
            onClick={() => router.push(`/dashboard/projects/${projectId}/testimonials`)}
            size="lg"
            className="px-8 py-4 w-full sm:w-auto"
          >
            <MessageSquare size={22} />
            Ir a testimonios
          </Button>
        </div>
        
        <div className="space-y-8">
          {/* Carousel Embed */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-[var(--color-border)] overflow-hidden w-full">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-[var(--color-primary-500)] via-[var(--color-primary-600)] to-[var(--color-secondary-600)] p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shuffle size={24} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white mb-1">Carrusel de testimonios</h3>
                  <p className="text-white/90 text-sm sm:text-base">
                    Muestra testimonios en un carrusel deslizante con navegación automática
                  </p>
                </div>
              </div>
            </div>
            
            {/* Configuration */}
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)] mb-3">
                    <Settings size={16} className="text-[var(--color-secondary-600)]" />
                    Reproducción automática
                  </label>
                  <div className="flex items-center gap-3 px-4 py-3 bg-[var(--color-neutral-50)] rounded-xl border-2 border-[var(--color-border)]">
                    <span className="text-sm text-[var(--color-text-secondary)] flex-1">
                      {carouselConfig.autoplay ? 'Activada' : 'Desactivada'}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={carouselConfig.autoplay}
                        onChange={(e) => setCarouselConfig({...carouselConfig, autoplay: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary-600)]"></div>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)] mb-3">
                    <Palette size={16} className="text-[var(--color-accent-600)]" />
                    Tema de colores
                  </label>
                  <div className="relative">
                    <select 
                      value={carouselConfig.theme}
                      onChange={(e) => setCarouselConfig({...carouselConfig, theme: e.target.value as 'light' | 'dark'})}
                      className="w-full px-4 py-3 pr-10 bg-[var(--color-neutral-50)] border-2 border-[var(--color-border)] rounded-xl focus:border-[var(--color-primary-500)] focus:bg-white focus:outline-none transition-all appearance-none cursor-pointer text-[var(--color-text-primary)] font-medium"
                    >
                      <option value="light">Claro</option>
                      <option value="dark">Oscuro</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" />
                  </div>
                </div>
                
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)] mb-3">
                    <Tag size={16} className="text-[var(--color-accent-600)]" />
                    Límite de testimonios
                  </label>
                  <div className="relative">
                    <select 
                      value={carouselConfig.limit}
                      onChange={(e) => setCarouselConfig({...carouselConfig, limit: e.target.value})}
                      className="w-full px-4 py-3 pr-10 bg-[var(--color-neutral-50)] border-2 border-[var(--color-border)] rounded-xl focus:border-[var(--color-primary-500)] focus:bg-white focus:outline-none transition-all appearance-none cursor-pointer text-[var(--color-text-primary)] font-medium"
                    >
                      <option value="all">Todos</option>
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="20">20</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" />
                  </div>
                </div>
              </div>
              
              {/* Embed Code */}
              <div className="bg-[var(--color-neutral-50)] rounded-xl p-4 sm:p-6 border-2 border-[var(--color-border)] mt-6 sm:mt-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <h6 className="font-medium text-[var(--color-text-primary)]">Código del embed</h6>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleCopy('carousel', buildIframeCode('carousel', carouselConfig))}
                    className="px-4 py-2 w-full sm:w-auto"
                  >
                    {copiedId === 'carousel' ? (
                      <>
                        <CheckCircle size={18} className="text-[var(--color-success-600)]" />
                        ¡Copiado!
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        Copiar
                      </>
                    )}
                  </Button>
                </div>
                <code className="text-xs sm:text-sm text-[var(--color-text-secondary)] block overflow-x-auto bg-white p-3 sm:p-4 rounded-lg border border-[var(--color-border)] break-all whitespace-pre-wrap">
                  {buildIframeCode('carousel', carouselConfig)}
                </code>
              </div>
            </div>
          </div>
          
          {/* Grid Embed */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-[var(--color-border)] overflow-hidden w-full">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-[var(--color-accent-500)] via-[var(--color-accent-600)] to-cyan-600 p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <Grid3x3 size={24} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white mb-1">Grid de testimonios</h3>
                  <p className="text-white/90 text-sm sm:text-base">
                    Muestra testimonios en una cuadrícula organizada y responsive
                  </p>
                </div>
              </div>
            </div>
            
            {/* Configuration */}
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)] mb-3">
                    <Grid3x3 size={16} className="text-[var(--color-secondary-600)]" />
                    Número de columnas
                  </label>
                  <div className="relative">
                    <select 
                      value={gridConfig.columns}
                      onChange={(e) => setGridConfig({...gridConfig, columns: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 pr-10 bg-[var(--color-neutral-50)] border-2 border-[var(--color-border)] rounded-xl focus:border-[var(--color-primary-500)] focus:bg-white focus:outline-none transition-all appearance-none cursor-pointer text-[var(--color-text-primary)] font-medium"
                    >
                      <option value="1">1 columna</option>
                      <option value="2">2 columnas</option>
                      <option value="3">3 columnas</option>
                      <option value="4">4 columnas</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" />
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)] mb-3">
                    <Palette size={16} className="text-[var(--color-accent-600)]" />
                    Tema de colores
                  </label>
                  <div className="relative">
                    <select 
                      value={gridConfig.theme}
                      onChange={(e) => setGridConfig({...gridConfig, theme: e.target.value as 'light' | 'dark'})}
                      className="w-full px-4 py-3 pr-10 bg-[var(--color-neutral-50)] border-2 border-[var(--color-border)] rounded-xl focus:border-[var(--color-primary-500)] focus:bg-white focus:outline-none transition-all appearance-none cursor-pointer text-[var(--color-text-primary)] font-medium"
                    >
                      <option value="light">Claro</option>
                      <option value="dark">Oscuro</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" />
                  </div>
                </div>
                
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)] mb-3">
                    <Tag size={16} className="text-[var(--color-accent-600)]" />
                    Límite de testimonios
                  </label>
                  <div className="relative">
                    <select 
                      value={gridConfig.limit}
                      onChange={(e) => setGridConfig({...gridConfig, limit: e.target.value})}
                      className="w-full px-4 py-3 pr-10 bg-[var(--color-neutral-50)] border-2 border-[var(--color-border)] rounded-xl focus:border-[var(--color-primary-500)] focus:bg-white focus:outline-none transition-all appearance-none cursor-pointer text-[var(--color-text-primary)] font-medium"
                    >
                      <option value="all">Todos</option>
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="20">20</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" />
                  </div>
                </div>
              </div>
              
              {/* Embed Code */}
              <div className="bg-[var(--color-neutral-50)] rounded-xl p-4 sm:p-6 border-2 border-[var(--color-border)]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <h6 className="font-medium text-[var(--color-text-primary)]">Código del embed</h6>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleCopy('grid', buildIframeCode('grid', gridConfig))}
                    className="px-4 py-2 w-full sm:w-auto"
                  >
                    {copiedId === 'grid' ? (
                      <>
                        <CheckCircle size={18} className="text-[var(--color-success-600)]" />
                        ¡Copiado!
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        Copiar
                      </>
                    )}
                  </Button>
                </div>
                <code className="text-xs sm:text-sm text-[var(--color-text-secondary)] block overflow-x-auto bg-white p-3 sm:p-4 rounded-lg border border-[var(--color-border)] break-all whitespace-pre-wrap">
                  {buildIframeCode('grid', gridConfig)}
                </code>
              </div>
            </div>
          </div>
        </div>
        
        {/* Info Box removed - now in header */}
      </div>
    
  );
}