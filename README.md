# NutriGenAI - Asistente de Nutrigenómica

Un chatbot especializado en nutrigenómica, suplementos nutricionales, vitaminas y alimentos funcionales, implementado con React y la API de Groq para generar respuestas basadas en evidencia científica.

## Características

- Interfaz de chat moderna y responsiva
- Especialización en nutrigenómica y medicina nutricional personalizada
- Información sobre suplementos basada en evidencia científica
- Recomendaciones sobre alimentos funcionales
- Explicaciones sobre interacciones entre nutrientes y genética
- Desplegable en Vercel con mínima configuración

## Tecnologías utilizadas

- **Frontend**: React, TailwindCSS, shadcn/ui
- **Backend**: Vercel Serverless Functions
- **API**: Groq LLM API (usando llama3-70b)
- **Despliegue**: Configurado para Vercel

## Configuración para desarrollo

1. Clona este repositorio
2. Instala las dependencias: `npm install`
3. Crea un archivo `.env` basándote en `.env.example` y añade tu clave API de Groq
4. Ejecuta el proyecto: `npm run dev`

## Configuración para producción (Vercel)

1. Despliega el repositorio en Vercel
2. Configura la variable de entorno `GROQ_API_KEY` en la configuración de Vercel
3. El chatbot estará disponible en tu URL de Vercel

## Especialización en Nutrigenómica

Este chatbot ha sido especializado para proporcionar información sobre:

- Cómo los alimentos afectan la expresión genética (nutrigenómica)
- Suplementos nutricionales y su eficacia según estudios científicos
- Alimentos funcionales y sus beneficios para la salud
- Recomendaciones personalizadas basadas en perfiles genéticos
- Interacciones entre nutrientes, medicamentos y genética
- Vitaminas, minerales y su impacto en las vías metabólicas
- Últimos avances en nutrición personalizada y medicina de precisión

## Estructura del proyecto

```
├── api/ - Funciones serverless para Vercel
├── client/ - Frontend React
│   ├── src/
│   │   ├── components/ - Componentes de UI
│   │   ├── hooks/ - Custom React hooks
│   │   ├── lib/ - Utilidades y servicios
│   │   ├── pages/ - Páginas principales
│   │   └── types/ - Definiciones de tipos TypeScript
```

## Uso en consultas de nutrición

NutriGenAI puede ser utilizado por nutricionistas y profesionales de la salud como herramienta de apoyo para:

1. Investigar las últimas tendencias en nutrición personalizada
2. Obtener información sobre interacciones entre suplementos
3. Explorar opciones de alimentos funcionales para condiciones específicas
4. Entender mejor la relación entre genética y nutrición

**Nota importante**: Este chatbot proporciona información con fines educativos. No sustituye el consejo médico o nutricional profesional.

## Licencia

MIT