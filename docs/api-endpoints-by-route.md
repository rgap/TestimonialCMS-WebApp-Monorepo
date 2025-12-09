# 🗺️ Endpoints por Ruta

Este documento lista todas las rutas de la aplicación, las páginas correspondientes y los endpoints a los que se hacen consultas desde cada página.

**Leyenda métodos HTTP:**  
🟢 GET · 🔵 POST · 🟠 PUT · 🔴 DELETE · ⚪ Sin endpoint

---

## 📚 Uso de Supabase

Esta aplicación utiliza **Supabase** como backend, combinando:

1. **Supabase Auth (Cliente JS)**: Para autenticación de usuarios

   - `supabase.auth.signInWithPassword()` - Login
   - `supabase.auth.signOut()` - Logout
   - Estas funciones usan el cliente de Supabase JS (`@supabase/supabase-js`) y no son llamadas HTTP directas

2. **Supabase Edge Functions**: Para operaciones de base de datos y lógica de negocio

   - Todas las operaciones CRUD (crear, leer, actualizar, eliminar) pasan por Edge Functions
   - Las Edge Functions internamente usan `supabase.from('tabla').select()`, `supabase.from('tabla').insert()`, `supabase.from('tabla').update()`, `supabase.from('tabla').delete()`
   - URL base: `https://{projectId}.supabase.co/functions/v1/{edgeFunctionName}`
   - Ejemplo real: `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03`

3. **Autenticación en Edge Functions**:

   - El token de acceso (`access_token`) se obtiene después del login y se almacena en `localStorage`
   - Se envía en el header: `Authorization: Bearer {ACCESS_TOKEN}`
   - La Edge Function valida el token y extrae el `userId` del JWT para verificar permisos

4. **Operaciones de Base de Datos**:
   - Las Edge Functions consultan tablas como: `projects`, `testimonials`, `capture_forms`, `project_editors`, `users`
   - Se verifican permisos basados en roles (admin/editor) y relaciones (owner/editor del proyecto)

---

## 📣 Marketing & Publico

### `/`

**Página:** `src/app/(marketing)/page.tsx`  
**Componente:** `MarketingLandingPage`

**Endpoints:**

- ⚪ Ninguno (página estática)

---

### `/about`

**Página:** `src/app/(marketing)/about/page.tsx`  
**Componente:** `AboutMissionPage`

**Endpoints:**

- ⚪ Ninguno (página estática)

---

## 🔐 Autenticación

### `/signup`

**Página:** `src/app/(auth)/signup/page.tsx`  
**Componente:** `AuthSignupPage`

**Endpoints:**

- 🔵 `POST /auth/signup` - Registrar nuevo usuario
  - **Implementación:** Llamada a Edge Function desde `AuthContext.signup()`
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/auth/signup`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/auth/signup`
  - **Headers:**
    ```
    Authorization: Bearer {PUBLIC_ANON_KEY}
    Content-Type: application/json
    ```
  - **Body:**
    ```json
    {
      "email": "usuario@ejemplo.com",
      "password": "contraseñaSegura123",
      "name": "Nombre del Usuario"
    }
    ```
  - **Response (200):**
    ```json
    {
      "success": true,
      "user": {
        "id": "uuid-del-usuario",
        "email": "usuario@ejemplo.com",
        "name": "Nombre del Usuario",
        "role": "editor"
      }
    }
    ```
  - **Nota:** Después del registro exitoso, se realiza auto-login usando `supabase.auth.signInWithPassword()`
- 🔵 `supabase.auth.signInWithPassword()` - Auto-login después del registro
  - **Implementación:** Usa el cliente de Supabase JS (`@supabase/supabase-js`)
  - **Código:** `const { data, error } = await supabase.auth.signInWithPassword({ email, password })`
  - **Descripción:** Después de un registro exitoso, se espera 1 segundo y luego se llama automáticamente a `login()` que usa `supabase.auth.signInWithPassword()` para autenticar al usuario
  - **Response:** Retorna un objeto `Session` con `access_token`, `refresh_token`, y datos del usuario
  - **Almacenamiento:** Los tokens se guardan en `localStorage` como `access_token` y `refresh_token`
- 🟢 `GET /auth/user` - Obtener datos del usuario (desde AuthContext)
  - **Implementación:** Llamada a Edge Function desde `AuthContext.fetchUser()`
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/auth/user`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/auth/user`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:** Ninguno (GET request)
  - **Response (200):**
    ```json
    {
      "user": {
        "id": "uuid-del-usuario",
        "email": "usuario@ejemplo.com",
        "name": "Nombre del Usuario",
        "role": "admin" | "editor"
      }
    }
    ```

---

### `/login`

**Página:** `src/app/(auth)/login/page.tsx`  
**Componente:** `AuthLoginPage`

**Endpoints:**

- 🔵 `supabase.auth.signInWithPassword()` - Iniciar sesión
  - **Implementación:** Usa el cliente de Supabase JS (`@supabase/supabase-js`) desde `AuthContext.login()`
  - **Código:** `const { data, error } = await supabase.auth.signInWithPassword({ email, password })`
  - **Descripción:** Autentica al usuario usando Supabase Auth. No es una llamada HTTP directa, sino que usa el cliente de Supabase que internamente hace la llamada a `https://{projectId}.supabase.co/auth/v1/token?grant_type=password`
  - **Parámetros:**
    ```typescript
    {
      email: string,
      password: string
    }
    ```
  - **Response:** Retorna un objeto con:
    ```typescript
    {
      data: {
        session: {
          access_token: string,
          refresh_token: string,
          expires_in: number,
          token_type: "bearer",
          user: {
            id: string,
            email: string
          }
        }
      },
      error: Error | null
    }
    ```
  - **Almacenamiento:** Los tokens se guardan automáticamente en `localStorage` como `access_token` y `refresh_token`
  - **Nota:** Después del login exitoso, se llama a `fetchUser()` para obtener los datos completos del usuario desde la Edge Function
- 🟢 `GET /auth/user` - Obtener datos del usuario (desde AuthContext)
  - **Implementación:** Llamada a Edge Function desde `AuthContext.fetchUser()`
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/auth/user`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/auth/user`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:** Ninguno (GET request)
  - **Response (200):**
    ```json
    {
      "user": {
        "id": "uuid-del-usuario",
        "email": "usuario@ejemplo.com",
        "name": "Nombre del Usuario",
        "role": "admin" | "editor"
      }
    }
    ```

