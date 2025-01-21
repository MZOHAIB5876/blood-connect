# Blood Connect - Detailed Code Documentation

## Table of Contents
1. [Project Structure](#project-structure)
2. [Component Breakdown](#component-breakdown)
3. [Authentication System](#authentication-system)
4. [Database Integration](#database-integration)
5. [UI Components](#ui-components)
6. [State Management](#state-management)
7. [Utility Functions](#utility-functions)

## Project Structure

### Root Directory
```
blood-connect/
├── src/               # Source code
├── public/            # Static assets
├── docs/             # Documentation
└── supabase/         # Database migrations
```

### Source Directory (`src/`)
```
src/
├── components/       # React components
├── context/         # Context providers
├── hooks/           # Custom hooks
├── lib/             # Utility functions
├── types/           # TypeScript types
└── App.tsx          # Root component
```

## Component Breakdown

### RequestForm Component
Location: `src/components/RequestForm.tsx`

```typescript
interface FormData {
  name: string;
  bloodType: BloodType;
  location: string;
  coordinates: string;
  contactNumber: string;
  cnicId: string;
  type: 'donor' | 'receiver';
}
```

#### Key Functions:

1. `handleSubmit`:
   ```typescript
   const handleSubmit = async (event: React.FormEvent) => {
     event.preventDefault();
     // Prevents default form submission
     
     if (!user) {
       toast.error('You must be logged in');
       return;
     }
     // Validates user authentication
     
     const newRequest = {
       name: formData.name,
       blood_type: formData.bloodType,
       // ... other fields
     };
     // Creates request object
   }
   ```
   - Purpose: Handles form submission
   - Validation: Checks all required fields
   - Error Handling: Shows toast messages

2. `handleLocationSelect`:
   ```typescript
   const handleLocationSelect = (latlng: LatLng) => {
     setMapPosition(latlng);
     setFormData(prev => ({
       ...prev,
       coordinates: `${latlng.lat},${latlng.lng}`
     }));
   }
   ```
   - Purpose: Updates map coordinates
   - Input: Takes LatLng object
   - State Update: Updates form data

#### UI Elements:

1. Form Container:
   ```tsx
   <form onSubmit={handleSubmit} className="space-y-6">
   ```
   - Class: `space-y-6` adds vertical spacing
   - Event: Triggers handleSubmit

2. Input Fields:
   ```tsx
   <Input
     type="text"
     value={formData.name}
     onChange={(e) => handleInputChange('name', e.target.value)}
     className="bg-white/50 dark:bg-gray-900/50"
   />
   ```
   - Props: Controlled input
   - Styling: Transparent background
   - Event: Updates form state

### RequestList Component
Location: `src/components/RequestList.tsx`

#### Key Features:

1. Request Filtering:
   ```typescript
   const filteredRequests = requests
     .filter(request => request.type === type)
     .sort((a, b) => {
       return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
     });
   ```
   - Purpose: Filters and sorts requests
   - Sort Order: Newest first
   - Type Check: Matches donor/receiver

2. Request Card:
   ```tsx
   <Card className="w-full mb-4 overflow-hidden">
     <CardHeader>
       <CardTitle>{request.name}</CardTitle>
       <div className="blood-type">{request.blood_type}</div>
     </CardHeader>
   </Card>
   ```
   - Layout: Full width card
   - Content: Shows request details
   - Styling: Shadcn UI components

## Authentication System

### AuthProvider Component
Location: `src/components/auth/AuthProvider.tsx`

```typescript
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
```

#### Key Functions:

1. `signIn`:
   ```typescript
   const signIn = async (email: string, password: string) => {
     const { data, error } = await supabase.auth.signInWithPassword({
       email,
       password
     });
     
     if (error) throw error;
     return data;
   }
   ```
   - Purpose: Handles user login
   - Error Handling: Throws auth errors
   - Return: User session data

2. `signOut`:
   ```typescript
   const signOut = async () => {
     const { error } = await supabase.auth.signOut();
     if (error) throw error;
   }
   ```
   - Purpose: Handles user logout
   - Cleanup: Clears session
   - Error Handling: Throws errors

## Database Integration

### Supabase Client
Location: `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### Database Schema

```sql
CREATE TABLE blood_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    blood_type VARCHAR NOT NULL CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    location VARCHAR NOT NULL,
    coordinates VARCHAR,
    contact_number VARCHAR NOT NULL,
    cnic_id VARCHAR NOT NULL,
    type VARCHAR NOT NULL CHECK (type IN ('donor', 'receiver')),
    status VARCHAR NOT NULL DEFAULT 'active',
    user_id UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Field Explanations:
- `id`: Unique identifier
- `blood_type`: Blood type with validation
- `coordinates`: Optional map coordinates
- `user_id`: Foreign key to auth.users
- `status`: Request status tracking

## UI Components

### Button Component
Location: `src/components/ui/button.tsx`

```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary"
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
```

#### Variant Explanations:
- `default`: Primary action button
- `destructive`: Dangerous actions
- `outline`: Secondary actions
- `ghost`: Subtle actions
- `link`: Text-like button

### Card Component
Location: `src/components/ui/card.tsx`

```typescript
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
```

#### Styling Classes:
- `rounded-lg`: Rounded corners
- `border`: Card border
- `shadow-sm`: Subtle shadow
- `bg-card`: Background color

## State Management

### RequestContext
Location: `src/context/RequestContext.tsx`

```typescript
interface RequestContextType {
  requests: BloodRequest[];
  addRequest: (request: Omit<BloodRequest, 'id'>) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  fetchRequests: () => Promise<void>;
}
```

#### Key Methods:

1. `addRequest`:
   ```typescript
   const addRequest = async (newRequest: Omit<BloodRequest, 'id'>) => {
     const { data, error } = await supabase
       .from('blood_requests')
       .insert([newRequest])
       .select();
       
     if (error) throw error;
     setRequests(prev => [data[0], ...prev]);
   }
   ```
   - Purpose: Adds new request
   - Updates: Local state
   - Error: Throws database errors

2. `fetchRequests`:
   ```typescript
   const fetchRequests = async () => {
     const { data, error } = await supabase
       .from('blood_requests')
       .select('*')
       .order('created_at', { ascending: false });
       
     if (error) throw error;
     setRequests(data);
   }
   ```
   - Purpose: Fetches all requests
   - Sort: Latest first
   - Updates: Local state

## Utility Functions

### Date Formatting
Location: `src/lib/utils.ts`

```typescript
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(date));
}
```

### Class Names Utility
```typescript
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```
- Purpose: Merges Tailwind classes
- Input: Multiple class strings
- Output: Optimized class string

## Error Handling

### Toast Notifications
```typescript
import { toast } from 'sonner';

// Success toast
toast.success('Request created successfully');

// Error toast
toast.error('Failed to create request');

// Loading toast
toast.loading('Processing request...');
```

### Error Boundaries
```tsx
<ErrorBoundary fallback={<ErrorPage />}>
  <App />
</ErrorBoundary>
```

## Map Integration

### Leaflet Setup
```typescript
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

<MapContainer
  center={defaultPosition}
  zoom={13}
  className="h-[300px] rounded-md"
>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; OpenStreetMap contributors'
  />
  {position && <Marker position={position} />}
</MapContainer>
```

## Deployment

### Vercel Configuration
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "environmentVariables": [
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_ANON_KEY"
  ]
}
```

This documentation provides a comprehensive breakdown of every component, function, and feature in the Blood Connect application. Each section includes detailed explanations of the code's purpose, implementation, and usage.
