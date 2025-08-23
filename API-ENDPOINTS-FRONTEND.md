# API Endpoints for Frontend

## SELECCIONAR COLEGIO
- **GET** `/api/v1/colegios/usuarios_colegios?usuario_id=742`
- **GET** `/api/v1/auth/usuarios` 
- **GET** `/api/v1/perfil/obtener`
- **POST** `/api/v1/auth/login`

## DASHBOARD
- **GET** `/api/v1/colegios`
- **GET** `/api/v1/home/cards/emociones?colegio_id=2`
- **GET** `/api/v1/alumnos/alertas/conteo?colegio_id=2`

## ALERTAS Y BITÁCORAS COMPLETAS
- **GET** `/api/v1/alumnos/alertas/conteo?colegio_id=2`
- **GET** `/api/v1/alertas/alertas_tipos?colegio_id=2`
- **GET** `/api/v1/alertas/alertas_prioridades?colegio_id=2`
- **GET** `/api/v1/alertas/alertas_estado?colegio_id=2`
- **GET** `/api/v1/alertas/alertas_severidades?colegio_id=2`
- **GET** `/api/v1/alumnos/alertas?colegio_id=2`
- **GET** `/api/v1/alumnos/alertas/{id}?colegio_id=2`

## BITÁCORAS DE ALERTAS - CRUD COMPLETO
- **GET** `/api/v1/alumnos/alertas_bitacoras`
- **POST** `/api/v1/alumnos/alertas_bitacoras`
- **PUT** `/api/v1/alumnos/alertas_bitacoras/{id}`
- **DELETE** `/api/v1/alumnos/alertas_bitacoras/{id}`

## ALUMNOS COMPLETO
- **GET** `/api/v1/alumnos?colegio_id=2`
- **GET** `/api/v1/alumnos/detalle/{id}?colegio_id=2`
- **GET** `/api/v1/alumnos/buscar`
- **GET** `/api/v1/alumnos/actividades`
- **GET** `/api/v1/alumnos/antecedentes_familiares`
- **GET** `/api/v1/alumnos/direcciones`

## APODERADOS/RESPONSABLES COMPLETO
- **GET** `/api/v1/apoderados`
- **POST** `/api/v1/apoderados`
- **GET** `/api/v1/apoderados/perfil`
- **PUT** `/api/v1/apoderados/{id}`
- **POST** `/api/v1/apoderados/responder_preguntas`
- **GET** `/api/v1/apoderados/apoderados_direcciones`
- **GET** `/api/v1/apoderados/apoderados_respuestas`

## AUDITORÍA Y SEGUIMIENTO
- **GET** `/api/v1/auth/auditorias`
- **POST** `/api/v1/auth/auditorias`
- **GET** `/api/v1/auth/auditorias-permisos`
- **GET** `/api/v1/auth/registros_interacciones`

## USUARIOS Y BITÁCORAS DE USUARIOS
- **GET** `/api/v1/auth/usuarios`
- **GET** `/api/v1/auth/usuarios/bitacora`
- **PUT** `/api/v1/auth/usuarios/{id}`

## COMPARATIVO
- **GET** `/api/v1/comparativa/alerts/totales?colegio_id=2`
- **GET** `/api/v1/comparativa/alerts/historial?colegio_id=2`
- **GET** `/api/v1/colegios/grados?colegio_id=2`
- **GET** `/api/v1/comparativa/patologias/grado?grado_id=1&colegio_id=2`
- **GET** `/api/v1/comparativa/emociones/grado?grado_id=1&colegio_id=2`

## INFORMES
- **GET** `/api/v1/informes/generales?colegio_id=2`
- **GET** `/api/v1/informes/alumnos`
- **POST** `/api/v1/informes/alumnos/generar`

## CONFIGURACIONES - PREGUNTAS COMPLETO
- **GET** `/api/v1/preguntas`
- **GET** `/api/v1/preguntas/alumnos_respuestas`
- **POST** `/api/v1/preguntas/responder`
- **POST** `/api/v1/preguntas/responder_multiple`
- **GET** `/api/v1/preguntas/generadores_informes`
- **GET** `/api/v1/preguntas/respuestas_posibles`
- **GET** `/api/v1/preguntas/tipos_oficios`
- **GET** `/api/v1/preguntas/respuestas_seleccion`

## ADMINISTRATIVO - DOCENTES
- **GET** `/api/v1/docentes?colegio_id=2`
- **GET** `/api/v1/docentes/detalle/{id}`