---

### `/forgot-password`

**Página:** `src/app/(auth)/forgot-password/page.tsx`  
**Componente:** `AuthForgotPasswordPage`

**Endpoints:**

- ⚪ Ninguno (página estática, funcionalidad no implementada)

---

## 📊 Dashboard

### `/dashboard/projects`

**Página:** `src/app/(dashboard)/dashboard/projects/page.tsx`  
**Componente:** `DashboardProjectsListPage`

**Endpoints:**

- 🟢 `GET /projects` - Listar proyectos del usuario
  - **Implementación:** Llamada a Edge Function desde `DashboardProjectsListPage.loadProjects()`
  - **Supabase:** La Edge Function consulta la base de datos usando `supabase.from('projects')` y `supabase.from('project_editors')` para obtener proyectos propios y donde el usuario es editor
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/projects`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:** Ninguno (GET request)
  - **Response (200):**
    ```json
    {
      "projects": [
        {
          "id": "proj_ejemplo123",
          "name": "Mi Proyecto",
          "type": "testimonial",
          "testimonialsCount": 5,
          "createdAt": "2024-01-15T10:30:00Z",
          "updatedAt": "2024-01-15T10:30:00Z",
          "ownerId": "uuid-del-propietario",
          "ownerEmail": "propietario@ejemplo.com",
          "role": "owner"
        }
      ]
    }
    ```
- 🔴 `DELETE /projects/{projectId}` - Eliminar proyecto
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:** Ninguno (DELETE request)
  - **Response (200):**
    ```json
    {
      "success": true,
      "message": "Proyecto eliminado exitosamente"
    }
    ```

---

### `/dashboard/projects/new`

**Página:** `src/app/(dashboard)/dashboard/projects/new/page.tsx`  
**Componente:** `ProjectCreatePage`

**Endpoints:**

- 🔵 `POST /projects` - Crear nuevo proyecto
  - **Implementación:** Llamada a Edge Function desde `ProjectCreatePage.handleSubmit()`
  - **Supabase:** La Edge Function crea el proyecto usando `supabase.from('projects').insert()` con el `ownerId` extraído del token JWT
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/projects`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:**
    ```json
    {
      "name": "Mi Nuevo Proyecto"
    }
    ```
  - **Response (201):**
    ```json
    {
      "project": {
        "id": "proj_ejemplo123",
        "name": "Mi Nuevo Proyecto",
        "type": "testimonial",
        "testimonialsCount": 0,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "ownerId": "uuid-del-usuario"
      }
    }
    ```

---

### `/dashboard/help`

**Página:** `src/app/(dashboard)/dashboard/help/page.tsx`  
**Componente:** `DashboardHelpPage`

**Endpoints:**

- ⚪ Ninguno (página estática para ayuda y sugerencias, funcionalidad de envío no implementada)

---

## 🧙 Gestión de Proyectos

### `/dashboard/projects/:projectId`

**Página:** `src/app/(dashboard)/dashboard/projects/:projectId/page.tsx`

**Endpoints:**

- ⚪ Ninguno (redirige a `/dashboard/projects/:projectId/testimonials`)

---

### `/dashboard/projects/:projectId/testimonials`

**Página:** `src/app/(dashboard)/dashboard/projects/:projectId/testimonials/page.tsx`  
**Componente:** `ProjectTestimonialsPage`

**Endpoints:**

- 🟢 `GET /projects/{projectId}/testimonials` - Listar testimonios del proyecto
  - **Implementación:** Llamada a Edge Function desde `ProjectTestimonialsPage.fetchTestimonials()`
  - **Supabase:** La Edge Function consulta la base de datos usando `supabase.from('testimonials').select()` filtrando por `projectId` y verificando permisos del usuario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/testimonials`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/projects/proj_ejemplo123/testimonials`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:** Ninguno (GET request)
  - **Response (200):**
    ```json
    {
      "testimonials": [
        {
          "id": "test_ejemplo123",
          "projectId": "proj_ejemplo123",
          "type": "text" | "video" | "image",
          "content": "Contenido del testimonio",
          "customerName": "Juan Pérez",
          "customerEmail": "juan@ejemplo.com",
          "customerCompany": "Acme Corp",
          "customerJobTitle": "CEO",
          "customerAvatar": "https://...",
          "status": "pending" | "approved" | "published",
          "videoUrl": "https://...",
          "imageUrl": "https://...",
          "tags": ["tag1", "tag2"],
          "createdAt": "2024-01-15T10:30:00Z",
          "updatedAt": "2024-01-15T10:30:00Z"
        }
      ]
    }
    ```
- 🔴 `DELETE /projects/{projectId}/testimonials/{testimonialId}` - Eliminar testimonio
  - **Implementación:** Llamada a Edge Function desde `ProjectTestimonialsPage.handleDeleteTestimonial()`
  - **Supabase:** La Edge Function elimina el testimonio usando `supabase.from('testimonials').delete()` verificando permisos del usuario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/testimonials/{testimonialId}`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/projects/proj_ejemplo123/testimonials/test_ejemplo123`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:** Ninguno (DELETE request)
  - **Response (200):**
    ```json
    {
      "success": true,
      "message": "Testimonio eliminado exitosamente"
    }
    ```
- 🔵 `POST /projects/{projectId}/testimonials/{testimonialId}/approve` - Aprobar/publicar testimonio
  - **Implementación:** Llamada a Edge Function desde `ProjectTestimonialsPage.handleApproveTestimonial()`
  - **Supabase:** La Edge Function actualiza el testimonio usando `supabase.from('testimonials').update()` cambiando el `status` a "approved" y verificando permisos del usuario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/testimonials/{testimonialId}/approve`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/projects/proj_ejemplo123/testimonials/test_ejemplo123/approve`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:** Ninguno (POST request sin body)
  - **Response (200):**
    ```json
    {
      "testimonial": {
        "id": "test_ejemplo123",
        "status": "approved",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    }
    ```
