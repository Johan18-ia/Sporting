# Informe de pruebas E2E — Sporting Club

## Encabezado

| Campo | Valor |
|---|---|
| Fecha | 11 de noviembre de 2026 |
| Ejecutor | QA Automation Engineer — Cypress en modo headless |
| Entorno | Windows; React + Vite en `http://localhost:5173` |
| Navegador | Electron 146 (headless; Cypress lo marca como obsoleto) |
| Cypress | 16.2.1 |
| Node.js | 24.18.0 |
| React / Vite | 19.2.8 / 8.3.4 |
| API / datos | API simulada mediante `cy.intercept()`; sin conexión a MySQL |
| Comando | `npx cypress run` |

## Resumen ejecutivo

Se ejecutaron los cuatro specs automatizados —autenticación, vistas públicas, estudiantes y usuarios— con un total de **21 pruebas**. Las 21 finalizaron correctamente: **100 % de éxito** en 45 segundos. Cypress produjo un video por spec y no tomó capturas de fallos.

AUT-03 ahora valida `.alert-error`, que es la clase generada por el frontend. La ruta de actualización de usuarios también quedó alineada con el backend: el test confirma que la petición de edición usa `PUT /api/users/3`.

Las operaciones API de esta suite se interceptan para mantener las pruebas aisladas y repetibles. Por ello, la corrida verifica la interfaz, el payload y la URL de actualización, pero no la persistencia real en MySQL.

## Métricas

| Métrica | Resultado |
|---|---:|
| Specs | 4 |
| Total de pruebas | 21 |
| Aprobadas | 21 |
| Fallidas | 0 |
| Éxito | 100 % |
| Fallo | 0 % |
| Duración | 00:45 |
| Screenshots | 0 |
| Video | Habilitado; 4 archivos |

## Resultado detallado por prueba

| ID | Módulo | Descripción | Estado | Observaciones |
|---|---|---|---|---|
| AUT-01 | Autenticación / HU01 | Inicio de sesión válido | ✅ PASÓ | Redirige al dashboard y persiste el token. |
| AUT-02 | Autenticación / HU01 | Rechazo de credenciales inválidas | ✅ PASÓ | Presenta el mensaje devuelto por la API simulada. |
| AUT-03 | Autenticación / HU01 | Rechazo de usuario inactivo | ✅ PASÓ | La respuesta 403 se presenta mediante `.alert-error`. |
| AUT-04 | Autenticación / HU01 | Validación de campos vacíos | ✅ PASÓ | Valida en cliente sin enviar el login. |
| AUT-05 | Autenticación / HU01 | Email con formato inválido | ✅ PASÓ | El input de email impide el envío con formato inválido. |
| AUT-06 | Autenticación / HU02 | Cierre de sesión | ✅ PASÓ | Limpia el token y navega a `/login`. |
| PUB-01 | Vistas públicas | Catálogo sin iniciar sesión | ✅ PASÓ | Productos interceptados; no requiere token. |
| PUB-02 | Vistas públicas | Registro público de padre | ✅ PASÓ | Email único generado con `Date.now()`. |
| EST-01 | Estudiantes | Listar estudiantes | ✅ PASÓ | Muestra tarjetas y métricas de categorías. |
| EST-02 | Estudiantes | Filtrar por categoría | ✅ PASÓ | La categoría 2014 deja visible a Ana Pérez. |
| EST-03 | Estudiantes | Crear estudiante | ✅ PASÓ | Envía el `category_id` seleccionado. |
| USR-01 | Usuarios / HU05 | Listar usuarios | ✅ PASÓ | Muestra admin, vendedor, usuario y cuenta inactiva. |
| USR-02 | Usuarios / HU06 | Crear usuario | ✅ PASÓ | Email único, rol usuario y respuesta simulada. |
| USR-03 | Usuarios / HU08 | Editar usuario | ✅ PASÓ | Verifica payload y URL `PUT /api/users/3`. |
| USR-04 | Usuarios / HU09 | Desactivar usuario | ✅ PASÓ | Confirma la acción y muestra mensaje correcto. |
| USR-05 | Usuarios / HU09 | Activar cuenta inactiva | ✅ PASÓ | Envía `is_active: 1` y presenta éxito. |
| USR-06 | Usuarios / HU10 | Eliminar usuario | ✅ PASÓ | Confirma la acción y recibe éxito simulado. |
| USR-07 | Usuarios / HU10 | Bloquear auto-eliminación del admin | ✅ PASÓ | El botón propio está deshabilitado. |
| USR-08 | Usuarios / HU09 | Bloquear auto-desactivación del admin | ✅ PASÓ | Acciones de estado propias deshabilitadas. |
| USR-09 | Usuarios / HU05 | Restricciones de vendedor | ✅ PASÓ | No puede eliminar o cambiar estado de otros usuarios. |
| USR-10 | Usuarios / HU05 | Bloqueos de auto-acciones de vendedor | ✅ PASÓ | No puede eliminarse ni cambiar su estado. |

