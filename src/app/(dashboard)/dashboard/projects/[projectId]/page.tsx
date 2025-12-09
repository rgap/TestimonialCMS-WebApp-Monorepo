'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const router = useRouter();
  const params = useParams();
  
  useEffect(() => {
    router.replace(`/dashboard/projects/${params.projectId}/testimonials`);
  }, [router, params.projectId]);
  
  return null;
}
