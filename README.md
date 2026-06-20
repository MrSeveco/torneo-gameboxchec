# Torneo Gamers CHEC 2026 - Landing Page

Aplicación frontend construida con React, TypeScript y Tailwind CSS v4 para gestionar e informar sobre el Torneo Gamers CHEC 2026.

## Características
- 100% Frontend (SPA sin backend).
- Modo público para visualización de cronograma, grupos, resultados, posiciones y llaves.
- Modo administrador protegido para modificar resultados y guardar datos localmente.

## Configuración y Desarrollo

### Requisitos
- Node.js (v18+)
- npm

### Inicialización
```bash
npm install
npm run dev
```

### Construcción
```bash
npm run build
```

## Modo Administrador

La aplicación cuenta con un modo administrador protegido por una contraseña validada mediante hash SHA-256. 
Este modo permite editar los marcadores y el estado de los partidos. Al modificar un resultado válido, la tabla de posiciones y la sección de clasificados se recalcula automáticamente.

### ¿Cómo ingresar?
Puedes acceder al modo administrador de dos formas:
1. Agregando `#admin` al final de la URL (ejemplo: `http://localhost:5173/#admin`).
2. Haciendo clic en el enlace discreto en el Footer ("Acceso administrador").

### Seguridad (Generar un nuevo Hash)
Actualmente el proyecto tiene una contraseña por defecto de prueba: `admin123`.
**ANTES DE PUBLICAR EL PROYECTO**, debes generar un nuevo hash de tu propia contraseña y reemplazarlo en `src/config/adminConfig.ts`.

**Instrucciones para generar el hash:**
1. Abre tu aplicación en el navegador y presiona F12 para abrir las herramientas de desarrollador.
2. Ve a la pestaña **Consola** (Console).
3. Pega el siguiente código JavaScript, cambiando `"TuContraseñaSecreta"` por la contraseña que deseas:

```javascript
(async function() {
  const encoder = new TextEncoder();
  const data = encoder.encode("TuContraseñaSecreta");
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  console.log("TU HASH ES:", hashHex);
})();
```

4. Copia el texto hexadecimal resultante que aparece en consola.
5. Abre el archivo `src/config/adminConfig.ts` y reemplaza el valor de `ADMIN_PASSWORD_HASH`.

### Persistencia y Publicación de Cambios (Importante)
Como esta aplicación **NO utiliza base de datos externa ni servidor backend**, la persistencia funciona de la siguiente manera:
- Al editar, los cambios quedan guardados en la sesión actual y al presionar "Guardar Cambios" se almacenan en el `localStorage` de **tu navegador únicamente**.
- Los visitantes (modo público) **no verán** estos cambios automáticamente.
- **Para publicar los cambios a todo el mundo:**
  1. Ingresa como administrador y asegúrate de que todos los resultados están actualizados.
  2. Haz clic en **Exportar JSON**. Esto descargará un archivo `torneo-data-YYYY-MM-DD.json`.
  3. Abre tu proyecto en un editor de código.
  4. Toma los datos del archivo JSON exportado (los arreglos `matches`, `groups`, `participants`) y pégalos para reemplazar los arreglos iniciales en el archivo `src/data/tournamentData.ts`.
  5. Sube tus cambios al repositorio y haz un nuevo despliegue (redeploy) de la página web.
