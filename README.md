# Chatbot con Groq API

Un chatbot implementado con React y Express que utiliza la API de Groq para generar respuestas inteligentes.

## Características

- Interfaz de chat moderna y responsiva
- Integración con la API de Groq para respuestas IA
- Backend con Express listo para despliegue en Vercel
- Frontend fácilmente integrable con Framer Desktop
- Soporte para múltiples idiomas

## Tecnologías utilizadas

- **Frontend**: React, TailwindCSS, shadcn/ui
- **Backend**: Express, Node.js
- **API**: Groq API para IA generativa
- **Despliegue**: Configurado para Vercel

## Configuración para desarrollo

1. Clona este repositorio
2. Instala las dependencias: `npm install`
3. Configura la variable de entorno `GROQ_API_KEY` con tu clave API de Groq
4. Ejecuta el proyecto: `npm run dev`

## Configuración para producción (Vercel)

1. Despliega el repositorio en Vercel
2. Configura la variable de entorno `GROQ_API_KEY` en Vercel
3. El backend estará disponible en tu URL de Vercel

## Integración con Framer Desktop

Puedes integrar este chatbot en tu sitio de Framer Desktop de varias maneras:

1. **Usando un iframe**: Inserta la URL de tu aplicación desplegada en un componente iframe de Framer
2. **Usando la API backend**: Configura el frontend para que se comunique con la API desplegada en Vercel

## Licencia

MIT