- 🟢 `GET /projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - **Implementación:** Llamada a Edge Function desde `useProject.loadProject()`
  - **Supabase:** La Edge Function consulta la base de datos usando `supabase.from('projects').select()` y verifica permisos del usuario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/projects/proj_ejemplo123`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:** Ninguno (GET request)
  - **Response (200):**
    ```json
    {
      "project": {
        "id": "proj_ejemplo123",
        "name": "Mi Proyecto",
        "type": "testimonial",
        "testimonialsCount": 5,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "ownerId": "uuid-del-propietario"
      }
    }
    ```

---

### `/dashboard/projects/:projectId/testimonials/:testimonialId`

**Página:** `src/app/(dashboard)/dashboard/projects/:projectId/testimonials/:testimonialId/page.tsx`  
**Componente:** `TestimonialEditPage`

**Endpoints:**

- 🟢 `GET /projects/{projectId}/testimonials/{testimonialId}` - Obtener testimonio específico
  - **Implementación:** Llamada a Edge Function desde `TestimonialEditPage.loadTestimonial()`
  - **Supabase:** La Edge Function consulta la base de datos usando `supabase.from('testimonials').select()` filtrando por `id` y verificando permisos del usuario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/testimonials/{testimonialId}`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/projects/proj_ejemplo123/testimonials/test_ejemplo123`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:** Ninguno (GET request)
  - **Response (200):**
    ```json
    {
      "testimonial": {
        "id": "test_ejemplo123",
        "projectId": "proj_ejemplo123",
        "type": "text" | "video" | "image",
        "content": "Contenido del testimonio",
        "customerName": "Juan Pérez",
        "customerEmail": "juan@ejemplo.com",
        "customerCompany": "Acme Corp",
        "customerJobTitle": "CEO",
        "customerAvatar": "https://...",
        "status": "pending" | "approved" | "published",
        "videoUrl": "https://...",
        "imageUrl": "https://...",
        "tags": ["tag1", "tag2"],
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    }
    ```
- 🟠 `PUT /projects/{projectId}/testimonials/{testimonialId}` - Actualizar testimonio
  - **Implementación:** Llamada a Edge Function desde `TestimonialEditPage.handleSubmit()`
  - **Supabase:** La Edge Function actualiza el testimonio usando `supabase.from('testimonials').update()` verificando permisos del usuario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/testimonials/{testimonialId}`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/projects/proj_ejemplo123/testimonials/test_ejemplo123`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:**
    ```json
    {
      "type": "text" | "video" | "image",
      "content": "Contenido actualizado del testimonio",
      "customerName": "Juan Pérez",
      "customerEmail": "juan@ejemplo.com",
      "customerCompany": "Acme Corp",
      "customerJobTitle": "CEO",
      "customerAvatar": "https://...",
      "videoUrl": "https://...",
      "imageUrl": "https://...",
      "status": "published",
      "tags": ["tag1", "tag2"]
    }
    ```
  - **Response (200):**
    ```json
    {
      "testimonial": {
        "id": "test_ejemplo123",
        "content": "Contenido actualizado del testimonio",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    }
    ```
- 🔵 `POST /projects/{projectId}/testimonials/{testimonialId}/approve` - Cambiar estado de aprobación
  - **Implementación:** Llamada a Edge Function desde `TestimonialEditPage.handleApproveTestimonial()`
  - **Supabase:** La Edge Function actualiza el testimonio usando `supabase.from('testimonials').update()` cambiando el `status` a "approved" y verificando permisos del usuario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/testimonials/{testimonialId}/approve`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/projects/proj_ejemplo123/testimonials/test_ejemplo123/approve`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:** Ninguno (POST request sin body)
  - **Response (200):**
    ```json
    {
      "testimonial": {
        "id": "test_ejemplo123",
        "status": "approved",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    }
    ```
- 🔵 `POST /api/cloudinary/upload` - Subir foto de avatar (si se sube imagen)
  - **URL Completa:** `/api/cloudinary/upload` (relativa) o `https://tu-dominio.com/api/cloudinary/upload` (absoluta)
  - **Ejemplo:** `https://tu-dominio.com/api/cloudinary/upload`
  - **Headers:**
    ```
    Content-Type: application/json
    ```
  - **Body:**
    ```json
    {
      "file": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      "folder": "avatars" | "testimonials",
      "resourceType": "image" | "video" | "raw" | "auto"
    }
    ```
  - **Response (200):**
    ```json
    {
      "url": "http://res.cloudinary.com/...",
      "secureUrl": "https://res.cloudinary.com/...",
      "publicId": "avatars/abc123",
      "width": 800,
      "height": 600,
      "format": "jpg"
    }
    ```
- 🟢 `GET /projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - **Implementación:** Llamada a Edge Function desde `useProject.loadProject()`
  - **Supabase:** La Edge Function consulta la base de datos usando `supabase.from('projects').select()` y verifica permisos del usuario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/projects/proj_ejemplo123`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:** Ninguno (GET request)
  - **Response (200):**
    ```json
    {
      "project": {
        "id": "proj_ejemplo123",
        "name": "Mi Proyecto",
        "type": "testimonial",
        "testimonialsCount": 5,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "ownerId": "uuid-del-propietario"
      }
    }
    ```

---

### `/dashboard/projects/:projectId/import-testimonials`

**Página:** `src/app/(dashboard)/dashboard/projects/:projectId/import-testimonials/page.tsx`  
**Componente:** `ProjectImportSourcePage`

**Endpoints:**

- 🟢 `GET /projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - **Implementación:** Llamada a Edge Function desde `useProject.loadProject()`
  - **Supabase:** La Edge Function consulta la base de datos usando `supabase.from('projects').select()` y verifica permisos del usuario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/projects/proj_ejemplo123`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:** Ninguno (GET request)
  - **Response (200):**
    ```json
    {
      "project": {
        "id": "proj_ejemplo123",
        "name": "Mi Proyecto",
        "type": "testimonial",
        "testimonialsCount": 5,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "ownerId": "uuid-del-propietario"
      }
    }
    ```
- ⚪ Ningún otro endpoint (página de selección de tipo)

---

### `/dashboard/projects/:projectId/import-testimonials/text`

**Página:** `src/app/(dashboard)/dashboard/projects/:projectId/import-testimonials/text/page.tsx`  
**Componente:** `ProjectImportFromTextPage`

**Endpoints:**