## Análisis de fallos

No se registraron fallos en esta ejecución. Los dos problemas tratados están corregidos:

- **AUT-03:** la aserción usa `.alert-error`, consistente con `LoginView.jsx` y `AlertMessage.jsx`.
- **Actualización de usuarios:** `USER_UPDATE` está definido como `/users/:id`; `updateUser` y `patchUser` sustituyen `:id` por el identificador real. La prueba de edición verifica `PUT /api/users/3`.

**Alcance pendiente:** la edición verifica la URL y el payload con una respuesta interceptada. Se recomienda una prueba de integración con una BD de pruebas separada para validar persistencia CRUD contra el backend.

## Cobertura por Historia de Usuario

| Historia | Cobertura | Resultado |
|---|---|---|
| HU01 | Login válido/inválido, inactivo, campos vacíos y formato de email | 5 aprobadas |
| HU02 | Logout y limpieza del token | Aprobada |
| HU05 | Listado y restricciones admin/vendedor | Aprobadas |
| HU06 | Crear usuario | Aprobada |
| HU08 | Editar usuario y verificar ruta | Aprobada |
| HU09 | Activar, desactivar y restricciones propias | Aprobadas |
| HU10 | Eliminar y bloquear auto-eliminación | Aprobadas |
| Estudiantes | Listar, filtrar y crear | 3 aprobadas |
| Vistas públicas | Catálogo anónimo y registro | 2 aprobadas |

Las claves HU se asignan según las historias indicadas en la solicitud; no se proporcionaron criterios de aceptación formales adicionales.

## Conclusión y próximos pasos

Las 21 pruebas pasan tras las dos correcciones solicitadas. Los casos de autenticación, CRUD, permisos, estudiantes y vistas públicas están cubiertos mediante respuestas controladas.

1. Añadir una corrida de integración contra backend y base de datos de pruebas para validar persistencia CRUD.
2. Considerar Chrome como navegador de ejecución para evitar el aviso de obsolescencia de Electron.

## Anexos — comandos para re-ejecutar

Desde `frontend_web/frontend`:

```bash
npm install
npm run dev -- --host 0.0.0.0
```

En otra terminal, desde la misma carpeta:

```bash
npx cypress run
npx cypress open
npx cypress run --spec "cypress/e2e/auth.cy.js"
npx cypress run --spec "cypress/e2e/users.cy.js"
```

## Anexo A — salida de terminal

Ejecución real de `npx cypress run` desde `frontend_web/frontend`.

