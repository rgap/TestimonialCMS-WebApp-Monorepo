# <span style="color:#e67e22">Endpoints por Ruta</span>

Este documento lista todas las rutas de la aplicación, las páginas correspondientes y los endpoints a los que se hacen consultas desde cada página.

**Leyenda métodos HTTP:**  
<span style="color:#27ae60">● GET</span> &nbsp; <span style="color:#2980b9">● POST</span> &nbsp; <span style="color:#f39c12">● PUT</span> &nbsp; <span style="color:#e74c3c">● DELETE</span>

---

## 🔐 <span style="color:#9b59b6">Autenticación</span>

### `/login`

**Página:** `src/app/(auth)/login/page.tsx`  
**Componente:** `AuthLoginPage`

**Endpoints:**

- <span style="color:#2980b9">POST</span> `/auth/signup` - Crear cuentas de prueba (opcional)
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/auth/signup`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/auth/signup`
- <span style="color:#2980b9">POST</span> `/auth/login` (Supabase Auth) - Iniciar sesión
  - <span style="color:#e67e22">URL Completa:</span> `https://{projectId}.supabase.co/auth/v1/token?grant_type=password`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/auth/v1/token?grant_type=password`
- <span style="color:#27ae60">GET</span> `/auth/user` - Obtener datos del usuario (desde AuthContext)
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/auth/user`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/auth/user`

---

### `/signup`

**Página:** `src/app/(auth)/signup/page.tsx`  
**Componente:** `AuthSignupPage`

**Endpoints:**

- <span style="color:#2980b9">POST</span> `/auth/signup` - Registrar nuevo usuario
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/auth/signup`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/auth/signup`
- <span style="color:#2980b9">POST</span> `/auth/login` (Supabase Auth) - Auto-login después del registro
  - <span style="color:#e67e22">URL Completa:</span> `https://{projectId}.supabase.co/auth/v1/token?grant_type=password`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/auth/v1/token?grant_type=password`
- <span style="color:#27ae60">GET</span> `/auth/user` - Obtener datos del usuario (desde AuthContext)
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/auth/user`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/auth/user`

---

### `/forgot-password`

**Página:** `src/app/(auth)/forgot-password/page.tsx`  
**Componente:** `AuthForgotPasswordPage`

**Endpoints:**

- <span style="color:#7f8c8d">Ninguno (página estática, funcionalidad no implementada)</span>

---

## 📊 <span style="color:#2980b9">Dashboard</span>

### `/dashboard/projects`

**Página:** `src/app/(dashboard)/dashboard/projects/page.tsx`  
**Componente:** `DashboardProjectsListPage`

**Endpoints:**

- <span style="color:#27ae60">GET</span> `/projects` - Listar proyectos del usuario
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects`

---

### `/dashboard/projects/new`

**Página:** `src/app/(dashboard)/dashboard/projects/new/page.tsx`  
**Componente:** `ProjectCreatePage`

**Endpoints:**

- <span style="color:#2980b9">POST</span> `/projects` - Crear nuevo proyecto
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects`

---

### `/dashboard/projects/[projectId]`

**Página:** `src/app/(dashboard)/dashboard/projects/[projectId]/page.tsx`

**Endpoints:**

- <span style="color:#7f8c8d">Ninguno (redirige a `/dashboard/projects/[projectId]/testimonials`)</span>

---

### `/dashboard/projects/[projectId]/testimonials`

**Página:** `src/app/(dashboard)/dashboard/projects/[projectId]/testimonials/page.tsx`  
**Componente:** `ProjectTestimonialsPage`

**Endpoints:**

