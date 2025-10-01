# PPID Kabupaten Sorong - Portal Informasi Publik

## Overview

PPID Kabupaten Sorong is a public information portal for the Sorong Regency government in Papua Barat Daya, Indonesia. The application provides transparency and public access to government information through a modern web portal, complying with Indonesian law on public information disclosure (UU No. 14/2008). Citizens can submit information requests, track their status, browse public documents, read news, and contact government officials. The system features a culturally-respectful design incorporating Papua motifs while maintaining professional government standards.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**: React 18 with TypeScript, built using Vite as the bundler.

**UI Framework**: Shadcn/ui component library with Radix UI primitives, styled using Tailwind CSS with custom design tokens reflecting government branding (primary blue from Kabupaten Sorong logo, gold accents, Papua cultural colors).

**State Management**: TanStack Query (React Query) for server state management with client-side caching. No global state management library is used; component-local state via React hooks is sufficient for UI state.

**Routing**: Wouter for lightweight client-side routing. Routes include homepage, information request submission, tracking, public information browsing, news, profile, FAQ, and contact pages.

**Design System**: Custom design guidelines emphasizing cultural respect, professional authority, and accessibility. Uses Inter for UI text and Poppins for headings. Implements a dark-mode-first approach with Papua cultural accent colors (terracotta, ochre, brown) used sparingly.

**Accessibility**: Dedicated AccessibilityWidget component provides text sizing, contrast adjustment, dyslexia-friendly fonts, screen reader support, and other accessibility features.

### Backend Architecture

**Hybrid Approach**: The application uses a dual-backend architecture:

1. **Node.js/Express Server** (`server/`): Serves as the primary application server, handles static file serving, and acts as a reverse proxy to the FastAPI backend. This server integrates with Vite for hot-module reloading during development.

2. **Python/FastAPI Backend** (`backend/`): Handles all business logic, database operations, and API endpoints. Runs independently on port 8000 and is proxied through the Express server at `/api/*` routes.

**Rationale**: This architecture separates concerns—the Node server focuses on frontend delivery and development experience, while FastAPI handles data operations with Python's rich ecosystem. The proxy pattern provides a unified API surface to the frontend.

**API Structure**: RESTful API with route modules organized by domain:
- `auth.py`: User authentication and registration (JWT-based)
- `permohonan.py`: Information request submission and tracking
- `informasi_publik.py`: Public document management
- `berita.py`: News/announcements management
- `galeri.py`: Photo gallery management
- `faq.py`: Frequently asked questions management

**Authentication**: JWT (JSON Web Tokens) using the `python-jose` library. Tokens are issued on login and validated using HTTPBearer security scheme. Password hashing uses bcrypt via `passlib`.

### Data Storage

**Database**: PostgreSQL (configured via `DATABASE_URL` environment variable).

**ORM Choices**:
- **Frontend/Node Layer**: Drizzle ORM with Neon serverless driver for any Node-side database operations (minimal usage—mostly for potential session storage)
- **Backend/Python Layer**: SQLAlchemy ORM for all primary data operations

**Schema Management**: 
- Drizzle schema defined in `shared/schema.ts` for TypeScript type safety
- SQLAlchemy models defined in `backend/app/models.py` with enum types for status fields
- Both systems maintain separate migration paths due to dual-ORM architecture

**Key Tables**:
- `users`: Admin and operator accounts with role-based access
- `permohonan`: Information requests with status tracking (menunggu, diproses, selesai, ditolak)
- `informasi_publik`: Categorized public documents (berkala, serta_merta, setiap_saat)
- `berita`: News articles with slugs and view tracking
- `galeri`: Photo gallery items
- `faq`: Frequently asked questions with ordering

**File Storage**: Uploaded files (KTP scans, documents, images) are stored in `client/public/uploads/` with organized subfolders. File paths are stored as strings in the database.

### Authentication & Authorization

**User Roles**: Two-tier system—`admin` (full access) and `operator` (limited access). Role-based decorators (`get_current_admin_user`) restrict administrative endpoints.

**Session Management**: Stateless JWT approach with 7-day token expiration. The application initially included session storage infrastructure (connect-pg-simple) but primarily uses JWT for authentication.

**CORS**: Configured to allow all origins during development (`allow_origins=["*"]`). Should be restricted in production.

## External Dependencies

### Third-Party Services

**Neon Database**: Serverless PostgreSQL database accessed via `@neondatabase/serverless` driver. Requires `DATABASE_URL` environment variable with WebSocket support.

**Font Services**: Google Fonts CDN for Inter and Poppins typefaces.

### Key Libraries

**Frontend**:
- `@tanstack/react-query`: Server state management and caching
- `@radix-ui/*`: Accessible UI component primitives (40+ packages)
- `wouter`: Lightweight routing
- `react-hook-form` + `@hookform/resolvers` + `zod`: Form validation
- `date-fns`: Date formatting with Indonesian locale support
- `lucide-react`: Icon library
- `vaul`: Drawer component
- `embla-carousel-react`: Carousel functionality

**Backend**:
- `fastapi`: Modern Python web framework
- `sqlalchemy`: Database ORM
- `python-jose[cryptography]`: JWT implementation
- `passlib[bcrypt]`: Password hashing
- `uvicorn`: ASGI server
- `python-multipart`: File upload handling

**Development**:
- `vite`: Build tool and dev server
- `typescript`: Type safety
- `tailwindcss`: Utility-first CSS
- `drizzle-orm` + `drizzle-kit`: Node-side database toolkit
- `concurrently`: Run multiple processes simultaneously
- `@replit/*` plugins: Replit-specific development enhancements

### Environment Configuration

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string (WebSocket format for Neon)
- `SESSION_SECRET`: JWT signing key (defaults to insecure value—must be changed in production)
- `BACKEND_PORT`: FastAPI server port (defaults to 8000)
- `FASTAPI_URL`: FastAPI server URL for proxy (defaults to `http://localhost:8000`)

### Production Considerations

The `START_BACKEND.md` file provides deployment guidance:
- FastAPI should run via systemd/supervisor using `uvicorn app.main:app --host 0.0.0.0 --port 8000`
- Nginx should proxy `/api/` requests to the FastAPI backend
- Static assets should be served from `dist/public/`
- File uploads directory must be writable and backed up regularly