# 🚀 Antigravity API

API REST profesional para **Google Antigravity** - Cliente Node.js/Express para modelos Gemini y Claude. Diseñada para integrar en aplicaciones SaaS con Firebase y Google Cloud.

## 📋 Características

- ✅ API REST completa con Express.js
- ✅ Soporte para múltiples modelos de IA (Gemini, Claude)
- ✅ Configuración flexible con variables de entorno
- ✅ Health check endpoint
- ✅ Manejo robusto de errores
- ✅ CORS habilitado
- ✅ Lista de modelos disponibles
- ✅ Lista para producción con Docker y Cloud Run

## 🔧 Requisitos

- Node.js 18+
- npm o yarn
- Proyecto Google Cloud habilitado
- OAuth2 Access Token (desde Firebase Auth o gcloud)

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Marian-32/antigravity-api.git
cd antigravity-api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia `.env.example` a `.env` y configura tus credenciales:

```bash
cp .env.example .env
```

Edita `.env`:

```env
PORT=3000
GCP_PROJECT_ID=tu-proyecto-gcp
ACCESS_TOKEN=tu-token-oauth2
DEFAULT_MODEL=gemini-3-pro-high
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

La API estará disponible en `http://localhost:3000`

## 🌐 Endpoints

### Health Check

```http
GET /
```

Respuesta:
```json
{
  "status": "ok",
  "service": "Antigravity API",
  "version": "1.0.0",
  "endpoints": {
    "generate": "POST /api/generate"
  }
}
```

### Generar contenido

```http
POST /api/generate
Content-Type: application/json
```

Body:
```json
{
  "prompt": "Genera código React para un dashboard SaaS",
  "projectId": "tu-proyecto-gcp",
  "accessToken": "tu-oauth-token",
  "model": "claude-sonnet-4-5",
  "systemPrompt": "Eres un experto en React",
  "maxTokens": 2000,
  "temperature": 0.7
}
```

Respuesta:
```json
{
  "success": true,
  "content": "// Código generado...",
  "model": "claude-sonnet-4-5",
  "timestamp": "2026-02-01T15:30:00.000Z"
}
```

### Listar modelos disponibles

```http
GET /api/models
```

Respuesta:
```json
{
  "success": true,
  "models": [
    {
      "id": "gemini-3-pro-high",
      "name": "Gemini 3 Pro",
      "description": "Modelo rápido para código general",
      "provider": "Google"
    },
    {
      "id": "claude-sonnet-4-5",
      "name": "Claude Sonnet 4.5",
      "description": "Razonamiento complejo y análisis",
      "provider": "Anthropic"
    }
  ]
}
```

## 🔐 Autenticación

### Obtener Access Token

**Desde gcloud CLI:**
```bash
gcloud auth print-access-token
```

**Desde Firebase (JavaScript):**
```javascript
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const token = await auth.currentUser.getIdToken();
```

## 🐳 Docker y Cloud Run

### Build local

```bash
docker build -t antigravity-api .
docker run -p 3000:3000 --env-file .env antigravity-api
```

### Deploy a Cloud Run

```bash
gcloud run deploy antigravity-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 💡 Ejemplo de uso en SaaS

```javascript
// Frontend con fetch
const response = await fetch('https://tu-api.run.app/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'gemini-3-pro-high',
    prompt: 'Genera una función para validar emails',
    projectId: process.env.NEXT_PUBLIC_GCP_PROJECT,
    accessToken: await getFirebaseToken()
  })
});

const data = await response.json();
console.log(data.content);
```

## 📊 Modelos disponibles

| Modelo | ID | Uso ideal |
|--------|-----|-----------|
| Gemini 3 Pro | `gemini-3-pro-high` | Código rápido, tareas generales |
| Claude Sonnet 4.5 | `claude-sonnet-4-5` | Razonamiento complejo, análisis |
| Claude Thinking | `claude-sonnet-4-5-thinking` | Tareas largas con thinking budget |

## 🛠 Scripts disponibles

```bash
npm start       # Producción
npm run dev     # Desarrollo con nodemon
```

## 📝 Licencia

MIT

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor abre un issue o pull request.

## 👤 Autor

**Marian-32**

- GitHub: [@Marian-32](https://github.com/Marian-32)

---

⭐ Si este proyecto te fue útil, dale una estrella en GitHub!