- <span style="color:#27ae60">GET</span> `/projects/{projectId}/testimonials` - Listar testimonios del proyecto
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/testimonials`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/testimonials`
- <span style="color:#e74c3c">DELETE</span> `/projects/{projectId}/testimonials/{testimonialId}` - Eliminar testimonio
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/testimonials/{testimonialId}`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/testimonials/test_ejemplo123`
- <span style="color:#2980b9">POST</span> `/projects/{projectId}/testimonials/{testimonialId}/approve` - Aprobar/publicar testimonio
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/testimonials/{testimonialId}/approve`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/testimonials/test_ejemplo123/approve`
- <span style="color:#27ae60">GET</span> `/projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123`

---

### `/dashboard/projects/[projectId]/testimonials/[testimonialId]`

**Página:** `src/app/(dashboard)/dashboard/projects/[projectId]/testimonials/[testimonialId]/page.tsx`  
**Componente:** `TestimonialEditPage`

**Endpoints:**

- <span style="color:#27ae60">GET</span> `/projects/{projectId}/testimonials/{testimonialId}` - Obtener testimonio específico
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/testimonials/{testimonialId}`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/testimonials/test_ejemplo123`
- <span style="color:#f39c12">PUT</span> `/projects/{projectId}/testimonials/{testimonialId}` - Actualizar testimonio
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/testimonials/{testimonialId}`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/testimonials/test_ejemplo123`
- <span style="color:#2980b9">POST</span> `/projects/{projectId}/testimonials/{testimonialId}/approve` - Cambiar estado de aprobación
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/testimonials/{testimonialId}/approve`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/testimonials/test_ejemplo123/approve`
- <span style="color:#2980b9">POST</span> `/api/cloudinary/upload` - Subir foto de avatar (si se sube imagen)
  - <span style="color:#e67e22">URL Completa:</span> `/api/cloudinary/upload` (relativa) o `https://tu-dominio.com/api/cloudinary/upload` (absoluta)
  - <span style="color:#2ecc71">Ejemplo:</span> `https://tu-dominio.com/api/cloudinary/upload`
- <span style="color:#27ae60">GET</span> `/projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123`

---

### `/dashboard/projects/[projectId]/capture-forms`

**Página:** `src/app/(dashboard)/dashboard/projects/[projectId]/capture-forms/page.tsx`  
**Componente:** `ProjectCaptureFormsListPage`

**Endpoints:**

- <span style="color:#27ae60">GET</span> `/projects/{projectId}/capture-forms` - Listar formularios de captura
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/capture-forms`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/capture-forms`
- <span style="color:#e74c3c">DELETE</span> `/projects/{projectId}/capture-forms/{formId}` - Eliminar formulario
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/capture-forms/{formId}`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/capture-forms/form_ejemplo123`
- <span style="color:#27ae60">GET</span> `/projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123`

---

### `/dashboard/projects/[projectId]/capture-forms/new`

**Página:** `src/app/(dashboard)/dashboard/projects/[projectId]/capture-forms/new/page.tsx`  
**Componente:** `CaptureFormNewPage`

**Endpoints:**

- <span style="color:#2980b9">POST</span> `/projects/{projectId}/capture-forms` - Crear nuevo formulario de captura
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/capture-forms`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/capture-forms`
- <span style="color:#27ae60">GET</span> `/projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123`

---

### `/dashboard/projects/[projectId]/capture-forms/[formId]/edit`

**Página:** `src/app/(dashboard)/dashboard/projects/[projectId]/capture-forms/[formId]/edit/page.tsx`  
**Componente:** `ProjectCaptureFormEditPage`

**Endpoints:**

- <span style="color:#2980b9">POST</span> `/projects/{projectId}/capture-forms` - Crear formulario (si es nuevo)
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/capture-forms`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/capture-forms`
- <span style="color:#f39c12">PUT</span> `/projects/{projectId}/capture-forms/{formId}` - Actualizar formulario existente
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/capture-forms/{formId}`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/capture-forms/form_ejemplo123`
- <span style="color:#27ae60">GET</span> `/projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123`

---

### `/dashboard/projects/[projectId]/editors`

