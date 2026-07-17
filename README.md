# HR Buddy Agent 🤖

**Agente de RRHH en Telegram con RAG, Cohere y PostgreSQL — construido con n8n**

Desarrollado durante la **Inmersión de Agentes de IA — Alura Latam + Oracle ONE (2026)**

---

## ¿Qué hace?

HR Buddy es un agente conversacional desplegado en Telegram que permite a los empleados de una empresa consultar información de Recursos Humanos en tiempo real, sin intervención humana.

El agente:
- **Clasifica** automáticamente si la pregunta es de RRHH o está fuera de tema
- **Consulta datos reales** del empleado desde PostgreSQL usando su `telegram_id`
- **Responde con contexto personalizado** — cada empleado solo ve sus propios datos
- **Rechaza preguntas fuera de tema** con un mensaje claro y profesional

---

## Arquitectura

```
Telegram Trigger
      │
      ▼
Clasificador RRHH (Cohere LLM)
      │
      ▼
Switch: ¿Es RRHH?
   │              │
   ▼              ▼
Fuera de Tema   AI Agent (Cohere)
(Respuesta)         │
                ┌───┼───┐
                │   │   │
           Memory  RAG  PostgreSQL
                        (empleados)
                    │
                    ▼
            Send a text message
```

**Componentes:**
| Componente | Tecnología |
|---|---|
| Orquestador | n8n |
| Clasificador | Cohere (chainLlm) |
| Agente principal | Cohere Chat Model |
| Memoria conversacional | Simple Memory (Buffer Window) |
| Base de conocimiento | Vector Store In-Memory + Embeddings Cohere |
| Base de datos | PostgreSQL / Neon |
| Canal | Telegram Bot API |

---

## Flujo detallado

1. El usuario envía un mensaje al bot de Telegram
2. **Clasificador RRHH**: Cohere determina si la pregunta es de RRHH (SI/NO)
3. **Switch**: enruta según la clasificación
   - **Fuera de tema** → respuesta automática indicando que solo responde RRHH
   - **RRHH** → pasa al AI Agent
4. **AI Agent**:
   - Busca al empleado en PostgreSQL por su `telegram_id`
   - Si no está registrado → informa que contacte a RRHH
   - Si está registrado → responde con sus datos personales (vacaciones, banco de horas, modalidad, etc.)
   - Para políticas generales → consulta el Vector Store con RAG
5. La respuesta se envía de vuelta al usuario en Telegram

---

## Demostración

### Clasificación fuera de tema
El agente rechaza preguntas que no son de RRHH:
> Usuario: "¿qué día es hoy?"
> Bot: "🚫 Solo puedo responder preguntas relacionadas con Recursos Humanos de ChocolaTech."

### Consulta de datos personales
El agente identifica al empleado y responde con sus datos reales:
> Usuario: "¿cuántos días de vacaciones tengo?"
> Bot: "Tienes un saldo de 20 días de vacaciones disponibles. ¿Necesitas más información sobre cómo solicitarlas?"

### Empleado no registrado
> Usuario: "Soy Fausto Soto"
> Bot: "No estás registrado en el sistema de ChocolaTech. Contacta a RR.HH."

---

## Estructura del repositorio

```
hr-buddy-agent/
├── README.md
├── workflow/
│   └── HR_Buddy_Agent_workflow.json   # Workflow n8n (sanitizado)
└── assets/
    ├── flujo_n8n.png                  # Captura del flujo en n8n
    ├── demo_clasificacion.png         # Demo: rechazo fuera de tema
    ├── demo_consulta.png              # Demo: consulta de vacaciones
    └── certificado_inmersion.png      # Certificado Alura ONE
```

---

## Cómo usar el workflow

1. Importa `HR_Buddy_Agent_workflow.json` en tu instancia de n8n
2. Configura tus credenciales:
   - **Telegram Bot API**: crea un bot con @BotFather
   - **Cohere API**: obtén tu API key en [cohere.com](https://cohere.com)
   - **PostgreSQL**: crea tu base de datos en [neon.tech](https://neon.tech)
3. Crea la tabla `empleados` en PostgreSQL:

```sql
CREATE TABLE empleados (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  nombre VARCHAR(100),
  departamento VARCHAR(100),
  puesto VARCHAR(100),
  fecha_ingreso DATE,
  modalidad VARCHAR(50),
  saldo_vacaciones INT,
  banco_horas INT
);
```

4. Activa el workflow y prueba tu bot en Telegram

---

## Tecnologías

- [n8n](https://n8n.io) — automatización low-code
- [Cohere](https://cohere.com) — LLM para clasificación, chat y embeddings
- [PostgreSQL / Neon](https://neon.tech) — base de datos serverless
- [Telegram Bot API](https://core.telegram.org/bots/api)

---

## Autor

**Fausto Enrique Soto Euraque**
Data Scientist & Analista BI — Tegucigalpa, Honduras

[![LinkedIn](https://img.shields.io/badge/LinkedIn-fausto--soto-blue)](https://linkedin.com/in/fausto-soto)
[![GitHub](https://img.shields.io/badge/GitHub-fsotoeu--cyber-black)](https://github.com/fsotoeu-cyber/Hr-Buddy-agent-RRHH-n8n)

---

*Proyecto desarrollado durante la Inmersión de Agentes de IA — Alura Latam + Oracle ONE, mayo 2026.*
