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

## Panel de gestión (`/panel`)

Solo para los perfiles **ADMIN** y **EMPLEADO** del backend. Al entrar con uno de esos perfiles, el login lleva directamente al panel, y la cabecera de la tienda muestra un enlace «Panel».

- **Resumen**: número de productos, variantes sin stock, productos con poco stock y últimos movimientos.
- **Productos** (ADMIN y EMPLEADO): crear, editar y archivar productos; añadir y editar variantes con los atributos de su categoría; ajustar el stock (entradas, ventas en tienda, devoluciones, daños y correcciones; todo queda registrado como movimiento); subir imágenes (van al bucket R2 a través del backend) y elegir la principal.
- **Usuarios** (solo ADMIN): alta de empleados y administradores, cambio de perfil, cambio de contraseña y desactivar/reactivar cuentas. Un administrador no puede quitarse su propio perfil ni desactivarse.

Cómo se protege:

1. `src/proxy.ts` manda a `/login` a quien entra en `/panel` sin sesión.
2. `src/app/panel/layout.tsx` comprueba el rol: un cliente ve «Acceso restringido». `src/app/panel/usuarios/layout.tsx` hace lo mismo con los empleados.
3. Cada Server Action del panel (`src/app/panel/actions/`) vuelve a comprobar el rol.
4. La protección real está en el backend: `/api/admin/...` responde 403 si el rol no tiene permiso.

La tienda vive en el grupo de rutas `src/app/(tienda)/`, con su cabecera y su pie. El panel tiene su propio layout. Las URLs no cambian.

## Pagos

`/cuenta/pedidos/[number]` inicia el pago según lo que devuelva la pasarela activa del backend:

- **Stripe**: `client_secret` + `public_key` → formulario de Stripe Elements.
- **Redirección** (Redsys): `redirect_url` + `form_fields` → se envía el formulario a la pasarela.
- **dummy**: solo muestra la referencia; el pedido se marca como pagado al recibir el webhook.

## Paleta

Los colores se definen como tokens en `src/app/globals.css` (verde `brand`, naranja `accent`, azul `info`), con variante para modo oscuro.
