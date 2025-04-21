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
3. Crea un archivo `.env` basándote en `.env.example` y añade tu clave API de Groq
4. Ejecuta el proyecto: `npm run dev`

## Configuración para producción (Vercel)

1. Despliega el repositorio en Vercel
2. Configura la variable de entorno `GROQ_API_KEY` en la configuración de Vercel
3. El backend estará disponible en tu URL de Vercel

### Solución de problemas en Vercel

Si encuentras problemas al desplegar en Vercel, asegúrate de:

1. Verificar que la variable de entorno `GROQ_API_KEY` está correctamente configurada
2. Usar Node.js 18.x o superior en la configuración de Vercel
3. Revisar los logs de despliegue para detectar errores específicos

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
├── server/ - Backend Express
│   ├── index.ts - Punto de entrada del servidor
│   ├── routes.ts - Definición de rutas API
│   ├── storage.ts - Implementación de almacenamiento
│   └── vite.ts - Configuración de Vite para desarrollo
└── shared/ - Código compartido entre cliente y servidor
    └── schema.ts - Esquema de datos y validación
```

## Integración con Framer Desktop

Puedes integrar este chatbot en tu sitio de Framer Desktop de varias maneras:

1. **Usando un iframe**: Inserta la URL de tu aplicación desplegada en un componente iframe de Framer
2. **Usando la API backend**: Configura el frontend para que se comunique con la API desplegada en Vercel

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir cambios importantes antes de enviar un pull request.

## Licencia

MIT