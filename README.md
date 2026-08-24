# 🏢 YORDEV CONTROL — Sistema Integral de Asistencia y Gestión de RR.HH.

**YORDEV CONTROL** es una plataforma empresarial moderna, modular y escalable para el **Control de Asistencia, Acceso en Tiempo Real y Gestión Integral de Recursos Humanos**, desarrollada con **React, TypeScript, Tailwind CSS, Vite y PWA**, compatible con **Google Apps Script + Google Sheets** como backend inicial y arquitectura desacoplada para futuras migraciones (PostgreSQL, Supabase, Firebase).

---

## 🚀 Características Principales

### 1. ⏱️ Kiosco de Marcación Inteligente (`/marcar`)
- **Modos de Marcación Dual**:
  - **Escáner QR en Tiempo Real**: Lector de cámara integrado con retícula de enfoque y simulación de lectura.
  - **Identificación por Cédula / Código de Empleado**: Búsqueda rápida con teclado numérico y autocompletado seguro.
- **Reloj Sincronizado**: Horario oficial de Colombia / Bogotá (`America/Bogota` UTC-5).
- **Protección Antiduplicados**: Ventana configurable de 120 segundos para evitar marcaciones dobles accidentales.
- **Cálculo Automatizado de Estados**:
  - *Puntual* (dentro del rango de tolerancia).
  - *Llegada Tarde* (superada la tolerancia de entrada).
  - *Salida Temprana* (antes de la hora pactada de salida).
  - *Horas Extras* (tiempo laborado posterior al fin del turno).
- **Confirmación Visual**: Tarjeta interactiva con foto del colaborador, sede, departamento, timestamp exacto y estado resultante.

### 2. 👥 Gestión de Empleados y Expediente Digital
- **Directorio de Colaboradores**: Búsqueda, filtros por departamento, sede y estado laboral.
- **Enmascaramiento de Privacidad**: Cédulas y datos sensibles protegidos (`1.023.***.789`).
- **Información Completa**:
  - Datos personales, tipo de documento y estado civil.
  - Datos de contacto y contacto de emergencia.
  - Información laboral (código, cargo, departamento, sede, jefe directo, tipo de contrato, jornada).
  - Seguridad Social (EPS, ARL, Fondo de Pensiones, Caja de Compensación).
  - Información financiera con acceso restringido (salario, banco, cuenta).
- **Estados Laborales**: `ACTIVO`, `VACACIONES`, `LICENCIA`, `INCAPACIDAD`, `SUSPENDIDO`, `RETIRADO` (desactivación lógica sin borrado destructivo).

### 3. 💳 Carnetización Corporativa (`/carnets`)
- Visualización de carnets corporativos en formato estándar **CR80** (frente y reverso).
- Generación dinámica de tokens QR para marcación sin contacto.
- Opción de descarga e impresión directa de carnets.

### 4. ⏰ Horarios, Turnos y Tolerancias (`/horarios`)
- Configuración de turnos (Fijo, Rotativo, Nocturno, Flexible).
- Parámetros individuales de tolerancia de entrada y salida (minutos de gracia).
- Preparado para jornadas que cruzan la medianoche.

### 5. ⌛ Horas Extras y Flujo de Aprobación (`/horas-extras`)
- Detección automática de tiempo suplementario laborado.
- Flujo de estados: `PENDIENTE` → `APROBADA` / `RECHAZADA`.
- Trazabilidad del usuario aprobador y notas de justificación.

### 6. 📋 Novedades, Permisos e Incapacidades (`/incidencias`)
- Registro de permisos laborales, incapacidades médicas (EPS), licencias, calamidades domésticas, días compensatorios y trabajo remoto.
- **Soporte Documental / Excusa Médica (Opcional)**: Enlace a documentos digitales (PDF, Google Drive, fórmulas médicas) con visor integrado.
- Aprobación por parte de Jefatura y Recursos Humanos.

### 7. 🏢 Organización Empresarial (`/departamentos`, `/sedes`)
- Estructura de sedes físicas y sucursales.
- Gestión de áreas, centros de costos y asignación de líderes de departamento.

### 8. 📊 Reportes y Exportación de Datos (`/reportes`)
- Reportes consolidados de asistencia, tardanzas, ausentismo y horas extras.
- Filtros avanzados por rango de fechas y departamentos.
- Exportación instantánea a formato **CSV compatible con Excel**.

### 9. 🔐 Seguridad, Roles y Auditoría Inmutable (`/usuarios`, `/auditoria`)
- **Roles RBAC**:
  - `SUPER_ADMIN`: Control total de configuración, usuarios y parámetros del sistema.
  - `HR`: Gestión integral de talento humano, expedientes, novedades y reportes.
  - `BOSS`: Supervisión de asistencia, aprobación de horas extras y novedades de su equipo.
  - `EMPLOYEE`: Portal de autoconsulta de marcaciones (`/mi-asistencia`), horarios y solicitudes.