**Página:** `src/app/(dashboard)/dashboard/projects/[projectId]/editors/page.tsx`  
**Componente:** `ProjectEditorsManagementPage`

**Endpoints:**

- <span style="color:#27ae60">GET</span> `/projects/{projectId}/editors` - Listar editores del proyecto
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/editors`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/editors`
- <span style="color:#2980b9">POST</span> `/projects/{projectId}/editors` - Agregar editor al proyecto
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/editors`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/editors`
- <span style="color:#e74c3c">DELETE</span> `/projects/{projectId}/editors/{editorId}` - Eliminar editor del proyecto
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/editors/{editorId}`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/editors/editor_ejemplo123`
- <span style="color:#27ae60">GET</span> `/projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123`

---

### `/dashboard/projects/[projectId]/api`

**Página:** `src/app/(dashboard)/dashboard/projects/[projectId]/api/page.tsx`  
**Componente:** `ProjectAPIPage`

**Endpoints:**

- <span style="color:#27ae60">GET</span> `/projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123`
- <span style="color:#7f8c8d">Ningún otro endpoint (página informativa que muestra ejemplos de código)</span>

---

### `/dashboard/projects/[projectId]/embeds`

**Página:** `src/app/(dashboard)/dashboard/projects/[projectId]/embeds/page.tsx`  
**Componente:** `ProjectEmbedsListPage`

**Endpoints:**

- <span style="color:#27ae60">GET</span> `/projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123`
- <span style="color:#7f8c8d">Ningún otro endpoint (página informativa que genera código de embed)</span>

---

### `/dashboard/projects/[projectId]/import-testimonials`

**Página:** `src/app/(dashboard)/dashboard/projects/[projectId]/import-testimonials/page.tsx`  
**Componente:** `ProjectImportSourcePage`

**Endpoints:**

- <span style="color:#27ae60">GET</span> `/projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123`
- <span style="color:#7f8c8d">Ningún otro endpoint (página de selección de tipo)</span>

---

### `/dashboard/projects/[projectId]/import-testimonials/text`

**Página:** `src/app/(dashboard)/dashboard/projects/[projectId]/import-testimonials/text/page.tsx`  
**Componente:** `ProjectImportFromTextPage`

**Endpoints:**

- <span style="color:#2980b9">POST</span> `/projects/{projectId}/testimonials` - Crear testimonio de texto
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/testimonials`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/testimonials`
- <span style="color:#2980b9">POST</span> `/api/cloudinary/upload` - Subir foto de avatar (si se sube imagen)
  - <span style="color:#e67e22">URL Completa:</span> `/api/cloudinary/upload` (relativa) o `https://tu-dominio.com/api/cloudinary/upload` (absoluta)
  - <span style="color:#2ecc71">Ejemplo:</span> `https://tu-dominio.com/api/cloudinary/upload`
- <span style="color:#27ae60">GET</span> `/projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123`

---

### `/dashboard/projects/[projectId]/import-testimonials/image`

**Página:** `src/app/(dashboard)/dashboard/projects/[projectId]/import-testimonials/image/page.tsx`  
**Componente:** `ProjectImportFromImagePage`

**Endpoints:**

- <span style="color:#2980b9">POST</span> `/projects/{projectId}/testimonials` - Crear testimonio de imagen
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/testimonials`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/testimonials`
- <span style="color:#2980b9">POST</span> `/api/cloudinary/upload` - Subir imagen del testimonio
  - <span style="color:#e67e22">URL Completa:</span> `/api/cloudinary/upload` (relativa) o `https://tu-dominio.com/api/cloudinary/upload` (absoluta)
  - <span style="color:#2ecc71">Ejemplo:</span> `https://tu-dominio.com/api/cloudinary/upload`
