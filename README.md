# stockfy-frontend

Tienda online de Stockfy. Consume la API de Django del repositorio `stockfy`.

Next.js 16 (App Router, Cache Components) + React 19 + Tailwind CSS 4, gestionado con pnpm.

## Puesta en marcha

```bash
pnpm install
cp .env.example .env.local      # API_URL apunta al backend
pnpm dev                        # http://localhost:3000
```

El backend tiene que estar arrancado (`python manage.py runserver` en `stockfy`).

## Docker

El `Dockerfile` genera una imagen con el servidor `standalone` de Next (Node 24, sin `node_modules` completos). La variable `API_URL` se lee al arrancar el contenedor, no al construir la imagen, así que la misma imagen vale para cualquier entorno.

El despliegue completo (PostgreSQL, backend, esta tienda y Caddy con HTTPS) está en el `docker-compose.yml` del repositorio `stockfy`. Allí se explica cómo arrancarlo.

## Cómo habla con el backend

- El navegador **nunca** llama a la API directamente: lo hace el servidor de Next (`src/lib/api.ts`), así que no hace falta CORS.
- El login guarda el JWT (`access` + `refresh`) en cookies `httpOnly`. `src/proxy.ts` renueva el token de acceso antes de que caduque y redirige a `/login` en las rutas privadas (`/cuenta`, `/checkout`).
- Las mutaciones (login, registro, pedidos, pago, favoritos) son Server Actions en `src/app/actions/`.
- El carrito vive en el navegador (`localStorage`). Al confirmar se crea el pedido con `POST /api/orders/` y después se inicia el pago con `POST /api/payments/checkout/`.

## Pagos

`/cuenta/pedidos/[number]` inicia el pago según lo que devuelva la pasarela activa del backend:

- **Stripe**: `client_secret` + `public_key` → formulario de Stripe Elements.
- **Redirección** (Redsys): `redirect_url` + `form_fields` → se envía el formulario a la pasarela.
- **dummy**: solo muestra la referencia; el pedido se marca como pagado al recibir el webhook.

## Paleta

Los colores se definen como tokens en `src/app/globals.css` (verde `brand`, naranja `accent`, azul `info`), con variante para modo oscuro.