- 🔵 `POST /projects/{projectId}/testimonials` - Crear testimonio de texto
  - **Implementación:** Llamada a Edge Function desde `ProjectImportFromTextPage.handleSubmit()`
  - **Supabase:** La Edge Function crea el testimonio usando `supabase.from('testimonials').insert()` con el `projectId` y verificando permisos del usuario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/testimonials`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/projects/proj_ejemplo123/testimonials`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:**
    ```json
    {
      "type": "text",
      "content": "Contenido del testimonio",
      "customerName": "Juan Pérez",
      "customerEmail": "juan@ejemplo.com",
      "customerCompany": "Acme Corp",
      "customerJobTitle": "CEO",
      "customerAvatar": "https://...",
      "status": "pending"
    }
    ```
  - **Response (201):**
    ```json
    {
      "testimonial": {
        "id": "test_ejemplo123",
        "projectId": "proj_ejemplo123",
        "type": "text",
        "content": "Contenido del testimonio",
        "customerName": "Juan Pérez",
        "status": "pending",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    }
    ```
- 🔵 `POST /api/cloudinary/upload` - Subir foto de avatar (si se sube imagen)
  - **URL Completa:** `/api/cloudinary/upload` (relativa) o `https://tu-dominio.com/api/cloudinary/upload` (absoluta)
  - **Ejemplo:** `https://tu-dominio.com/api/cloudinary/upload`
  - **Headers:**
    ```
    Content-Type: application/json
    ```
  - **Body:**
    ```json
    {
      "file": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      "folder": "avatars",
      "resourceType": "image"
    }
    ```
  - **Response (200):**
    ```json
    {
      "url": "http://res.cloudinary.com/...",
      "secureUrl": "https://res.cloudinary.com/...",
      "publicId": "avatars/abc123",
      "width": 800,
      "height": 600,
      "format": "jpg"
    }
    ```
- 🟢 `GET /projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - **Implementación:** Llamada a Edge Function desde `useProject.loadProject()`
  - **Supabase:** La Edge Function consulta la base de datos usando `supabase.from('projects').select()` y verifica permisos del usuario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/projects/proj_ejemplo123`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:** Ninguno (GET request)
  - **Response (200):**
    ```json
    {
      "project": {
        "id": "proj_ejemplo123",
        "name": "Mi Proyecto",
        "type": "testimonial",
        "testimonialsCount": 5,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "ownerId": "uuid-del-propietario"
      }
    }
    ```

---

### `/dashboard/projects/:projectId/import-testimonials/image`

**Página:** `src/app/(dashboard)/dashboard/projects/:projectId/import-testimonials/image/page.tsx`  
**Componente:** `ProjectImportFromImagePage`

**Endpoints:**

- 🔵 `POST /projects/{projectId}/testimonials` - Crear testimonio de imagen
  - **Implementación:** Llamada a Edge Function desde `ProjectImportFromImagePage.handleSubmit()`
  - **Supabase:** La Edge Function crea el testimonio usando `supabase.from('testimonials').insert()` con el `projectId` y verificando permisos del usuario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/testimonials`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/projects/proj_ejemplo123/testimonials`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:**
    ```json
    {
      "type": "image",
      "content": "Descripción o caption de la imagen",
      "customerName": "Juan Pérez",
      "customerEmail": "juan@ejemplo.com",
      "customerCompany": "Acme Corp",
      "customerJobTitle": "CEO",
      "customerAvatar": "https://...",
      "imageUrl": "https://res.cloudinary.com/...",
      "status": "pending"
    }
    ```
  - **Response (201):**
    ```json
    {
      "testimonial": {
        "id": "test_ejemplo123",
        "projectId": "proj_ejemplo123",
        "type": "image",
        "imageUrl": "https://res.cloudinary.com/...",
        "customerName": "Juan Pérez",
        "status": "pending",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    }
    ```
- 🔵 `POST /api/cloudinary/upload` - Subir imagen del testimonio
  - **URL Completa:** `/api/cloudinary/upload` (relativa) o `https://tu-dominio.com/api/cloudinary/upload` (absoluta)
  - **Ejemplo:** `https://tu-dominio.com/api/cloudinary/upload`
  - **Headers:**
    ```
    Content-Type: application/json
    ```
  - **Body:**
    ```json
    {
      "file": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      "folder": "testimonials",
      "resourceType": "image"
    }
    ```
  - **Response (200):**
    ```json
    {
      "url": "http://res.cloudinary.com/...",
      "secureUrl": "https://res.cloudinary.com/...",
      "publicId": "testimonials/abc123",
      "width": 800,
      "height": 600,
      "format": "jpg"
    }
    ```
- 🔵 `POST /api/cloudinary/upload` - Subir foto de avatar (si se sube imagen)
  - **URL Completa:** `/api/cloudinary/upload` (relativa) o `https://tu-dominio.com/api/cloudinary/upload` (absoluta)
  - **Ejemplo:** `https://tu-dominio.com/api/cloudinary/upload`
  - **Headers:**
    ```
    Content-Type: application/json
    ```
  - **Body:**
    ```json
    {
      "file": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      "folder": "avatars",
      "resourceType": "image"
    }
    ```
  - **Response (200):**
    ```json
    {
      "url": "http://res.cloudinary.com/...",
      "secureUrl": "https://res.cloudinary.com/...",
      "publicId": "avatars/abc123",
      "width": 800,
      "height": 600,
      "format": "jpg"
    }
    ```
- 🟢 `GET /projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - **Implementación:** Llamada a Edge Function desde `useProject.loadProject()`
  - **Supabase:** La Edge Function consulta la base de datos usando `supabase.from('projects').select()` y verifica permisos del usuario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/projects/proj_ejemplo123`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:** Ninguno (GET request)
  - **Response (200):**
    ```json
    {
      "project": {
        "id": "proj_ejemplo123",
        "name": "Mi Proyecto",
        "type": "testimonial",
        "testimonialsCount": 5,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "ownerId": "uuid-del-propietario"
      }
    }
    ```

---

### `/dashboard/projects/:projectId/import-testimonials/video`

**Página:** `src/app/(dashboard)/dashboard/projects/:projectId/import-testimonials/video/page.tsx`  
**Componente:** `ProjectImportFromVideoPage`

**Endpoints:**