- <span style="color:#2980b9">POST</span> `/api/cloudinary/upload` - Subir foto de avatar (si se sube imagen)
  - <span style="color:#e67e22">URL Completa:</span> `/api/cloudinary/upload` (relativa) o `https://tu-dominio.com/api/cloudinary/upload` (absoluta)
  - <span style="color:#2ecc71">Ejemplo:</span> `https://tu-dominio.com/api/cloudinary/upload`
- <span style="color:#27ae60">GET</span> `/projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123`

---

### `/dashboard/projects/[projectId]/import-testimonials/video`

**Página:** `src/app/(dashboard)/dashboard/projects/[projectId]/import-testimonials/video/page.tsx`  
**Componente:** `ProjectImportFromVideoPage`

**Endpoints:**

- <span style="color:#2980b9">POST</span> `/projects/{projectId}/testimonials` - Crear testimonio de video
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/testimonials`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/testimonials`
- <span style="color:#2980b9">POST</span> `/api/cloudinary/upload` - Subir foto de avatar (si se sube imagen)
  - <span style="color:#e67e22">URL Completa:</span> `/api/cloudinary/upload` (relativa) o `https://tu-dominio.com/api/cloudinary/upload` (absoluta)
  - <span style="color:#2ecc71">Ejemplo:</span> `https://tu-dominio.com/api/cloudinary/upload`
- <span style="color:#27ae60">GET</span> `/projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123`

---

## 📝 <span style="color:#27ae60">Formularios Públicos</span>

### `/cf/[formId]`

**Página:** `src/app/(public-forms)/cf/[formId]/page.tsx`  
**Componente:** `PublicCaptureFormPage`

**Endpoints:**

- <span style="color:#27ae60">GET</span> `/public/capture-forms/{formId}` - Obtener formulario público (no implementado, usa configuración mock)
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/public/capture-forms/{formId}`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/public/capture-forms/form_ejemplo123`
- <span style="color:#2980b9">POST</span> `/public/capture-forms/{formId}/responses` - Enviar respuesta del formulario (no implementado completamente)
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/public/capture-forms/{formId}/responses`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/public/capture-forms/form_ejemplo123/responses`
- <span style="color:#2980b9">POST</span> `/api/cloudinary/upload` - Subir foto de avatar (si se sube imagen)
  - <span style="color:#e67e22">URL Completa:</span> `/api/cloudinary/upload` (relativa) o `https://tu-dominio.com/api/cloudinary/upload` (absoluta)
  - <span style="color:#2ecc71">Ejemplo:</span> `https://tu-dominio.com/api/cloudinary/upload`

---

## 📺 <span style="color:#e74c3c">Embeds Públicos</span>

### `/embed`

**Página:** `src/app/(marketing)/embed/page.tsx`  
**Componente:** `EmbedPage`

**Endpoints:**

- <span style="color:#27ae60">GET</span> `/public/projects/{projectId}/testimonials` - Obtener testimonios aprobados para mostrar en el embed
  - <span style="color:#e67e22">URL Completa:</span> `https://ejemplo-dominio.com/api/projects/{projectId_path}/testimonials`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-dominio.com/api/projects/proj_ejemplo123/testimonials?status=approved&limit=20`

---

## 📣 <span style="color:#f39c12">Marketing</span>

### `/`

**Página:** `src/app/(marketing)/page.tsx`  
**Componente:** `MarketingLandingPage`

**Endpoints:**

- <span style="color:#7f8c8d">Ninguno (página estática)</span>

---

### `/about`

**Página:** `src/app/(marketing)/about/page.tsx`  
**Componente:** `AboutMissionPage`

**Endpoints:**

- <span style="color:#7f8c8d">Ninguno (página estática)</span>

---

## 🧩 <span style="color:#16a085">Hooks y Contextos</span>

### `useProject` Hook

**Archivo:** `src/hooks/useProject.ts`

**Endpoints:**

- <span style="color:#27ae60">GET</span> `/projects/{projectId}` - Obtener datos del proyecto
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123`

---

### `AuthContext`

**Archivo:** `src/features/auth/context/AuthContext.tsx`

