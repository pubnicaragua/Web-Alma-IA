# PENDIENTES DEL PROYECTO ALMA IA - FRONTEND  
  
Este documento lista las tareas pendientes en el frontend de React, organizadas por módulos y prioridades, con referencias directas a los archivos involucrados y las acciones a realizar.  
  
## 1. Aplicación Web  
  
### 1.1. Login  
  
*   **Necesario:**  
    *   [ ] **Revisar si "Recuérdame" está funcionando**   
    *   [ ] **Olvidaste contraseña**  
        *   **Archivos involucrados:** `app/(auth)/login/page.tsx`  
        *   **Acción:** Implementar la funcionalidad completa de "Olvidaste contraseña" y la página asociada en `/forgot-password`.
  
*   **Deseable:**  
    *   [ ] **Fondo más llamativo y logo AlmaIA**  
        *   **Archivos involucrados:** Archivos CSS, `app/(auth)/login/page.tsx`, componentes de layout.  
        *   **Acción:** Ajustar estilos visuales para el fondo y el logo.  
  
### 1.2. Selector de Colegios  
  
*   **Necesario:**  
    *   [ ] **Validar con más usuarios y confirmar si está operando todo correctamente**  
        *   **Archivos involucrados:**  
            *   `app/select-school/page.tsx`  
            *   `services/school-service.ts`  
        *   **Acción:** Realizar pruebas de QA con múltiples usuarios para confirmar el correcto funcionamiento de la selección de colegios.  
  
### 1.3. Home  
  
*   **Urgente:**  

    *   [ ] **Campanita Alertas: Al pinchar se va a la opción de alertas. sin embargo, aparecen todas y no solo las pendientes**  
        *   **Archivos involucrados:**  
            *   `components/recent-alerts.tsx`  
            *   `services/home-service.ts`  
        *   **Acción:** Modificar `fetchRecentAlerts` para que acepte un parámetro de filtro de estado o para que el backend devuelva solo las alertas pendientes.  



  /* HENRY */
    *   [ ] **Existe un segundo Gráfico de emociones. que debe ser de patologías. es el gráfico que está al centro.**  
        *   **Archivos involucrados:** `app/page.tsx`  
        *   **Acción:** Renombrar el título del gráfico y ajustar los datos (`apiEmotions`) que se le pasan para que reflejen patologías. Requiere un nuevo endpoint en el backend.  
    *   [ ] **El gráfico final del home de "Alertas Recientes" revisar si está por colegio. ya que si cambio de colegio y visualizo se presenta la misma alerta**  
        *   **Archivos involucrados:**  
            *   `components/recent-alerts.tsx`  
            *   `services/home-service.ts`  
            *   `lib/api-config.ts`  
        *   **Acción:** Asegurarse de que `fetchRecentAlerts` reciba el `colegio_id` y lo incluya en la solicitud al backend.  
  /* HENRY */


*   **Importantes:**  
    *   [ ] **Popup y finalizar sesión (revisar completo)**  
        *   **Archivos involucrados:** `components/session-timeout.tsx`  
        *   **Acción:**  
            *   [ ] **Aumentar timeout a 1 min:** Ya se propuso aumentar a 30 minutos (`INACTIVITY_TIMEOUT = 1800`) y tiempo de advertencia de 2 minutos (`WARNING_TIME = 120`).  
            *   [ ] **Si sale el popup del timeout. e indico cerrar sesión. y vuelvo a autenticarme.. sigue saliendo el popup del termino de sesión:** Asegurar que el estado del `SessionTimeout` se resetea completamente al cerrar sesión o al volver a autenticarse.  
            *   [ ] **Si dejo pasar los 30 seg. y llega a cero. la sesión sigue activa. debe salirse al Login:** Verificar la invalidación del token en el backend o la función `logout()` del frontend.  
            *   [ ] **Si el usuario No está activo (No mueve el mouse, No toca la pantalla, o NO escribe), no deberías forzar un cierre:** La detección de actividad y el `throttle` ya están implementados.  
  
*   **Deseable:**  
    *   [ ] **Sección Fechas Importantes: colocar desde la fecha de hoy en adelante**  
        *   **Archivos involucrados:**  
            *   `components/important-dates.tsx`  
            *   `services/home-service.ts`  
        *   **Acción:** Modificar `fetchImportantDates` para enviar un parámetro de fecha al backend o para que el backend filtre las fechas pasadas.  
    *   [ ] **Gráfico de Anillos: Colocar un filtro de última semana, último mes, Total del año**  
        *   **Archivos involucrados:** `app/page.tsx` (para `DonutChart`), servicio de datos.  
        *   **Acción:** Implementar un `FilterDropdown` para el `DonutChart` y modificar la función que carga sus datos para que acepte y aplique el filtro de tiempo.  
    *   [ ] **Campanita. ojalá se mueva cuando hay datos de alertas (pendientes)**  
        *   **Archivos involucrados:** `components/recent-alerts.tsx`  
        *   **Acción:** Implementar una animación CSS o un componente de animación condicionalmente cuando `RecentAlerts` tenga alertas pendientes.  
  
### 1.4. Alumnos  
  