- 🔵 `POST /projects/{projectId}/testimonials` - Crear testimonio de video
  - **Implementación:** Llamada a Edge Function desde `ProjectImportFromVideoPage.handleSubmit()`
  - **Supabase:** La Edge Function crea el testimonio usando `supabase.from('testimonials').insert()` con el `projectId` y verificando permisos del usuario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/testimonials`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/projects/proj_ejemplo123/testimonials`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:**
    ```json
    {
      "type": "video",
      "content": "Descripción o caption del video",
      "customerName": "Juan Pérez",
      "customerEmail": "juan@ejemplo.com",
      "customerCompany": "Acme Corp",
      "customerJobTitle": "CEO",
      "customerAvatar": "https://...",
      "videoUrl": "https://www.youtube.com/watch?v=...",
      "status": "pending"
    }
    ```
  - **Response (201):**
    ```json
    {
      "testimonial": {
        "id": "test_ejemplo123",
        "projectId": "proj_ejemplo123",
        "type": "video",
        "videoUrl": "https://www.youtube.com/watch?v=...",
        "customerName": "Juan Pérez",
        "status": "pending",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    }
    ```
- 🔵 `POST /api/cloudinary/upload` - Subir foto de avatar (si se sube imagen)
  - **URL Completa:** `/api/cloudinary/upload` (relativa) o `https://tu-dominio.com/api/cloudinary/upload` (absoluta)
  - **Ejemplo:** `https://tu-dominio.com/api/cloudinary/upload`
  - **Headers:**
    ```
    Content-Type: application/json
    ```
  - **Body:**
    ```json
    {
      "file": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      "folder": "avatars",
      "resourceType": "image"
    }
    ```
  - **Response (200):**
    ```json
    {
      "url": "http://res.cloudinary.com/...",
      "secureUrl": "https://res.cloudinary.com/...",
      "publicId": "avatars/abc123",
      "width": 800,
      "height": 600,
      "format": "jpg"
    }
    ```
- 🟢 `GET /projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - **Implementación:** Llamada a Edge Function desde `useProject.loadProject()`
  - **Supabase:** La Edge Function consulta la base de datos usando `supabase.from('projects').select()` y verifica permisos del usuario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/projects/proj_ejemplo123`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:** Ninguno (GET request)
  - **Response (200):**
    ```json
    {
      "project": {
        "id": "proj_ejemplo123",
        "name": "Mi Proyecto",
        "type": "testimonial",
        "testimonialsCount": 5,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "ownerId": "uuid-del-propietario"
      }
    }
    ```

---

### `/dashboard/projects/:projectId/capture-forms`

**Página:** `src/app/(dashboard)/dashboard/projects/:projectId/capture-forms/page.tsx`  
**Componente:** `ProjectCaptureFormsListPage`

**Endpoints:**

- 🟢 `GET /projects/{projectId}/capture-forms` - Listar formularios de captura
  - **Implementación:** Llamada a Edge Function desde `ProjectCaptureFormsListPage.fetchForms()`
  - **Supabase:** La Edge Function consulta la base de datos usando `supabase.from('capture_forms').select()` filtrando por `projectId` y verificando permisos del usuario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/capture-forms`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/projects/proj_ejemplo123/capture-forms`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:** Ninguno (GET request)
  - **Response (200):**
    ```json
    {
      "forms": [
        {
          "id": "form_ejemplo123",
          "projectId": "proj_ejemplo123",
          "formName": "Formulario de Testimonios",
          "description": "Descripción del formulario",
          "isActive": true,
          "createdAt": "2024-01-15T10:30:00Z",
          "updatedAt": "2024-01-15T10:30:00Z"
        }
      ]
    }
    ```
- 🔴 `DELETE /projects/{projectId}/capture-forms/{formId}` - Eliminar formulario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/capture-forms/{formId}`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/capture-forms/form_ejemplo123`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:** Ninguno (DELETE request)
  - **Response (200):**
    ```json
    {
      "success": true,
      "message": "Formulario eliminado exitosamente"
    }
    ```
- 🟢 `GET /projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - **Implementación:** Llamada a Edge Function desde `useProject.loadProject()`
  - **Supabase:** La Edge Function consulta la base de datos usando `supabase.from('projects').select()` y verifica permisos del usuario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/projects/proj_ejemplo123`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:** Ninguno (GET request)
  - **Response (200):**
    ```json
    {
      "project": {
        "id": "proj_ejemplo123",
        "name": "Mi Proyecto",
        "type": "testimonial",
        "testimonialsCount": 5,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "ownerId": "uuid-del-propietario"
      }
    }
    ```

---

### `/dashboard/projects/:projectId/capture-forms/new`

**Página:** `src/app/(dashboard)/dashboard/projects/:projectId/capture-forms/new/page.tsx`  
**Componente:** `CaptureFormNewPage`

**Endpoints:**

- 🔵 `POST /projects/{projectId}/capture-forms` - Crear nuevo formulario de captura
  - **Implementación:** Llamada a Edge Function desde `CaptureFormNewPage.handleSubmit()`
  - **Supabase:** La Edge Function crea el formulario usando `supabase.from('capture_forms').insert()` con el `projectId` y verificando permisos del usuario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/capture-forms`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/projects/proj_ejemplo123/capture-forms`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:**
    ```json
    {
      "formName": "Nuevo Formulario",
      "description": "Descripción del formulario",
      "formConfig": {
        "welcomeTitle": "Por favor, escribe un testimonio",
        "welcomeText": "Tu opinión es muy valiosa",
        "promptText": "¿Qué te gustó más?",
        "thanksTitle": "¡Gracias!",
        "thanksText": "Apreciamos tu feedback",
        "allowText": true,
        "allowVideo": true,
        "allowImage": true,
        "fieldSettings": {
          "name": "required",
          "email": "optional",
          "avatar": "optional",
          "jobTitle": "optional",
          "company": "optional"
        }
      },
      "isActive": true
    }
    ```
  - **Response (201):**
    ```json
    {
      "form": {
        "id": "form_ejemplo123",
        "projectId": "proj_ejemplo123",
        "formName": "Nuevo Formulario",
        "isActive": true,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    }
    ```
