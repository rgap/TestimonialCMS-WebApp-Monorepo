import { Suspense } from 'react';
import { EmbedPage } from '@/features/embeds/components/EmbedPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <EmbedPage />
    </Suspense>
  );
}
