# TODO: API Endpoints Fixes and Documentation

## ✅ Completed
- [x] Create comprehensive endpoint documentation
- [x] Fix alerts-service.ts endpoints
- [ ] Fix students-service.ts endpoints  
- [ ] Fix auth-service.ts endpoints
- [ ] Fix comparativo-service.ts endpoints
- [x] Fix home-service.ts endpoints
- [ ] Fix questions-service.ts endpoints
- [ ] Fix reports-service.ts endpoints
- [ ] Fix school-service.ts endpoints
- [ ] Fix teachers-service.ts endpoints
- [x] Remove incorrect/duplicate endpoints
- [ ] Verify all changes work correctly

## 📋 Endpoints to Document and Fix

### ✅ CORRECT ENDPOINTS (from provided list)

#### SELECCIONAR COLEGIO
- ✅ `/api/v1/colegios/usuarios_colegios?usuario_id=742`
- ✅ `/api/v1/auth/usuarios` 
- ✅ `/api/v1/perfil/obtener`
- ✅ `/api/v1/auth/login`

#### DASHBOARD
- ✅ `/api/v1/colegios`
- ✅ `/api/v1/home/cards/emociones?colegio_id=2`
- ✅ `/api/v1/alumnos/alertas/conteo?colegio_id=2`


#### ALERTAS Y BITÁCORAS COMPLETAS
- ✅ `/api/v1/alumnos/alertas/conteo?colegio_id=2`
- ✅ `/api/v1/alertas/alertas_tipos?colegio_id=2`
- ✅ `/api/v1/alertas/alertas_prioridades?colegio_id=2`
- ✅ `/api/v1/alertas/alertas_estado?colegio_id=2`
- ✅ `/api/v1/alertas/alertas_severidades?colegio_id=2`
- ✅ `/api/v1/alumnos/alertas?colegio_id=2`
- ✅ `/api/v1/alumnos/alertas/{id}?colegio_id=2`

#### BITÁCORAS DE ALERTAS - CRUD COMPLETO
- ✅ `/api/v1/alumnos/alertas_bitacoras` - GET
- ✅ `/api/v1/alumnos/alertas_bitacoras` - POST
- ✅ `/api/v1/alumnos/alertas_bitacoras/{id}` - PUT
- ✅ `/api/v1/alumnos/alertas_bitacoras/{id}` - DELETE

#### ALUMNOS COMPLETO
- ✅ `/api/v1/alumnos?colegio_id=2`
- ✅ `/api/v1/alumnos/detalle/{id}?colegio_id=2`
- ✅ `/api/v1/alumnos/buscar`
- ✅ `/api/v1/alumnos/actividades`
- ✅ `/api/v1/alumnos/antecedentes_familiares`
- ✅ `/api/v1/alumnos/direcciones`

#### APODERADOS/RESPONSABLES COMPLETO
- ✅ `/api/v1/apoderados` - GET/POST
- ✅ `/api/v1/apoderados/perfil`
- ✅ `/api/v1/apoderados/{id}` - PUT
- ✅ `/api/v1/apoderados/responder_preguntas` - POST
- ✅ `/api/v1/apoderados/apoderados_direcciones`
- ✅ `/api/v1/apoderados/apoderados_respuestas`

#### AUDITORÍA Y SEGUIMIENTO
- ✅ `/api/v1/auth/auditorias` - GET
- ✅ `/api/v1/auth/auditorias` - POST
- ✅ `/api/v1/auth/auditorias-permisos`
- ✅ `/api/v1/auth/registros_interacciones`

#### USUARIOS Y BITÁCORAS DE USUARIOS
- ✅ `/api/v1/auth/usuarios`
- ✅ `/api/v1/auth/usuarios/bitacora`
- ✅ `/api/v1/auth/usuarios/{id}` - PUT

#### COMPARATIVO
- ✅ `/api/v1/comparativa/alerts/totales?colegio_id=2`
- ✅ `/api/v1/comparativa/alerts/historial?colegio_id=2`
- ✅ `/api/v1/colegios/grados?colegio_id=2`
- ✅ `/api/v1/comparativa/patologias/grado?grado_id=1&colegio_id=2`
- ✅ `/api/v1/comparativa/emociones/grado?grado_id=1&colegio_id=2`

#### INFORMES
- ✅ `/api/v1/informes/generales?colegio_id=2`
- ✅ `/api/v1/informes/alumnos`
- ✅ `/api/v1/informes/alumnos/generar`

#### CONFIGURACIONES - PREGUNTAS COMPLETO
- ✅ `/api/v1/preguntas`
- ✅ `/api/v1/preguntas/alumnos_respuestas`
- ✅ `/api/v1/preguntas/responder` - POST
- ✅ `/api/v1/preguntas/responder_multiple` - POST
- ✅ `/api/v1/preguntas/generadores_informes`
- ✅ `/api/v1/preguntas/respuestas_posibles`
- ✅ `/api/v1/preguntas/tipos_oficios`
- ✅ `/api/v1/preguntas/respuestas_seleccion`

#### ADMINISTRATIVO - DOCENTES
- ✅ `/api/v1/docentes?colegio_id=2`
- ✅ `/api/v1/docentes/detalle/{id}`

## 🎯 Priority Areas
1. Bitácoras CRUD operations
2. Responsables management flows
3. Auditoría functionality
4. Remove incorrect endpoints

## 📝 Notes
- Frontend uses `/api/proxy/` prefix which correctly forwards to `/api/v1/` backend
- Need to ensure all service files use proper endpoint paths
- Verify CRUD operations work correctly for all entities