**Endpoints:**

- <span style="color:#27ae60">GET</span> `/auth/user` - Obtener datos del usuario autenticado
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/auth/user`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/auth/user`
- <span style="color:#2980b9">POST</span> `/auth/signup` - Registrar nuevo usuario
  - <span style="color:#e67e22">URL Completa:</span> `{SUPABASE_EDGE_FUNCTION_URL}/auth/signup`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/auth/signup`
- <span style="color:#2980b9">POST</span> `/auth/login` (Supabase Auth) - Iniciar sesión
  - <span style="color:#e67e22">URL Completa:</span> `https://{projectId}.supabase.co/auth/v1/token?grant_type=password`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/auth/v1/token?grant_type=password`
- <span style="color:#2980b9">POST</span> `/auth/logout` (Supabase Auth) - Cerrar sesión
  - <span style="color:#e67e22">URL Completa:</span> `https://{projectId}.supabase.co/auth/v1/logout`
  - <span style="color:#2ecc71">Ejemplo:</span> `https://ejemplo-proyecto-id.supabase.co/auth/v1/logout`

---

## ⚙️ <span style="color:#c0392b">API Routes (Next.js)</span>

### `/api/cloudinary/upload`

**Archivo:** `src/app/api/cloudinary/upload/route.ts`

**Endpoints:**

- <span style="color:#2980b9">POST</span> Endpoint interno de Next.js para subir archivos a Cloudinary
  - <span style="color:#e67e22">URL Completa:</span> `/api/cloudinary/upload` (relativa) o `https://tu-dominio.com/api/cloudinary/upload` (absoluta)
  - <span style="color:#2ecc71">Ejemplo:</span> `https://tu-dominio.com/api/cloudinary/upload`

---

### `/api/cloudinary/delete`

**Archivo:** `src/app/api/cloudinary/delete/route.ts`

**Endpoints:**

- <span style="color:#2980b9">POST</span> Endpoint interno de Next.js para eliminar archivos de Cloudinary
  - <span style="color:#e67e22">URL Completa:</span> `/api/cloudinary/delete` (relativa) o `https://tu-dominio.com/api/cloudinary/delete` (absoluta)
  - <span style="color:#2ecc71">Ejemplo:</span> `https://tu-dominio.com/api/cloudinary/delete`

---

## 🗒️ <span style="color:#7f8c8d">Notas</span>

1. **Variables en las URLs:**

   - `{SUPABASE_EDGE_FUNCTION_URL}` = `https://{projectId}.supabase.co/functions/v1/{edgeFunctionName}`
   - `{projectId}` = ID del proyecto Supabase (ej: `ejemplo-proyecto-id`)
   - `{edgeFunctionName}` = Nombre de la Edge Function (ej: `ejemplo-edge-function`)
   - `{projectId_path}` = ID del proyecto en la base de datos (ej: `proj_ejemplo123`)
   - Ejemplo completo: `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function`

2. **Autenticación:** La mayoría de los endpoints requieren un token de acceso (`access_token`) almacenado en `localStorage` y enviado en el header `Authorization: Bearer {token}`.

3. **Hooks compartidos:** Los hooks `useProject` y `useAuth` se utilizan en múltiples páginas, por lo que los endpoints que llaman aparecen en varias rutas.

4. **Cloudinary:** Las subidas de imágenes se realizan a través de la API route de Next.js `/api/cloudinary/upload`, que internamente llama a la API de Cloudinary.

5. **Supabase Auth:** Algunos endpoints de autenticación se llaman directamente a Supabase Auth (como login y logout), mientras que otros pasan por la Edge Function del backend.

6. **Endpoints públicos:** Los endpoints públicos (`/public/*`) no requieren autenticación pero pueden requerir una API key del proyecto.

7. **API Pública:** Los endpoints de la API pública utilizan la URL base: `https://ejemplo-dominio.com/api`
