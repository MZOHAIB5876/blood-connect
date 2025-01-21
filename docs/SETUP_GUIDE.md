# Blood Connect - Setup Guide

## Prerequisites

### Required Software
1. Node.js (v18 or higher)
2. npm or yarn
3. Git
4. VS Code (recommended)

### Accounts Needed
1. GitHub account
2. Supabase account
3. Vercel account

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/MZOHAIB5876/blood-connect.git
cd blood-connect
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup

1. Create Supabase Project:
   - Go to supabase.com
   - Create new project
   - Get project credentials

2. Run Migrations:
   - Go to SQL Editor
   - Copy content from `supabase/migrations/20240121_create_blood_requests.sql`
   - Run the SQL commands

### 5. Development
```bash
npm run dev
# or
yarn dev
```

### 6. Build for Production
```bash
npm run build
# or
yarn build
```

## Deployment

### Vercel Deployment
1. Connect GitHub repository
2. Configure environment variables
3. Deploy project

### Manual Deployment
```bash
vercel deploy --prod
```

## Common Issues & Solutions

### 1. Build Errors
- Check Node.js version
- Clear npm cache
- Remove node_modules and reinstall

### 2. Database Connection
- Verify environment variables
- Check Supabase console
- Enable required APIs

### 3. Authentication Issues
- Check Supabase settings
- Verify JWT configuration
- Clear browser cache

## Development Guidelines

### Code Style
- Use TypeScript
- Follow ESLint rules
- Use Prettier formatting
- Write meaningful commits

### Git Workflow
1. Create feature branch
2. Make changes
3. Run tests
4. Create pull request
5. Request review

### Testing
```bash
npm run test
# or
yarn test
```

## Monitoring & Maintenance

### Performance Monitoring
1. Vercel Analytics
2. Supabase Dashboard
3. Error tracking

### Regular Updates
1. Dependency updates
2. Security patches
3. Feature enhancements

## Support Resources

### Documentation
- [React Docs](https://react.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)

### Community
- GitHub Issues
- Discord Server
- Stack Overflow

## Security Best Practices

### 1. Environment Variables
- Never commit .env files
- Use separate keys for dev/prod
- Rotate keys regularly

### 2. Authentication
- Use Supabase Auth
- Implement proper logout
- Set secure session timeouts

### 3. Data Protection
- Enable RLS policies
- Validate all inputs
- Sanitize user data