- 🟢 `GET /projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - **Implementación:** Llamada a Edge Function desde `useProject.loadProject()`
  - **Supabase:** La Edge Function consulta la base de datos usando `supabase.from('projects').select()` y verifica permisos del usuario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/projects/proj_ejemplo123`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:** Ninguno (GET request)
  - **Response (200):**
    ```json
    {
      "project": {
        "id": "proj_ejemplo123",
        "name": "Mi Proyecto",
        "type": "testimonial",
        "testimonialsCount": 5,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "ownerId": "uuid-del-propietario"
      }
    }
    ```

---

### `/dashboard/projects/:projectId/capture-forms/:formId/edit`

**Página:** `src/app/(dashboard)/dashboard/projects/:projectId/capture-forms/:formId/edit/page.tsx`  
**Componente:** `ProjectCaptureFormEditPage`

**Endpoints:**

- 🟢 `GET /projects/{projectId}/capture-forms/{formId}` - Obtener formulario específico (no implementado en el código actual, usa valores por defecto)
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/capture-forms/{formId}`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/capture-forms/form_ejemplo123`
- 🔵 `POST /projects/{projectId}/capture-forms` - Crear formulario (si es nuevo)
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/capture-forms`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123/capture-forms`
- 🟠 `PUT /projects/{projectId}/capture-forms/{formId}` - Actualizar formulario existente
  - **Implementación:** Llamada a Edge Function desde `ProjectCaptureFormEditPage.handleSubmit()`
  - **Supabase:** La Edge Function actualiza el formulario usando `supabase.from('capture_forms').update()` verificando permisos del usuario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/capture-forms/{formId}`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/projects/proj_ejemplo123/capture-forms/form_ejemplo123`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:**
    ```json
    {
      "formName": "Formulario Actualizado",
      "description": "Nueva descripción",
      "formConfig": {
        "welcomeTitle": "Título actualizado",
        "welcomeText": "Texto actualizado",
        "promptText": "Prompt actualizado",
        "thanksTitle": "Título de agradecimiento",
        "thanksText": "Texto de agradecimiento",
        "allowText": true,
        "allowVideo": false,
        "allowImage": true,
        "fieldSettings": {
          "name": "required",
          "email": "required",
          "avatar": "optional",
          "jobTitle": "optional",
          "company": "optional"
        }
      },
      "isActive": false
    }
    ```
  - **Response (200):**
    ```json
    {
      "form": {
        "id": "form_ejemplo123",
        "formName": "Formulario Actualizado",
        "updatedAt": "2024-01-15T11:00:00Z"
      }
    }
    ```
- 🟢 `GET /projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - **Implementación:** Llamada a Edge Function desde `useProject.loadProject()`
  - **Supabase:** La Edge Function consulta la base de datos usando `supabase.from('projects').select()` y verifica permisos del usuario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/projects/proj_ejemplo123`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:** Ninguno (GET request)
  - **Response (200):**
    ```json
    {
      "project": {
        "id": "proj_ejemplo123",
        "name": "Mi Proyecto",
        "type": "testimonial",
        "testimonialsCount": 5,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "ownerId": "uuid-del-propietario"
      }
    }
    ```

---

### `/dashboard/projects/:projectId/embeds`

**Página:** `src/app/(dashboard)/dashboard/projects/:projectId/embeds/page.tsx`  
**Componente:** `ProjectEmbedsListPage`

**Endpoints:**

- 🟢 `GET /projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - **Implementación:** Llamada a Edge Function desde `useProject.loadProject()`
  - **Supabase:** La Edge Function consulta la base de datos usando `supabase.from('projects').select()` y verifica permisos del usuario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/projects/proj_ejemplo123`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:** Ninguno (GET request)
  - **Response (200):**
    ```json
    {
      "project": {
        "id": "proj_ejemplo123",
        "name": "Mi Proyecto",
        "type": "testimonial",
        "testimonialsCount": 5,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "ownerId": "uuid-del-propietario"
      }
    }
    ```
- ⚪ Ningún otro endpoint (página informativa que genera código de embed)

---

### `/dashboard/projects/:projectId/api`

**Página:** `src/app/(dashboard)/dashboard/projects/:projectId/api/page.tsx`  
**Componente:** `ProjectAPIPage`

**Endpoints:**

- 🟢 `GET /projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - **Implementación:** Llamada a Edge Function desde `useProject.loadProject()`
  - **Supabase:** La Edge Function consulta la base de datos usando `supabase.from('projects').select()` y verifica permisos del usuario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/projects/proj_ejemplo123`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:** Ninguno (GET request)
  - **Response (200):**
    ```json
    {
      "project": {
        "id": "proj_ejemplo123",
        "name": "Mi Proyecto",
        "type": "testimonial",
        "testimonialsCount": 5,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "ownerId": "uuid-del-propietario"
      }
    }
    ```
- ⚪ Ningún otro endpoint (página informativa que muestra ejemplos de código)

---

### `/dashboard/projects/:projectId/editors`

**Página:** `src/app/(dashboard)/dashboard/projects/:projectId/editors/page.tsx`  
**Componente:** `ProjectEditorsManagementPage`

**Endpoints:**

- 🟢 `GET /projects/{projectId}/editors` - Listar editores del proyecto
  - **Implementación:** Llamada a Edge Function desde `ProjectEditorsManagementPage`
  - **Supabase:** La Edge Function consulta la base de datos usando `supabase.from('project_editors').select()` y `supabase.from('users').select()` para obtener información de editores y verificar permisos del usuario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/editors`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/projects/proj_ejemplo123/editors`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:** Ninguno (GET request)
  - **Response (200):**
    ```json
    {
      "editors": [
        {
          "id": "editor_ejemplo123",
          "name": "Juan Pérez",
          "email": "juan@ejemplo.com",
          "role": "editor",
          "status": "active",
          "createdAt": "2024-01-15T10:30:00Z"
        }
      ]
    }
    ```
- 🔵 `POST /projects/{projectId}/editors` - Agregar editor al proyecto
  - **Implementación:** Llamada a Edge Function desde `ProjectEditorsManagementPage`
  - **Supabase:** La Edge Function crea la relación usando `supabase.from('project_editors').insert()` verificando que el usuario sea owner del proyecto
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/editors`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/projects/proj_ejemplo123/editors`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:**
    ```json
    {
      "email": "editor@ejemplo.com"
    }
    ```
  - **Response (201):**
    ```json
    {
      "editor": {
        "id": "editor_ejemplo123",
        "email": "editor@ejemplo.com",
        "role": "editor",
        "status": "active",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    }
    ```
