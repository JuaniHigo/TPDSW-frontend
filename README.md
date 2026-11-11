# Kicket · Frontend

React 19 + TypeScript + Vite. Catálogo de partidos, selección de sectores, Checkout de Mercado Pago, entradas, cuenta personal y administración.

## Modo demo

El backend admite PAYMENT_MODE=demo sin credenciales de Mercado Pago. El frontend consulta /pagos/configuracion y muestra un simulador con resultados aprobado, rechazado y pendiente. Tanto la confirmación como los tickets indican que no hay cobros reales y que las entradas demo no tienen validez de ingreso. No se agrega una variable VITE para elegir proveedor.

Ver la guía docs/DEMO.md del backend. Usar una base dedicada para las presentaciones: los cupos y datos de compra se persisten.

## Desarrollo

Requiere Node 22 y pnpm 10.11.0.

1. `pnpm install --frozen-lockfile`.
2. Copiar `.env.example` a `.env` y configurar `VITE_API_URL`.
3. Iniciar el backend y su worker.
4. `pnpm dev`.

El origen del frontend debe coincidir con `FRONTEND_URL` del backend. La API por defecto es http://localhost:3000/api. El frontend no requiere claves de Mercado Pago: redirige al checkout creado por el servidor.

## Comandos

| Comando               | Resultado                                                                 |
| --------------------- | ------------------------------------------------------------------------- |
| `pnpm build`          | Verifica TypeScript y genera dist                                         |
| `pnpm lint`           | ESLint                                                                    |
| `pnpm test`           | Componentes y restauración de sesión                                      |
| `pnpm test:e2e`       | Navegador con API controlada: selección, login, confirmación y permisos   |
| `pnpm test:fullstack` | Navegador contra backend y MySQL reales, con el proveedor demo definitivo |

Playwright utiliza Edge en Windows y Chromium en otros sistemas. En Linux instalarlo con `pnpm exec playwright install --with-deps chromium`. Para otro ejecutable, definir `PLAYWRIGHT_CHROMIUM_EXECUTABLE`.

## Prueba completa local

Colocar este repositorio junto a `TPDSW-backend`. En el backend:

1. `pnpm install --frozen-lockfile` y `pnpm build`.
2. `docker compose up -d mysql-test`, o usar una instancia MySQL **aislada** y definir `MYSQL_TEST_URL`.
3. Ejecutar `pnpm test:fullstack` desde este frontend.

La prueba levanta un backend exclusivo en 127.0.0.1:5180, Vite en 127.0.0.1:5174 y una base temporal kicket*test_e2e*\*. Usa JWT, HTTP, MySQL, migraciones y emisión reales; se usa el modo demo persistente de la aplicación. No usa ni modifica la base compartida. Ambos puertos deben estar disponibles.

El recorrido comprobado incluye crear clubes, estadio, sector, evento y precio; habilitar venta; registrar comprador; conservar selección al iniciar sesión; simular pendiente, rechazo y aprobación, confirmar dos entradas demo y verificar cupo agotado.

## Contrato y comportamiento

- Todos los servicios usan el cliente Axios compartido, IDs numéricos, camelCase y fechas UTC.
- La sesión se restaura consultando /users/me; una respuesta 401 autenticada limpia sesión y selección.
- Perfil y configuración usan datos reales y permiten editar nombre, apellido, nacimiento y cambiar contraseña.
- La selección se conserva en sessionStorage antes del login y tras recargar.
- El backend calcula el precio y reserva por 15 minutos. El retorno de Mercado Pago consulta el estado real; no supone aprobación por la URL.
- Los tickets nuevos se representan con un QR del token. Los históricos PNG se muestran como imagen.
- Administración requiere rol admin tanto en navegación como en API.

El despliegue debe servir index.html para rutas SPA y configurar VITE_API_URL al compilar. Publicar de forma coordinada con el backend; ver su documentación de migraciones y operación.

La prueba sandbox con credenciales de Mercado Pago y SMTP externo queda separada de las pruebas automatizadas.
