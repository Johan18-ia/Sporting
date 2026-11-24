# Pruebas E2E con Cypress

## Requisitos

- Node.js y npm instalados.
- Backend disponible en `http://localhost:3000` cuando se quieran ejecutar pruebas contra la API real.
- Frontend Vite disponible en `http://localhost:5173`.

Las pruebas principales interceptan la API del frontend para que cada caso sea repetible y no dependa de cambios en la base de datos. El comando de instalación añade Cypress como dependencia de desarrollo del frontend.

## Instalación

Desde `frontend_web/frontend` (Cypress ya figura como dependencia de desarrollo):

```bash
npm install
```

## Ejecución

Iniciar Vite en una terminal:

```bash
npm run dev -- --host 0.0.0.0
```

En otra terminal, desde `frontend_web/frontend`:

```bash
npx cypress open
npx cypress run
```

Para ejecutar un spec concreto:

```bash
npx cypress run --spec "cypress/e2e/auth.cy.js"
```

Las capturas de fallos se guardan en `cypress/screenshots` y los videos de ejecución en `cypress/videos`.

## Datos y limitaciones conocidas

- Las cuentas se simulan mediante intercepts en los specs; las pruebas no crean registros en la BD de desarrollo.
- El login presenta errores con la clase `.alert-error`, que es el selector utilizado por las pruebas.
- La actualización web usa `PUT /api/users/:id`, conforme a la ruta declarada en el backend. La prueba E2E verifica la URL de solicitud con una respuesta interceptada; no valida persistencia real en MySQL.