```text
npm notice run sis-web-mvc@0.0.0 npx
npm notice run ^"cypress^" run


====================================================================================================

  (Run Starting)

  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Cypress:        16.2.1                                                                         │
  │ Browser:        Electron 146 (headless) (deprecated)                                           │
  │ Node Version:   v24.18.0 (C:\Program Files\nodejs\node.exe)                                    │
  │ Specs:          4 found (auth.cy.js, public.cy.js, students.cy.js, users.cy.js)                │
  │ Searched:       cypress/e2e/**/*.cy.js                                                         │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘

Warning: The Electron browser is deprecated as a test browser and will be removed in a future version of Cypress.

Switch to Chrome or another installed browser to avoid a breaking change when you upgrade.

Read more about supported browsers: https://on.cypress.io/launching-browsers


────────────────────────────────────────────────────────────────────────────────────────────────────
                                                                                                    
  Running:  auth.cy.js                                                                      (1 of 4)


  Autenticación - HU01 y HU02
    √ HU01 - inicia sesión con credenciales válidas (3007ms)
    √ HU01 - rechaza credenciales inválidas (1313ms)
    √ HU01 - informa que una cuenta inactiva no puede iniciar sesión (1140ms)
    √ HU01 - valida los campos vacíos antes de enviar la petición (688ms)
    √ HU01 - bloquea un email con formato inválido (1243ms)
    √ HU02 - cierra sesión y limpia el token persistido (1482ms)


  6 passing (9s)


  (Results)

  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Tests:        6                                                                                │
  │ Passing:      6                                                                                │
  │ Failing:      0                                                                                │
  │ Pending:      0                                                                                │
  │ Skipped:      0                                                                                │
  │ Screenshots:  0                                                                                │
  │ Video:        true                                                                             │
  │ Duration:     9 seconds                                                                        │
  │ Spec Ran:     auth.cy.js                                                                       │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘


  (Video)

  -  Video output: C:\Users\Aprendiz\Documents\git\nube-de-Sporty\frontend_web\frontend\cypress\videos\auth.cy.js.mp4


────────────────────────────────────────────────────────────────────────────────────────────────────
                                                                                                    
  Running:  public.cy.js                                                                    (2 of 4)


  Vistas públicas
    √ muestra el catálogo sin iniciar sesión (1941ms)
    √ registra una cuenta pública de padre con email único (2962ms)


  2 passing (5s)


  (Results)

  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Tests:        2                                                                                │
  │ Passing:      2                                                                                │
  │ Failing:      0                                                                                │
  │ Pending:      0                                                                                │
  │ Skipped:      0                                                                                │
  │ Screenshots:  0                                                                                │
  │ Video:        true                                                                             │
  │ Duration:     5 seconds                                                                        │
  │ Spec Ran:     public.cy.js                                                                     │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘


  (Video)

  -  Video output: C:\Users\Aprendiz\Documents\git\nube-de-Sporty\frontend_web\frontend\cypress\videos\public.cy.js.mp4


────────────────────────────────────────────────────────────────────────────────────────────────────
                                                                                                    
  Running:  students.cy.js                                                                  (3 of 4)


  Gestión de estudiantes
    √ HU - lista estudiantes y categorías (2750ms)
    √ HU - filtra estudiantes por categoría (1629ms)
    √ HU - crea un estudiante con una categoría existente (2688ms)


  3 passing (7s)


  (Results)

  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Tests:        3                                                                                │
  │ Passing:      3                                                                                │
  │ Failing:      0                                                                                │
  │ Pending:      0                                                                                │
  │ Skipped:      0                                                                                │
  │ Screenshots:  0                                                                                │
  │ Video:        true                                                                             │
  │ Duration:     7 seconds                                                                        │
  │ Spec Ran:     students.cy.js                                                                   │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘


  (Video)

  -  Video output: C:\Users\Aprendiz\Documents\git\nube-de-Sporty\frontend_web\frontend\cypress\videos\students.cy.js.mp4


────────────────────────────────────────────────────────────────────────────────────────────────────
                                                                                                    
  Running:  users.cy.js                                                                     (4 of 4)


  Gestión de usuarios - HU05, HU06, HU08, HU09 y HU10
    √ HU05 - lista usuarios en tarjetas (3211ms)
    √ HU06 - crea un usuario nuevo con correo único (3462ms)
    √ HU08 - edita los datos de un usuario (2383ms)
    √ HU09 - activa o desactiva una cuenta y confirma la acción (1499ms)
    √ HU09 - activa una cuenta inactiva (1530ms)
    √ HU10 - elimina un usuario y confirma la acción (1482ms)
    √ HU10 - impide la auto-eliminación (1377ms)
    √ HU09 - impide la auto-desactivación (1414ms)
    √ HU05 - restringe al vendedor la eliminación y el cambio de estado (3349ms)
    √ HU05 - impide al vendedor la auto-eliminación y auto-desactivación (3680ms)


  10 passing (24s)


  (Results)

  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Tests:        10                                                                               │
  │ Passing:      10                                                                               │
  │ Failing:      0                                                                                │
  │ Pending:      0                                                                                │
  │ Skipped:      0                                                                                │
  │ Screenshots:  0                                                                                │
  │ Video:        true                                                                             │
  │ Duration:     23 seconds                                                                       │
  │ Spec Ran:     users.cy.js                                                                      │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘


  (Video)

  -  Video output: C:\Users\Aprendiz\Documents\git\nube-de-Sporty\frontend_web\frontend\cypress\videos\users.cy.js.mp4


====================================================================================================

  (Run Finished)


       Spec                                              Tests  Passing  Failing  Pending  Skipped  
  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ √  auth.cy.js                               00:09        6        6        -        -        - │
  ├────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ √  public.cy.js                             00:05        2        2        -        -        - │
  ├────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ √  students.cy.js                           00:07        3        3        -        -        - │
  ├────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ √  users.cy.js                              00:23       10       10        -        -        - │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘
    √  All specs passed!                        00:45       21       21        -        -        -  
```
