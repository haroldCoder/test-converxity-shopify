# Documentación del Proyecto: Shopify Affiliate Billing

Este documento detalla la instalación, arquitectura, estrategias de despliegue y decisiones técnicas tomadas para el sistema de seguimiento de afiliados y facturación de Shopify.

---

## 1. Instalación y Ejecución Local

### Prerrequisitos
*   Node.js (v18+)
*   Docker y Docker Compose
*   Shopify CLI (para desarrollo de extensiones)
*   ngrok o Cloudflare Tunnel (para webhooks locales)

### Pasos Rápidos
1.  **Clonar el repositorio:**
    ```bash
    git clone <repository-url>
    cd test-converxity-shopify
    ```

2.  **Levantar la Base de Datos (PostgreSQL):**
    ```bash
    docker-compose up -d
    ```
    *Esto iniciará una instancia de PostgreSQL en el puerto 5432.*

3.  **Configurar y Levantar el Servidor (NestJS):**
    ```bash
    cd server
    cp .env.example .env # Configura tus credenciales de Shopify
    npm install
    npx prisma migrate dev
    npx prisma generate
    npm run start:dev
    ```

4.  **Configurar y Levantar el Frontend (React + Vite):**
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```

5.  **Desplegar Extensión (Web Pixel):**
    ```bash
    cd ..
    shopify app dev
    ```

---

## 2. Gestión de Entornos

### Ciclo de Vida (SDLC)
*   **Desarrollo (Local):** Uso de `docker-compose` para DB, `ngrok` para túneles y `shopify app dev` para vincular con una tienda de desarrollo.
*   **Staging:** Entorno idéntico a producción (ej. Render o AWS) vinculado a una tienda de pruebas de Shopify para control de calidad.
*   **Producción:** Entorno de alta disponibilidad con monitoreo activo.

### Partner Dashboard
*   Se deben crear Apps separadas en el Partner Dashboard para Dev/Staging y Producción (o usar configuraciones de `shopify.app.toml` diferenciadas).
*   **Client ID/Secret** y **App URL** deben actualizarse por entorno para asegurar que los redireccionamientos de OAuth y los Webhooks lleguen al servidor correcto.

---

## 3. Pipelines de CI/CD (GitHub Actions)

Un flujo seguro incluiría:
1.  **Lint & Test:** Ejecución de ESLint y Jest/Vitest en cada PR.
2.  **Security Audit:** `npm audit` y escaneo de secretos (ej. TruffleHog).
3.  **Build Validation:** Verificación de que el servidor y frontend compilan correctamente.
4.  **Database Migration (Dry Run):** Verificar que las migraciones de Prisma son compatibles.
5.  **Deployment:** Despliegue automático a Staging tras merge a `develop`, y a Producción tras tag de release a `main`.

---

## 4. Estrategia de Despliegue

### Opciones de Infraestructura
*   **VPS (ej. DigitalOcean Droplet):** Despliegue con Docker Compose + Caddy/Nginx como Reverse Proxy para SSL automático.
*   **Cloud (ej. AWS/GCP):** Uso de ECS/Fargate para contenedores, RDS para PostgreSQL administrado y Secret Manager para credenciales.
*   **Serverless (ej. Vercel/Render):** Frontend en Vercel, Backend en Render (Node.js service). *Nota: Para Web Pixels, el backend debe ser altamente responsivo.*

### Gestión de Secretos
*   Uso de variables de entorno (`.env`) nunca subidas al repo.
*   En producción, usar servicios como **AWS Secrets Manager** o **Doppler** para la rotación de claves de API y secretos de Shopify.

---

## 5. Arquitectura de Base de Datos

### Justificación del Esquema Actual
*   **PostgreSQL:** Elegido por su robustez, soporte de tipos JSONB para payloads de eventos y capacidades de indexación avanzada.
*   **Estructura Relacional:** Asegura integridad entre `Shop` -> `Affiliate` -> `Conversion`. Las claves foráneas y restricciones garantizan que no existan cobros huérfanos.

### Escalabilidad para Millones de Eventos
1.  **Particionamiento de Tablas:** Particionar la tabla `PixelEvent` y `Conversion` por `createdAt` (mensual o semanal).
2.  **Índices Especializados:** Índices B-Tree en `shopDomain` y GIN en campos JSON si es necesario consultar dentro de los payloads.
3.  **Migración a Producción:** Al pasar de un volumen bajo a millones de eventos, se debe considerar **TimescaleDB** (extensión de Postgres para series temporales) para el almacenamiento de eventos de tracking crudos.

---

## 6. Decisiones de Arquitectura

### Estructura Hexagonal
*   Elegida para desacoplar la lógica de negocio (casos de uso) de los detalles de implementación (Shopify API, Prisma, NestJS). Esto facilita el testing y el cambio de proveedores de infraestructura.

### Asincronía e Idempotencia
*   **Procesamiento de Eventos:** Uso de colas (ej. BullMQ con Redis) para procesar webhooks y eventos del Pixel sin bloquear la respuesta HTTP.
*   **Idempotencia:** Cada evento tiene un `externalEventId` único. Antes de procesar una factura, se verifica si ya existe un `BillingRecord` asociado para evitar cobros duplicados en caso de reintentos de red.

### Alta Concurrencia
*   **Caché:** Uso de Redis para almacenar tokens de acceso de tiendas y configuraciones de afiliados frecuentes.
*   **Escalado Horizontal:** El servidor NestJS es stateless, permitiendo múltiples réplicas detrás de un Load Balancer.

---

## 7. DevOps y Monitoreo

*   **Health Checks:** Endpoint `/health` implementado en NestJS para que el orquestador (Docker/AWS) sepa cuándo reiniciar un contenedor.
*   **Monitoreo:** Integración con **Sentry** para errores y **Datadog/NewRelic** para métricas de rendimiento (Latencia de respuesta a Web Pixels es crítica).
*   **Rotación de Secretos:** Implementación de un script o pipeline que actualice periódicamente las claves de API sin tiempo de inactividad, aprovechando el soporte de múltiples claves de Shopify si es posible.
