# API Endpoints Documentation - AlmaIA

## 📋 Endpoints Completos por Pantalla - Lista Exhaustiva

### 🔐 SELECCIONAR COLEGIO
| Endpoint | Método | Descripción | Estado |
|----------|--------|-------------|---------|
| `/api/v1/colegios/usuarios_colegios?usuario_id=742` | GET | Obtener colegios del usuario | ✅ Correcto |
| `/api/v1/auth/usuarios` | GET | Gestión de usuarios | ✅ Correcto |
| `/api/v1/perfil/obtener` | GET | Obtener perfil del usuario | ✅ Correcto |
| `/api/v1/auth/login` | POST | Inicio de sesión | ✅ Correcto |

### 📊 DASHBOARD
| Endpoint | Método | Descripción | Estado |
|----------|--------|-------------|---------|
| `/api/v1/colegios` | GET | Lista de colegios | ✅ Correcto |
| `/api/v1/home/cards/emociones?colegio_id=2` | GET | Tarjetas de emociones | ✅ Correcto |
| `/api/v1/alumnos/alertas/conteo?colegio_id=2` | GET | Conteo de alertas | ✅ Correcto |

### 🚨 ALERTAS Y BITÁCORAS COMPLETAS

#### Alertas Básicas
| Endpoint | Método | Descripción | Estado |
|----------|--------|-------------|---------|
| `/api/v1/alumnos/alertas/conteo?colegio_id=2` | GET | Conteo de alertas | ✅ Correcto |
| `/api/v1/alertas/alertas_tipos?colegio_id=2` | GET | Tipos de alertas | ✅ Correcto |
| `/api/v1/alertas/alertas_prioridades?colegio_id=2` | GET | Prioridades de alertas | ✅ Correcto |
| `/api/v1/alertas/alertas_estado?colegio_id=2` | GET | Estados de alertas | ✅ Correcto |
| `/api/v1/alertas/alertas_severidades?colegio_id=2` | GET | Severidades de alertas | ✅ Correcto |
| `/api/v1/alumnos/alertas?colegio_id=2` | GET | Lista de alertas | ✅ Correcto |
| `/api/v1/alumnos/alertas/{id}?colegio_id=2` | GET | Detalle de alerta | ✅ Correcto |

#### Bitácoras de Alertas - CRUD Completo
| Endpoint | Método | Descripción | Estado |
|----------|--------|-------------|---------|
| `/api/v1/alumnos/alertas_bitacoras` | GET | Obtener bitácoras | ✅ Correcto |
| `/api/v1/alumnos/alertas_bitacoras` | POST | Crear bitácora | ✅ Correcto |
| `/api/v1/alumnos/alertas_bitacoras/{id}` | PUT | Actualizar bitácora | ✅ Correcto |
| `/api/v1/alumnos/alertas_bitacoras/{id}` | DELETE | Eliminar bitácora | ✅ Correcto |

#### Responsables de Bitácoras - Campos Clave
Las bitácoras incluyen estos campos para responsables:
- `responsable_actual_id` - ID del responsable actual de la alerta
- `nuevo_responsable` - Para cambiar responsable en bitácora
- `responsable_id` - ID del responsable asignado

#### Gatilladores de Bitácoras
El sistema actualiza automáticamente los responsables cuando se crea una bitácora.

### 👨‍🎓 ALUMNOS COMPLETO
| Endpoint | Método | Descripción | Estado |
|----------|--------|-------------|---------|
| `/api/v1/alumnos?colegio_id=2` | GET | Lista de alumnos | ✅ Correcto |
| `/api/v1/alumnos/detalle/{id}?colegio_id=2` | GET | Detalle completo del alumno | ✅ Correcto |
| `/api/v1/alumnos/buscar` | GET | Búsqueda de alumnos | ✅ Correcto |
| `/api/v1/alumnos/actividades` | GET | Actividades del alumno | ✅ Correcto |
| `/api/v1/alumnos/antecedentes_familiares` | GET | Antecedentes familiares | ✅ Correcto |
| `/api/v1/alumnos/direcciones` | GET | Direcciones del alumno | ✅ Correcto |

### 👥 APODERADOS/RESPONSABLES COMPLETO
| Endpoint | Método | Descripción | Estado |
|----------|--------|-------------|---------|
| `/api/v1/apoderados` | GET/POST | Gestión de apoderados | ✅ Correcto |
| `/api/v1/apoderados/perfil` | GET | Perfil de apoderado | ✅ Correcto |
| `/api/v1/apoderados/{id}` | PUT | Actualizar apoderado | ✅ Correcto |
| `/api/v1/apoderados/responder_preguntas` | POST | Responder preguntas | ✅ Correcto |
| `/api/v1/apoderados/apoderados_direcciones` | GET | Direcciones de apoderados | ✅ Correcto |
| `/api/v1/apoderados/apoderados_respuestas` | GET | Respuestas de apoderados | ✅ Correcto |

