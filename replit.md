# ProductivityPro - Personal Productivity Platform

## Overview

ProductivityPro is a comprehensive offline-first Progressive Web App (PWA) built as a personal productivity platform. The application is designed to work 100% offline with modern PWA capabilities, featuring task management, calendar integration, goal tracking, reminders, and analytics. It follows a modular architecture with TypeScript, React, and IndexedDB for local data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: Zustand with subscriptions for real-time updates across components
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack Query for server state management and caching

### Backend Architecture
- **Server**: Express.js with TypeScript for API endpoints
- **Development**: Vite integration for hot module replacement in development
- **Storage Interface**: Abstract storage interface with in-memory implementation (can be extended to database)
- **Session Management**: Express sessions with PostgreSQL store support

### PWA Features
- **Service Worker**: Custom service worker with cache-first strategy for offline functionality
- **Manifest**: Complete PWA manifest with icons and display settings
- **Offline Storage**: IndexedDB via Dexie.js for structured local data persistence
- **Installation**: Installable as native app on supported platforms

## Key Components

### Data Layer
- **Database**: Dexie.js wrapper around IndexedDB for local storage
- **Schema**: Comprehensive schema definitions with Zod validation
- **Entities**: Projects, Tasks, Goals, Reminders, Settings, and Analytics data
- **Relationships**: Task hierarchies, project associations, goal milestones

### State Management
- **Store Structure**: Modular Zustand stores for different domains (tasks, projects, goals, reminders, settings)
- **Real-time Updates**: Cross-store subscriptions for automatic UI updates
- **Computed Values**: Derived state for filtered lists, statistics, and aggregations

### UI Components
- **Layout**: Responsive app shell with sidebar navigation and top bar
- **Theme System**: Light/dark mode with system preference detection
- **Internationalization**: Multi-language support with react-i18next
- **Accessibility**: ARIA compliance and keyboard navigation support

### Feature Modules
- **Tasks**: Complete task management with projects, priorities, due dates, and subtasks
- **Calendar**: Interactive calendar view with task scheduling capabilities
- **Goals**: Long-term goal tracking with milestones and habit tracking
- **Reminders**: Time-based notifications and recurring reminders
- **Analytics**: Productivity insights and pattern visualization
- **Settings**: Theme, language, and data management preferences

## Data Flow

1. **User Interaction**: User actions trigger state updates through Zustand actions
2. **State Management**: Store actions update local state and persist to IndexedDB
3. **UI Updates**: React components re-render automatically based on state changes
4. **Offline Sync**: Changes are queued and synced when connectivity returns
5. **Cross-component Updates**: Subscriptions ensure related components update in real-time

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 18, React Router (Wouter), React Hook Form
- **State & Data**: Zustand, TanStack Query, Dexie.js for IndexedDB
- **UI & Styling**: Radix UI, Tailwind CSS, Lucide React icons
- **Utilities**: date-fns, clsx, class-variance-authority

### Development Dependencies
- **Build Tools**: Vite, esbuild, TypeScript
- **Database**: Drizzle ORM with PostgreSQL support for future server integration
- **PWA**: Custom service worker implementation
- **Localization**: i18next, react-i18next with language detection

### Optional Integrations
- **Analytics**: Built-in productivity analytics without external services
- **Notifications**: Web Notifications API for reminders
- **Export/Import**: JSON-based data portability

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: In-memory storage with option to connect PostgreSQL
- **Service Worker**: Development-optimized caching strategy

### Production Build
- **Client**: Vite production build with code splitting and optimization
- **Server**: esbuild bundling for Express.js backend
- **Assets**: Static asset optimization and PWA manifest generation
- **Caching**: Service worker with cache-first offline strategy

### Deployment Options
- **Static Hosting**: Can be deployed as static site with service worker
- **Full-stack**: Express.js backend with PostgreSQL for multi-user scenarios
- **Progressive Enhancement**: Works offline-first, enhanced with server features

### Performance Considerations
- **Bundle Splitting**: Lazy loading of feature modules
- **Cache Strategy**: Aggressive caching for offline functionality
- **Database Optimization**: Efficient IndexedDB queries and indexes
- **Memory Management**: Proper cleanup of subscriptions and event listeners

The application is designed to be modular, scalable, and maintainable while providing a professional-grade productivity experience that works reliably offline.