*   **Urgente:**  
    *   [ ] **ir opción Alertas. al pinchar la alerta para ir al detalle se cae.**  
        *   **Archivos involucrados:**  
            *   `app/alumnos/[id]/page.tsx`  
            *   `components/student/student-alerts.tsx`  
        *   **Acción:** Asegurar que el `alumno_alerta_id` del backend se mapee correctamente a la propiedad `id` de la interfaz `Alert` en `alertsData` en `app/alumnos/[id]/page.tsx` antes de pasarlo a `StudentAlerts`.  
  
### 1.5. Comparativo  
  
*   **Urgente:**  
    *   [ ] **Revisar todos los endpoint. falta un gráfico al final de líneas también.**  
        *   **Archivos involucrados:** `app/comparativo/page.tsx`, servicios de datos comparativos.  
        *   **Acción:** Conectar los gráficos (`BarChartComparison`, `LineChartComparison`) a endpoints reales del backend. Si falta un gráfico de líneas, añadirlo y conectarlo a sus datos.  
  
### 1.6. Informes  
  
*   [ ] **Al descargar se cae.**  
    *   **Archivos involucrados:** `app/informes/page.tsx`, lógica de descarga de informes.  
    *   **Acción:** Depurar la función de descarga de informes para identificar y corregir la causa de la caída.  
*   [ ] **el título Descargar informe. colocar "Informe" solamente.**  
    *   **Archivos involucrados:** `app/informes/page.tsx`  
    *   **Acción:** Modificar el texto del botón de descarga.  
*   [ ] **Botón de descarga estilizarlo.**  
    *   **Archivos involucrados:** `app/informes/page.tsx`  
    *   **Acción:** Aplicar estilos CSS al botón de descarga.  
  
### 1.7. Perfil  
  
*   [ ] **Revisar completo.**  
    *   **Archivos involucrados:** `app/perfil/page.tsx`  
    *   **Acción:** Realizar una revisión exhaustiva de la página de perfil.  
*   [ ] **Edita Perfil:**  
    *   [ ] **No valida correo electrónico.**  
        *   **Archivos involucrados:** Formulario de edición de perfil en `app/perfil/page.tsx`.  
        *   **Acción:** Implementar validación de formato de correo electrónico.  
    *   [ ] **cambiar de imagen.**  
        *   **Archivos involucrados:** Formulario de edición de perfil en `app/perfil/page.tsx`.  
        *   **Acción:** Implementar funcionalidad para subir y cambiar la imagen de perfil.  
    *   [ ] **validar fechas futuras. no debe poder generar fechas futuras en fecha de nacimiento.**  
        *   **Archivos involucrados:** Formulario de edición de perfil en `app/perfil/page.tsx`.  
        *   **Acción:** Implementar validación para que la fecha de nacimiento no sea una fecha futura.  
    *   [ ] **URL. debe pedir cargar el archivo.**  
        *   **Archivos involucrados:** Formulario de edición de perfil en `app/perfil/page.tsx`.  
        *   **Acción:** Si la "URL" se refiere a un archivo, cambiar el input a tipo `file` para permitir la carga.  
    *   [ ] **Nueva contraseña. deberías tener un check cuando quiera cambiar. y ahí debe abrir opción nueva de cambio de clave (clave y reingresar).**  
        *   **Archivos involucrados:** Formulario de edición de perfil en `app/perfil/page.tsx`.  
        *   **Acción:** Implementar lógica condicional para mostrar campos de cambio de contraseña solo cuando se active un checkbox.  
*   [ ] **al guardar, debe refrescar la pantalla anterior con datos actualizados del perfil. eso incluye el nombre del perfil de la cabecera.**  
    *   **Archivos involucrados:** `app/perfil/page.tsx`, componentes de cabecera (`components/header.tsx`), servicios de perfil.  
    *   **Acción:** Después de guardar los cambios, recargar los datos del perfil y actualizar el estado global o local que afecte a la cabecera.  
  
### 1.8. Alertas (Grilla y Creación)  
  
*   [ ] **Alertas. la grilla debe ser ordenada por fecha y hora descendente.**  
    *   **Archivos involucrados:** `app/alertas/page.tsx`, `components/data-table.tsx` (si aplica).  
    *   **Acción:** Implementar lógica de ordenamiento en la grilla de alertas.  
*   [ ] **Al agregar alerta. falta alerta Rojas.**  
    *   **Archivos involucrados:** `components/student/add-alert-modal.tsx`  
    *   **Acción:** Asegurarse de que el modal permita seleccionar el tipo de alerta "Roja".  
*   [ ] **colocar opción de hora. ya que agrega la hora actual. sino coloca hora quedan las 12:00hrs por defecto.**  
    *   **Archivos involucrados:** `components/student/add-alert-modal.tsx`  
    *   **Acción:** Añadir un campo de hora al modal y asegurar que se envíe al backend.  
  
## 2. Motores (Backend)  
  
Estos puntos son responsabilidad del equipo de backend, pero su correcta implementación es crucial para el funcionamiento del frontend.  
  
*   [ ] **Motor de Preguntas**  
*   [ ] **Motor de Alertas**  
    *   [ ] Amarillas  
    *   [ ] Naranjas  
    *   [ ] Rojas  
    *   [ ] Inactividad  
*   [ ] **Motor de Informes**  
    *   [ ] Gustos  
    *   [ ] Alumnos Mes  
    *   [ ] Colegio  
    *   [ ] Cursos  
    *   [ ] Nivel