- 🔴 `DELETE /projects/{projectId}/editors/{editorId}` - Eliminar editor del proyecto
  - **Implementación:** Llamada a Edge Function desde `ProjectEditorsManagementPage`
  - **Supabase:** La Edge Function elimina la relación usando `supabase.from('project_editors').delete()` verificando permisos del usuario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}/editors/{editorId}`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/projects/proj_ejemplo123/editors/editor_ejemplo123`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:** Ninguno (DELETE request)
  - **Response (200):**
    ```json
    {
      "success": true,
      "message": "Editor eliminado exitosamente"
    }
    ```
- 🟢 `GET /projects/{projectId}` - Obtener datos del proyecto (desde useProject hook)
  - **Implementación:** Llamada a Edge Function desde `useProject.loadProject()`
  - **Supabase:** La Edge Function consulta la base de datos usando `supabase.from('projects').select()` y verifica permisos del usuario
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/projects/proj_ejemplo123`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:** Ninguno (GET request)
  - **Response (200):**
    ```json
    {
      "project": {
        "id": "proj_ejemplo123",
        "name": "Mi Proyecto",
        "type": "testimonial",
        "testimonialsCount": 5,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "ownerId": "uuid-del-propietario"
      }
    }
    ```

---

## 📝 Formularios & Embeds Públicos

### `/cf/:formId`

**Página:** `src/app/(public-forms)/cf/:formId/page.tsx`  
**Componente:** `PublicCaptureFormPage`

**Endpoints:**

- 🟢 `GET /public/capture-forms/{formId}` - Obtener formulario público (no implementado, usa configuración mock)
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/public/capture-forms/{formId}`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/public/capture-forms/form_ejemplo123`
  - **Headers:**
    ```
    Content-Type: application/json
    ```
  - **Body:** Ninguno (GET request)
  - **Response (200):**
    ```json
    {
      "form": {
        "id": "form_ejemplo123",
        "formName": "Formulario de Testimonios",
        "description": "Descripción del formulario",
        "formConfig": {
          "welcomeTitle": "Por favor, escribe un testimonio",
          "welcomeText": "Tu opinión es muy valiosa",
          "promptText": "¿Qué te gustó más?",
          "thanksTitle": "¡Gracias!",
          "thanksText": "Apreciamos tu feedback",
          "allowText": true,
          "allowVideo": true,
          "allowImage": true,
          "fieldSettings": {
            "name": "required",
            "email": "optional",
            "avatar": "optional",
            "jobTitle": "optional",
            "company": "optional"
          }
        },
        "isActive": true
      }
    }
    ```
- 🔵 `POST /public/capture-forms/{formId}/responses` - Enviar respuesta del formulario (no implementado completamente)
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/public/capture-forms/{formId}/responses`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/public/capture-forms/form_ejemplo123/responses`
  - **Headers:**
    ```
    Content-Type: application/json
    ```
  - **Body:**
    ```json
    {
      "type": "text" | "video" | "image",
      "content": "Contenido del testimonio",
      "customerName": "Juan Pérez",
      "customerEmail": "juan@ejemplo.com",
      "customerCompany": "Acme Corp",
      "customerJobTitle": "CEO",
      "customerAvatar": "https://...",
      "videoUrl": "https://...",
      "imageUrl": "https://..."
    }
    ```
  - **Response (201):**
    ```json
    {
      "success": true,
      "testimonial": {
        "id": "test_ejemplo123",
        "status": "pending",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    }
    ```
- 🔵 `POST /api/cloudinary/upload` - Subir foto de avatar (si se sube imagen)
  - **URL Completa:** `/api/cloudinary/upload` (relativa) o `https://tu-dominio.com/api/cloudinary/upload` (absoluta)
  - **Ejemplo:** `https://tu-dominio.com/api/cloudinary/upload`
  - **Headers:**
    ```
    Content-Type: application/json
    ```
  - **Body:**
    ```json
    {
      "file": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      "folder": "avatars",
      "resourceType": "image"
    }
    ```
  - **Response (200):**
    ```json
    {
      "url": "http://res.cloudinary.com/...",
      "secureUrl": "https://res.cloudinary.com/...",
      "publicId": "avatars/abc123",
      "width": 800,
      "height": 600,
      "format": "jpg"
    }
    ```

---

### `/embed`

**Página:** `src/app/(marketing)/embed/page.tsx`  
**Componente:** `EmbedPage`

**Endpoints:**

- 🟢 `GET /public/projects/{projectId}/testimonials` - Obtener testimonios aprobados para mostrar en el embed
  - **Implementación:** Llamada a Edge Function desde `EmbedPage.fetchTestimonials()`
  - **Supabase:** La Edge Function consulta la base de datos usando `supabase.from('testimonials').select()` filtrando por `projectId` y `status='approved'`. Este endpoint es público y no requiere autenticación de usuario, pero usa la `PUBLIC_ANON_KEY` para acceso
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/public/projects/{projectId_path}/testimonials`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/public/projects/proj_ejemplo123/testimonials?status=approved&limit=20`
  - **Headers:**
    ```
    Authorization: Bearer {PUBLIC_ANON_KEY}
    Content-Type: application/json
    ```
  - **Body:** Ninguno (GET request)
  - **Query Parameters:**
    - `status` (opcional): `approved` | `pending` - Filtra testimonios por estado
    - `limit` (opcional): número máximo de testimonios a retornar
  - **Response (200):**
    ```json
    {
      "testimonials": [
        {
          "id": "test_ejemplo123",
          "type": "text" | "video" | "image",
          "content": "Contenido del testimonio",
          "customerName": "Juan Pérez",
          "customerJobTitle": "CEO",
          "customerCompany": "Acme Corp",
          "customerAvatar": "https://...",
          "status": "approved",
          "videoUrl": "https://...",
          "imageUrl": "https://...",
          "createdAt": "2024-01-15T10:30:00Z"
        }
      ]
    }
    ```

---

## 🧩 Hooks y Contextos

### `useProject` Hook

**Archivo:** `src/hooks/useProject.ts`

**Endpoints:**

- 🟢 `GET /projects/{projectId}` - Obtener datos del proyecto
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/projects/{projectId_path}`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/projects/proj_ejemplo123`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:** Ninguno (GET request)
  - **Response (200):**
    ```json
    {
      "project": {
        "id": "proj_ejemplo123",
        "name": "Mi Proyecto",
        "type": "testimonial",
        "testimonialsCount": 5,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "ownerId": "uuid-del-propietario"
      }
    }
    ```

---

### `AuthContext`

**Archivo:** `src/features/auth/context/AuthContext.tsx`

**Endpoints:**

- 🟢 `GET /auth/user` - Obtener datos del usuario autenticado
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/auth/user`
  - **Ejemplo:** `https://ejemplo-proyecto-id.supabase.co/functions/v1/ejemplo-edge-function/auth/user`
  - **Headers:**
    ```
    Authorization: Bearer {ACCESS_TOKEN}
    Content-Type: application/json
    ```
  - **Body:** Ninguno (GET request)
  - **Response (200):**
    ```json
    {
      "user": {
        "id": "uuid-del-usuario",
        "email": "usuario@ejemplo.com",
        "name": "Nombre del Usuario",
        "role": "admin" | "editor"
      }
    }
    ```
- 🔵 `POST /auth/signup` - Registrar nuevo usuario
  - **Implementación:** Llamada a Edge Function desde `AuthContext.signup()`
  - **URL Completa:** `{SUPABASE_EDGE_FUNCTION_URL}/auth/signup`
  - **Ejemplo:** `https://rjeslutegnjaplspygwx.supabase.co/functions/v1/make-server-68ddca03/auth/signup`
  - **Headers:**
    ```
    Authorization: Bearer {PUBLIC_ANON_KEY}
    Content-Type: application/json
    ```
  - **Body:**
    ```json
    {
      "email": "usuario@ejemplo.com",
      "password": "contraseñaSegura123",
      "name": "Nombre del Usuario"
    }
    ```
  - **Response (200):**
    ```json
    {
      "success": true,
      "user": {
        "id": "uuid-del-usuario",
        "email": "usuario@ejemplo.com",
        "name": "Nombre del Usuario",
        "role": "editor"
      }
    }
    ```
  - **Nota:** Después del registro exitoso, se realiza auto-login usando `supabase.auth.signInWithPassword()`
- 🔵 `supabase.auth.signInWithPassword()` - Iniciar sesión
  - **Implementación:** Usa el cliente de Supabase JS (`@supabase/supabase-js`) desde `AuthContext.login()`
  - **Código:** `const { data, error } = await supabase.auth.signInWithPassword({ email, password })`
  - **Descripción:** Autentica al usuario usando Supabase Auth. No es una llamada HTTP directa, sino que usa el cliente de Supabase que internamente hace la llamada a `https://{projectId}.supabase.co/auth/v1/token?grant_type=password`
  - **Parámetros:**
    ```typescript
    {
      email: string,
      password: string
    }
    ```
  - **Response:** Retorna un objeto con:
    ```typescript
    {
      data: {
        session: {
          access_token: string,
          refresh_token: string,
          expires_in: number,
          token_type: "bearer",
          user: {
            id: string,
            email: string
          }
        }
      },
      error: Error | null
    }
    ```
  - **Almacenamiento:** Los tokens se guardan automáticamente en `localStorage` como `access_token` y `refresh_token`
  - **Nota:** Después del login exitoso, se llama a `fetchUser()` para obtener los datos completos del usuario desde la Edge Function
- 🔵 `supabase.auth.signOut()` - Cerrar sesión
  - **Implementación:** Usa el cliente de Supabase JS (`@supabase/supabase-js`) desde `AuthContext.logout()`
  - **Código:** `await supabase.auth.signOut()`
  - **Descripción:** Cierra la sesión del usuario usando Supabase Auth. No es una llamada HTTP directa, sino que usa el cliente de Supabase que internamente hace la llamada a `https://{projectId}.supabase.co/auth/v1/logout`
  - **Limpieza:** Después de cerrar sesión, se eliminan los tokens de `localStorage` (`access_token` y `refresh_token`) y se limpia el estado del usuario
  - **Response:** No retorna contenido específico, solo indica éxito o error

---

## ⚙️ API Routes (Next.js)

### `/api/cloudinary/upload`

**Archivo:** `src/app/api/cloudinary/upload/route.ts`

**Endpoints:**

- 🔵 `POST /api/cloudinary/upload` - Endpoint interno de Next.js para subir archivos a Cloudinary
  - **URL Completa:** `/api/cloudinary/upload` (relativa) o `https://tu-dominio.com/api/cloudinary/upload` (absoluta)
  - **Ejemplo:** `https://tu-dominio.com/api/cloudinary/upload`
  - **Headers:**
    ```
    Content-Type: application/json
    ```
  - **Body:**
    ```json
    {
      "file": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      "folder": "testimonials" | "avatars",
      "resourceType": "image" | "video" | "raw" | "auto"
    }
    ```
  - **Response (200):**
    ```json
    {
      "url": "http://res.cloudinary.com/...",
      "secureUrl": "https://res.cloudinary.com/...",
      "publicId": "testimonials/abc123",
      "width": 800,
      "height": 600,
      "format": "jpg"
    }
    ```
  - **Response Error (400):**
    ```json
    {
      "error": "File is required"
    }
    ```
  - **Response Error (500):**
    ```json
    {
      "error": "Failed to upload image"
    }
    ```

---

### `/api/cloudinary/delete`

**Archivo:** `src/app/api/cloudinary/delete/route.ts`

**Endpoints:**

- 🔵 `POST /api/cloudinary/delete` - Endpoint interno de Next.js para eliminar archivos de Cloudinary
  - **URL Completa:** `/api/cloudinary/delete` (relativa) o `https://tu-dominio.com/api/cloudinary/delete` (absoluta)
  - **Ejemplo:** `https://tu-dominio.com/api/cloudinary/delete`
  - **Headers:**
    ```
    Content-Type: application/json
    ```
  - **Body:**
    ```json
    {
      "publicId": "testimonials/abc123"
    }
    ```
  - **Response (200):**
    ```json
    {
      "success": true,
      "result": "ok"
    }
    ```
  - **Response Error (400):**
    ```json
    {
      "error": "Public ID is required"
    }
    ```
  - **Response Error (500):**
    ```json
    {
      "error": "Failed to delete image"
    }
    ```

---

## 🗒️ Notas

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
