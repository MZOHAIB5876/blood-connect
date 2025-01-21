# Blood Connect - Technical Documentation

## Project Overview
Blood Connect is a web application that connects blood donors with recipients in real-time. Built with modern web technologies, it provides a seamless platform for blood donation management.

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** with ShadcnUI for styling
- **React Router** for navigation
- **React Query** for data fetching
- **Sonner** for toast notifications
- **Lucide React** for icons
- **React Leaflet** for maps integration

### Backend
- **Supabase** for:
  - Authentication
  - Database
  - Real-time updates
  - Row Level Security (RLS)

### Development Tools
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Vercel** for deployment

## Project Structure
```
blood-connect/
├── src/
│   ├── components/
│   │   ├── auth/          # Authentication components
│   │   ├── ui/            # Reusable UI components
│   │   ├── RequestForm.tsx
│   │   └── RequestList.tsx
│   ├── context/
│   │   ├── auth/          # Auth context providers
│   │   └── RequestContext.tsx
│   ├── types/
│   │   └── blood.ts       # TypeScript interfaces
│   ├── lib/
│   │   └── utils.ts       # Utility functions
│   └── App.tsx
├── supabase/
│   └── migrations/        # Database migrations
└── public/
```

## Database Schema

### Blood Requests Table
```sql
CREATE TABLE blood_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    blood_type VARCHAR NOT NULL,
    location VARCHAR NOT NULL,
    coordinates VARCHAR,
    contact_number VARCHAR NOT NULL,
    cnic_id VARCHAR NOT NULL,
    type VARCHAR NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'active',
    user_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Authentication Flow
1. User signs up/logs in using Supabase Auth
2. JWT token is stored in local storage
3. AuthProvider maintains user session
4. Protected routes check auth status

## Data Flow
1. User submits blood request
2. Request is validated client-side
3. Data is sent to Supabase
4. Real-time updates trigger UI refresh
5. Row Level Security ensures data privacy

## Deployment
- Frontend deployed on Vercel
- Database hosted on Supabase
- Environment variables managed through Vercel

## Security Features
1. Row Level Security (RLS) policies
2. JWT-based authentication
3. Input validation
4. CORS protection
5. Environment variable protection

## Performance Optimizations
1. Code splitting
2. Lazy loading
3. Image optimization
4. Caching strategies
5. Debounced API calls

## Error Handling
1. Form validation
2. API error handling
3. Toast notifications
4. Fallback UI components
5. Error boundaries

## Future Improvements
1. PWA support
2. Push notifications
3. Offline support
4. Analytics integration
5. Social sharing features