### 📊 AUDITORÍA Y SEGUIMIENTO
| Endpoint | Método | Descripción | Estado |
|----------|--------|-------------|---------|
| `/api/v1/auth/auditorias` | GET | Obtener auditorías | ✅ Correcto |
| `/api/v1/auth/auditorias` | POST | Crear auditoría | ✅ Correcto |
| `/api/v1/auth/auditorias-permisos` | GET | Auditoría de permisos | ✅ Correcto |
| `/api/v1/auth/registros_interacciones` | GET | Registros de interacción | ✅ Correcto |

### 👤 USUARIOS Y BITÁCORAS DE USUARIOS
| Endpoint | Método | Descripción | Estado |
|----------|--------|-------------|---------|
| `/api/v1/auth/usuarios` | GET | Gestión de usuarios | ✅ Correcto |
| `/api/v1/auth/usuarios/bitacora` | GET | Bitácora de usuarios | ✅ Correcto |
| `/api/v1/auth/usuarios/{id}` | PUT | Actualizar usuario | ✅ Correcto |

### 📈 COMPARATIVO
| Endpoint | Método | Descripción | Estado |
|----------|--------|-------------|---------|
| `/api/v1/comparativa/alerts/totales?colegio_id=2` | GET | Totales de alertas comparativo | ✅ Correcto |
| `/api/v1/comparativa/alerts/historial?colegio_id=2` | GET | Historial de alertas comparativo | ✅ Correcto |
| `/api/v1/colegios/grados?colegio_id=2` | GET | Grados del colegio | ✅ Correcto |
| `/api/v1/comparativa/patologias/grado?grado_id=1&colegio_id=2` | GET | Patologías por grado | ✅ Correcto |
| `/api/v1/comparativa/emociones/grado?grado_id=1&colegio_id=2` | GET | Emociones por grado | ✅ Correcto |

### 📋 INFORMES
| Endpoint | Método | Descripción | Estado |
|----------|--------|-------------|---------|
| `/api/v1/informes/generales?colegio_id=2` | GET | Informes generales | ✅ Correcto |
| `/api/v1/informes/alumnos` | GET | Informes de alumnos | ✅ Correcto |
| `/api/v1/informes/alumnos/generar` | POST | Generar informes | ✅ Correcto |

### ⚙️ CONFIGURACIONES - PREGUNTAS COMPLETO
| Endpoint | Método | Descripción | Estado |
|----------|--------|-------------|---------|
| `/api/v1/preguntas` | GET | Lista de preguntas | ✅ Correcto |
| `/api/v1/preguntas/alumnos_respuestas` | GET | Respuestas de alumnos | ✅ Correcto |
| `/api/v1/preguntas/responder` | POST | Responder pregunta | ✅ Correcto |
| `/api/v1/preguntas/responder_multiple` | POST | Responder múltiples preguntas | ✅ Correcto |
| `/api/v1/preguntas/generadores_informes` | GET | Generadores de informes | ✅ Correcto |
| `/api/v1/preguntas/respuestas_posibles` | GET | Respuestas posibles | ✅ Correcto |
| `/api/v1/preguntas/tipos_oficios` | GET | Tipos de oficios | ✅ Correcto |
| `/api/v1/preguntas/respuestas_seleccion` | GET | Respuestas de selección | ✅ Correcto |

### 👨‍🏫 ADMINISTRATIVO - DOCENTES
| Endpoint | Método | Descripción | Estado |
|----------|--------|-------------|---------|
| `/api/v1/docentes?colegio_id=2` | GET | Lista de docentes | ✅ Correcto |
| `/api/v1/docentes/detalle/{id}` | GET | Detalle del docente | ✅ Correcto |

## 🔄 Flujo de Responsables de Bitácoras

### Flujo Completo:
1. Las bitácoras se crean con `AlumnoAlertaBitacoraService.guardar`
2. Automáticamente actualizan el `responsable_actual_id` en la alerta
3. Se registra auditoría de cambios de responsable
4. Las bitácoras incluyen información completa del responsable en las consultas

### Principales problemas identificados y solucionados:
- ✅ Estructura `/api/proxy/` incorrecta → Corregida a `/api/v1/`
- ✅ Faltaban todos los endpoints CRUD de bitácoras → Implementados
- ✅ Faltaba gestión completa de responsables y auditoría → Completada
- ✅ Endpoints duplicados innecesarios → Eliminados

## 📝 Notas Técnicas

### Frontend Proxy Pattern:
El frontend utiliza el prefijo `/api/proxy/` que correctamente redirige al backend `/api/v1/` a través del proxy configurado en `app/api/proxy/[...path]/route.ts`.

### Variables de Entorno:
- `NEXT_PUBLIC_API_BASE_URL=https://api-almaia-prod.onrender.com/api/v1`

### Servicios Implementados:
- `alerts-service.ts` - Gestión completa de alertas y bitácoras
- `students-service.ts` - Gestión de alumnos
- `auth-service.ts` - Autenticación y usuarios
- `comparativo-service.ts` - Datos comparativos
- Y otros servicios para cada dominio

### Responsables y Auditoría:
- Sistema completo de seguimiento de cambios de responsables
- Auditoría automática de todas las operaciones
- Bitácoras con información completa de responsables
