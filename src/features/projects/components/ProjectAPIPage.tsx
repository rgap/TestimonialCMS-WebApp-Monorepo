'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/Button";
import { Code, Copy, Key, Check, ExternalLink, Book, Zap, Shield } from 'lucide-react';
import { useProject } from '@/hooks';

export function ProjectAPIPage() {
  const params = useParams();
  const projectId = typeof params.projectId === 'string' ? params.projectId : undefined;
  const router = useRouter();
  const { project } = useProject(projectId);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  
  // Simulated API key - in a real app, this would be generated/fetched from backend
  const apiKey = `tcms_${projectId}_sk_test_4eC39HqLyjWDarjtT1zdp7dc`;
  
  const copyToClipboard = (text: string, snippetId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(snippetId);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };
  
  const baseUrl = `https://bush-amend-64313196.figma.site/api`;
  
  const codeExamples = {
    javascript: `// Obtener testimonios aprobados
fetch('${baseUrl}/projects/${projectId}/testimonials?status=approved', {
  headers: {
    'Authorization': 'Bearer ${apiKey}',
    'Content-Type': 'application/json'
  }
})
  .then(response => response.json())
  .then(data => {
    console.log('Testimonios:', data.testimonials);
  })
  .catch(error => console.error('Error:', error));`,
    
    curl: `curl -X GET "${baseUrl}/projects/${projectId}/testimonials?status=approved" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json"`,
    
    python: `import requests

url = "${baseUrl}/projects/${projectId}/testimonials"
headers = {
    "Authorization": "Bearer ${apiKey}",
    "Content-Type": "application/json"
}
params = {
    "status": "approved"
}

response = requests.get(url, headers=headers, params=params)
data = response.json()
print(data["testimonials"])`,
    
    nodejs: `const axios = require('axios');

const getTestimonials = async () => {
  try {
    const response = await axios.get(
      '${baseUrl}/projects/${projectId}/testimonials',
      {
        headers: {
          'Authorization': 'Bearer ${apiKey}',
          'Content-Type': 'application/json'
        },
        params: {
          status: 'approved'
        }
      }
    );
    console.log('Testimonios:', response.data.testimonials);
  } catch (error) {
    console.error('Error:', error);
  }
};

getTestimonials();`
  };
  
  const responseExample = `{
  "success": true,
  "data": {
    "testimonials": [
      {
        "id": "test_abc123",
        "type": "text",
        "status": "approved",
        "authorName": "María García",
        "authorTitle": "CEO",
        "authorCompany": "TechCorp",
        "authorAvatar": "https://...",
        "content": "Excelente servicio, muy recomendado",
        "rating": 5,
        "createdAt": "2024-03-15T10:30:00Z",
        "approvedAt": "2024-03-15T11:00:00Z"
      },
      {
        "id": "test_def456",
        "type": "video",
        "status": "approved",
        "authorName": "Juan Pérez",
        "authorTitle": "Desarrollador",
        "authorCompany": "StartupXYZ",
        "videoUrl": "https://...",
        "thumbnailUrl": "https://...",
        "createdAt": "2024-03-14T15:20:00Z",
        "approvedAt": "2024-03-14T16:00:00Z"
      }
    ],
    "pagination": {
      "total": 45,
      "page": 1,
      "perPage": 20,
      "totalPages": 3
    }
  }
}`;

  return (
    
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[var(--color-primary-100)] rounded-lg">
              <Code size={24} className="text-[var(--color-primary-700)]" />
            </div>
            <h2 className="text-[var(--color-text-primary)]">API Pública</h2>
          </div>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Integra testimonios en cualquier plataforma usando nuestra API REST
          </p>
        </div>
        
        {/* API Key Section */}
        <div className="mb-12 p-8 bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-secondary-50)] rounded-xl border border-[var(--color-primary-200)]">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Key size={24} className="text-[var(--color-primary-700)]" />
            </div>
            <div>
              <h3 className="mb-2 text-[var(--color-text-primary)]">Tu API Key</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                Usa esta clave para autenticar tus peticiones. Mantenla segura y no la compartas públicamente.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-[var(--color-border)] shadow-sm">
            <div className="flex items-center gap-3">
              <code className="flex-1 text-sm font-mono text-[var(--color-text-primary)] break-all">
                {apiKey}
              </code>
              <Button
                onClick={() => copyToClipboard(apiKey, 'apikey')}
                variant="secondary"
                size="sm"
                className="flex-shrink-0"
              >
                {copiedSnippet === 'apikey' ? (
                  <>
                    <Check size={16} />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Importante:</strong> Esta es una clave de prueba. En producción, genera una clave específica y guárdala en tus variables de entorno.
            </p>
          </div>
        </div>
        
        {/* Base URL */}
        <div className="mb-12">
          <h3 className="mb-4 text-[var(--color-text-primary)]">URL Base</h3>
          <div className="bg-[var(--color-neutral-900)] rounded-lg p-4 border border-[var(--color-border)]">
            <code className="text-sm font-mono text-green-400">{baseUrl}</code>
          </div>
        </div>
        
        {/* Endpoints */}
        <div className="mb-12">
          <h3 className="mb-6 text-[var(--color-text-primary)]">Endpoints Disponibles</h3>
          
          {/* GET Testimonials */}
          <div className="mb-8 bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
            <div className="p-6 border-b border-[var(--color-border)] bg-[var(--color-neutral-50)]">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm font-mono">
                  GET
                </span>
                <code className="text-sm font-mono text-[var(--color-text-primary)]">
                  /projects/{'{projectId}'}/testimonials
                </code>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Obtiene todos los testimonios aprobados de un proyecto
              </p>
            </div>
            
            <div className="p-6">
              <h4 className="mb-3 text-[var(--color-text-primary)]">Parámetros de consulta</h4>
              <div className="space-y-3 mb-6">
                <div className="flex gap-4">
                  <code className="text-sm font-mono text-[var(--color-primary-700)] min-w-[120px]">status</code>
                  <div className="flex-1">
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Filtrar por estado: <code>approved</code> o <code>pending</code> (default: <code>approved</code>)
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <code className="text-sm font-mono text-[var(--color-primary-700)] min-w-[120px]">type</code>
                  <div className="flex-1">
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Filtrar por tipo: <code>text</code>, <code>video</code>, o <code>image</code>
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <code className="text-sm font-mono text-[var(--color-primary-700)] min-w-[120px]">page</code>
                  <div className="flex-1">
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Número de página (default: <code>1</code>)
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <code className="text-sm font-mono text-[var(--color-primary-700)] min-w-[120px]">perPage</code>
                  <div className="flex-1">
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Testimonios por página (default: <code>20</code>, max: <code>100</code>)
                    </p>
                  </div>
                </div>
              </div>
              
              <h4 className="mb-3 text-[var(--color-text-primary)]">Headers requeridos</h4>
              <div className="bg-[var(--color-neutral-900)] rounded-lg p-4 mb-6">
                <code className="text-sm font-mono text-gray-300 block mb-2">
                  Authorization: Bearer {'{tu_api_key}'}
                </code>
                <code className="text-sm font-mono text-gray-300 block">
                  Content-Type: application/json
                </code>
              </div>
            </div>
          </div>
        </div>
        
        {/* Code Examples */}
        <div className="mb-12">
          <h3 className="mb-6 text-[var(--color-text-primary)]">Ejemplos de Código</h3>
          
          {/* JavaScript/Fetch */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[var(--color-text-primary)]">JavaScript (Fetch)</h4>
              <Button
                onClick={() => copyToClipboard(codeExamples.javascript, 'js')}
                variant="secondary"
                size="sm"
              >
                {copiedSnippet === 'js' ? (
                  <>
                    <Check size={16} />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copiar
                  </>
                )}
              </Button>
            </div>
            <div className="bg-[var(--color-neutral-900)] rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm font-mono text-gray-300">
                <code>{codeExamples.javascript}</code>
              </pre>
            </div>
          </div>
          
          {/* cURL */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[var(--color-text-primary)]">cURL</h4>
              <Button
                onClick={() => copyToClipboard(codeExamples.curl, 'curl')}
                variant="secondary"
                size="sm"
              >
                {copiedSnippet === 'curl' ? (
                  <>
                    <Check size={16} />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copiar
                  </>
                )}
              </Button>
            </div>
            <div className="bg-[var(--color-neutral-900)] rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm font-mono text-gray-300">
                <code>{codeExamples.curl}</code>
              </pre>
            </div>
          </div>
          
          {/* Python */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[var(--color-text-primary)]">Python</h4>
              <Button
                onClick={() => copyToClipboard(codeExamples.python, 'python')}
                variant="secondary"
                size="sm"
              >
                {copiedSnippet === 'python' ? (
                  <>
                    <Check size={16} />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copiar
                  </>
                )}
              </Button>
            </div>
            <div className="bg-[var(--color-neutral-900)] rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm font-mono text-gray-300">
                <code>{codeExamples.python}</code>
              </pre>
            </div>
          </div>
          
          {/* Node.js */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[var(--color-text-primary)]">Node.js (Axios)</h4>
              <Button
                onClick={() => copyToClipboard(codeExamples.nodejs, 'nodejs')}
                variant="secondary"
                size="sm"
              >
                {copiedSnippet === 'nodejs' ? (
                  <>
                    <Check size={16} />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copiar
                  </>
                )}
              </Button>
            </div>
            <div className="bg-[var(--color-neutral-900)] rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm font-mono text-gray-300">
                <code>{codeExamples.nodejs}</code>
              </pre>
            </div>
          </div>
        </div>
        
        {/* Response Example */}
        <div className="mb-12">
          <h3 className="mb-4 text-[var(--color-text-primary)]">Ejemplo de Respuesta</h3>
          <div className="bg-[var(--color-neutral-900)] rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm font-mono text-gray-300">
              <code>{responseExample}</code>
            </pre>
          </div>
        </div>
        
        {/* Rate Limiting */}
        <div className="mb-12 p-6 bg-white rounded-xl border border-[var(--color-border)]">
          <h3 className="mb-4 text-[var(--color-text-primary)]">Rate Limiting</h3>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <p>
              La API tiene los siguientes límites de uso para prevenir abusos:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Plan Free:</strong> 1,000 peticiones por hora</li>
              <li><strong>Plan Pro:</strong> 10,000 peticiones por hora</li>
              <li><strong>Plan Enterprise:</strong> Sin límite</li>
            </ul>
            <p className="mt-4">
              Si excedes el límite, recibirás una respuesta <code className="px-2 py-1 bg-gray-100 rounded">429 Too Many Requests</code>.
              Los límites se resetean cada hora.
            </p>
          </div>
        </div>
        
        {/* Error Codes */}
        <div className="mb-12 p-6 bg-white rounded-xl border border-[var(--color-border)]">
          <h3 className="mb-4 text-[var(--color-text-primary)]">Códigos de Error</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <code className="text-sm font-mono text-red-600 min-w-[80px]">400</code>
              <p className="text-sm text-[var(--color-text-secondary)]">Bad Request - Parámetros inválidos</p>
            </div>
            <div className="flex gap-4">
              <code className="text-sm font-mono text-red-600 min-w-[80px]">401</code>
              <p className="text-sm text-[var(--color-text-secondary)]">Unauthorized - API key inválida o faltante</p>
            </div>
            <div className="flex gap-4">
              <code className="text-sm font-mono text-red-600 min-w-[80px]">404</code>
              <p className="text-sm text-[var(--color-text-secondary)]">Not Found - Proyecto no encontrado</p>
            </div>
            <div className="flex gap-4">
              <code className="text-sm font-mono text-red-600 min-w-[80px]">429</code>
              <p className="text-sm text-[var(--color-text-secondary)]">Too Many Requests - Límite de rate excedido</p>
            </div>
            <div className="flex gap-4">
              <code className="text-sm font-mono text-red-600 min-w-[80px]">500</code>
              <p className="text-sm text-[var(--color-text-secondary)]">Internal Server Error - Error del servidor</p>
            </div>
          </div>
        </div>
      </div>
    
  );
}