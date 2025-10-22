# Aeternus AI

Aeternus es una plataforma de chat con IA diseñada para proporcionar conversaciones naturales y significativas, ofreciendo una experiencia única y personalizada.

## Características principales

- **Sistema de Onboarding Progresivo**: Guía a los usuarios paso a paso a través de las funcionalidades clave.
- **Sistema de Feedback para usuarios Alpha**: Permite a los usuarios compartir opiniones y reportar problemas.
- **Sistema de Manejo de Invitaciones**: Control completo para gestionar invitaciones a usuarios alpha.
- **Optimización de Chat**: Caché local para mejorar rendimiento y recuperación de conversaciones.
- **Panel de Administración**: Control de usuarios y conversaciones para administradores.

## Tecnologías utilizadas

- Next.js 14 con App Router
- Auth0 para autenticación
- Prisma ORM con PostgreSQL
- HeroUI para componentes de interfaz
- Neo4j para grafos de relaciones
- OpenAI API para la funcionalidad de chat

## Comenzando

### Prerrequisitos

- Node.js 18.x o superior
- PostgreSQL
- Neo4j (opcional para funcionalidades avanzadas)
- Cuenta de Auth0
- Clave API de OpenAI

### Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tuusuario/aeternus.git
   cd aeternus
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura las variables de entorno copiando el archivo `.env.example` a `.env.local` y completa las variables requeridas:

   ```bash
   cp .env.example .env.local
   ```

4. Ejecuta las migraciones de la base de datos:

   ```bash
   npx prisma migrate dev
   ```

5. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

6. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del proyecto

- `/src/app`: Rutas y páginas de la aplicación
- `/src/components`: Componentes reutilizables
- `/src/hooks`: Hooks personalizados
- `/src/lib`: Utilidades y configuraciones
- `/src/utils`: Funciones auxiliares
- `/prisma`: Esquema de base de datos y migraciones

## Características para usuarios Alpha

- Onboarding guiado paso a paso
- Sistema de feedback integrado
- Experiencia de chat optimizada
- Interfaz intuitiva y accesible

## Panel de administración

El panel de administración permite:

- Ver todas las conversaciones almacenadas
- Gestionar invitaciones para usuarios alpha
- Monitorear feedback de usuarios
- Configurar aspectos del sistema

## Contribuciones

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Fork el repositorio
2. Crea una rama para tu funcionalidad (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo términos privados. Todos los derechos reservados.