- **Auditoría Inmutable**: Registro con timestamp, usuario, rol, IP, módulo y payload de cambios.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | React 18, TypeScript, Vite |
| **Estilos & UI** | Tailwind CSS v4, Lucide React Icons |
| **PWA & Offline** | Service Workers, Manifest, LocalStorage Sync |
| **Arquitectura de Datos** | Patrón Repository / Provider (`IDataProvider`) |
| **Backend Inicial** | Google Apps Script (Web App JSON REST) + Google Sheets |
| **Formatos de Exportación** | CSV, JSON Backup |

---

## 📁 Estructura del Proyecto

```
├── gas/                           # Scripts de Google Apps Script (Backend)
│   ├── Code.gs                    # Entry point y router REST doOptions / doPost / doGet
│   ├── Config.gs                  # Configuración y cabeceras de hojas
│   └── Utils.gs                   # Utilidades y CORS
├── src/
│   ├── components/
│   │   ├── attendance/            # Calendario, tablas y scanner de asistencia
│   │   ├── common/                # Modales, toast, badges, inputs
│   │   ├── incidents/             # Tablas y filtros de novedades con soporte
│   │   ├── layout/                # Sidebar, Header y Layout principal
│   │   └── overtime/              # Tabla y aprobador de horas extras
│   ├── constants/
│   │   └── mockData.ts            # Semillas de datos de prueba para modo demo
│   ├── contexts/
│   │   ├── AppContext.tsx         # Estado global (configuración, sync, online/offline)
│   │   └── AuthContext.tsx        # Sesión actual y conmutador de roles (RBAC)
│   ├── pages/                     # Páginas y vistas principales de la aplicación
│   ├── services/
│   │   ├── api/
│   │   │   ├── dataProvider.ts    # Fábrica de selección de proveedor (Mock vs Google Sheets)
│   │   │   ├── googleSheetsProvider.ts # Conexión HTTP con Apps Script
│   │   │   ├── mockDataProvider.ts    # Persistencia local reactiva
│   │   │   └── types.ts           # Interfaz abstracta IDataProvider
│   │   ├── attendanceService.ts   # Lógica de cálculo de asistencia y punch clock
│   │   ├── employeeService.ts    # Servicios de gestión de colaboradores
│   │   ├── incidentService.ts    # Gestión de novedades y permisos
│   │   ├── overtimeService.ts    # Gestión de horas extras
│   │   └── reportService.ts      # Generador de CSV y reportes
│   ├── types/
│   │   └── index.ts               # Definición completa de tipos e interfaces TypeScript
│   ├── utils/
│   │   └── attendanceRules.ts     # Reglas de negocio de tolerancias y tardanzas
│   ├── App.tsx                    # Enrutador principal
│   └── main.tsx                   # Entrada de React y PWA
└── package.json
```

---

## ⚙️ Instalación y Ejecución Local

### Prerrequisitos
- Node.js versión 18 o superior.
- Gestor de paquetes `npm`.

### Pasos de Inicio

1. **Instalar Dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar en Modo Desarrollo**:
   ```bash
   npm run dev
   ```
   La aplicación se abrirá en `http://localhost:3000`.

3. **Compilar para Producción**:
   ```bash
   npm run build
   ```

4. **Validar Tipos y Linter**:
   ```bash
   npm run lint
   ```

---

## 📊 Integración con Google Sheets & Google Apps Script

YORDEV CONTROL incluye un proveedor HTTP nativo para conectarse a Google Sheets como base de datos en la nube:

1. Crea una hoja de cálculo en **Google Sheets**.
2. Abre **Extensiones > Apps Script** y copia los archivos de la carpeta `/gas/` (`Code.gs`, `Config.gs`, etc.).
3. Haz clic en **Implementar > Nueva implementación** seleccionando tipo **Aplicación web**.
4. Configura el acceso para *"Cualquier usuario"* (*Anyone*).
5. Copia la URL del Web App generada (termina en `/exec`).
6. En la aplicación, dirígete a **Configuración (`/configuracion`)**, desactiva el modo demo e ingresa la URL de tu Google Apps Script.

---

## 🔒 Privacidad y Clasificación de Datos

La aplicación sigue el principio de **Mínimo Privilegio**:
- **PÚBLICO / INTERNO**: Nombre, departamento, sede, código y horario.
- **CONFIDENCIAL**: Cédula, dirección, teléfono personal, contacto de emergencia.
- **RESTRINGIDO**: Salarios, cuentas bancarias, motivos médicos de incapacidad.

---

## 📄 Licencia

Desarrollado para **YORDEV S.A.S.** — Plataforma de Control de Asistencia y Recursos Humanos. Todos los derechos reservados.
