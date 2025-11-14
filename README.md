# TPDSW-frontend-Proyecto Kicket

Este repositorio contiene el código fuente del frontend para **Kicket**,
una plataforma de venta de entradas para eventos deportivos.\
Está construido con **React**, **Vite** y **TypeScript**, y consume la
API del backend **TPDSW-backend**.

La aplicación permite a los usuarios registrarse, iniciar sesión,
explorar eventos, seleccionar entradas, realizar pagos (simulados o con
Mercado Pago) y ver entradas compradas con códigos QR.

## 📋 Tabla de Contenidos

-   ✨ Características Principales
-   🛠️ Tecnologías Utilizadas
-   🚀 Instalación y Ejecución
    -   Pre-requisitos
    -   Variables de Entorno
    -   Pasos de Instalación
-   📂 Estructura del Proyecto
-   🧠 Arquitectura y Conceptos Clave
    -   Gestión de Estado (Context)
    -   Servicio de API (Axios)
    -   Formularios y Validación
-   📜 Scripts Disponibles

## ✨ Características Principales

-   **Autenticación de Usuarios:**\
    Flujo completo de registro e inicio de sesión.

-   **Gestión de Sesión:**\
    Manejo global de estado de autenticación mediante React Context +
    localStorage.

-   **Exploración de Eventos:**\
    Vista principal con lista de eventos y página de detalle.

-   **Flujo de Compra:**

    -   Carrito persistente en sessionStorage (PurchaseContext).\
    -   Página de pago con elección de método.

-   **Integración de Pagos:**

    -   **Mercado Pago:** Botón Wallet con @mercadopago/sdk-react.\
    -   **Tarjeta (Simulado):** Formulario validado con Zod y enviado al
        backend.

-   **Visualización de Entradas:**

    -   Página de Compra Exitosa.\
    -   Página "Mis Entradas".\
    -   Componente EntradaCard con código QR (react-qr-code).

-   **Dashboard de Usuario** (dashboardH.tsx).

-   **Routing:**\
    Navegación con react-router-dom y rutas protegidas.

## 🛠️ Tecnologías Utilizadas

-   **Framework/Librería:** React 19\
-   **Bundler:** Vite\
-   **Lenguaje:** TypeScript\
-   **Routing:** React Router DOM\
-   **HTTP:** Axios\
-   **Gestión de Estado:** React Context\
-   **Formularios:** React Hook Form\
-   **Validación:** Zod\
-   **Pagos:** @mercadopago/sdk-react\
-   **QR:** react-qr-code\
-   **Estilos:** CSS modular\
-   **Paquetes:** pnpm

## 🚀 Instalación y Ejecución

### Pre-requisitos

-   Node.js v18+\
-   pnpm instalado globalmente\
-   Backend TPDSW-backend corriendo en http://localhost:3000

### Variables de Entorno

Crear un archivo `.env` en la raíz:

    # Clave pública de Mercado Pago
    VITE_MP_PUBLIC_KEY=TU_PUBLIC_KEY_DE_MERCADOPAGO

> Nota: La URL de la API está fija en `src/services/api.ts`.\
> Se recomienda moverla a una variable `VITE_API_URL`.

### Pasos de Instalación

``` bash
git clone https://github.com/juanihigo/tpdsw-frontend.git
cd tpdsw-frontend
pnpm install
```

Crear `.env` y agregar la clave pública de Mercado Pago.

Iniciar el servidor:

``` bash
pnpm dev
```

La app estará disponible en `http://localhost:5173`.

## 📂 Estructura del Proyecto

    TPDSW-frontend/
    ├── public/               
    ├── src/
    │   ├── assets/           
    │   ├── components/       
    │   ├── context/          
    │   ├── hooks/            
    │   ├── pages/            
    │   ├── services/         
    │   ├── types/            
    │   ├── App.tsx           
    │   ├── main.tsx          
    │   └── index.css         
    ├── .env                  
    ├── index.html            
    ├── package.json          
    ├── pnpm-lock.yaml        
    └── vite.config.ts        

## 🧠 Arquitectura y Conceptos Clave

### Gestión de Estado (Context)

**AuthProvider** - Maneja el token del usuario. - Persistencia en
localStorage. - Funciones: `login()`, `logout()`. - Accesible vía
`useAuth()`.

**PurchaseProvider** - Maneja estado del flujo de compra. - Persistencia
en sessionStorage. - Accesible vía `usePurchase()`.

### Servicio de API (Axios)

Configurado en `src/services/api.ts`\
- URL base: `http://localhost:3000/api`\
- Interceptor añade `Authorization: Bearer <token>` si existe en
localStorage.

### Formularios y Validación

-   Formularios con **React Hook Form**.
-   Validación con **Zod**.
-   Usado en Registro y Pago con Tarjeta.

## 📜 Scripts Disponibles

-   `pnpm dev` --- Dev server con HMR\
-   `pnpm build` --- Build de producción\
-   `pnpm lint` --- Linter\
-   `pnpm preview` --- Previsualización del build
