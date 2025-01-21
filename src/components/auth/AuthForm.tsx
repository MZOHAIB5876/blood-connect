import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Droplet } from 'lucide-react';
import AnimatedBackground from '../AnimatedBackground';

type AuthMode = 'login' | 'signup';

export function AuthForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
            },
          },
        });

        if (error) throw error;
        toast.success('Check your email to verify your account!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          toast.error('Invalid login credentials');
          throw error;
        }
        
        toast.success('Successfully signed in!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-background/95">
      <AnimatedBackground />
      <div className="max-w-md w-full mx-auto space-y-6 bg-card/50 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-border/50">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-gradient-to-r from-rose-600 to-rose-700 p-2 rounded-lg">
              <Droplet className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Blood Connect</h1>
          </div>
          <h2 className="text-xl font-semibold">
            {mode === 'login' ? 'Welcome Back!' : 'Create an Account'}
          </h2>
          <p className="text-muted-foreground">
            {mode === 'login'
              ? 'Enter your details to sign in'
              : 'Fill in your information to get started'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {mode === 'signup' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-rose-700 dark:text-rose-300">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-black/80 border-rose-300/20 focus:border-rose-500 hover:border-rose-400 transition-all duration-200 rounded-md w-full placeholder:text-gray-500 text-white"
                    required={mode === 'signup'}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-rose-700 dark:text-rose-300">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-black/80 border-rose-300/20 focus:border-rose-500 hover:border-rose-400 transition-all duration-200 rounded-md w-full placeholder:text-gray-500 text-white"
              required
            />
          </div>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="bg-black/80 border-rose-300/20 focus:border-rose-500 hover:border-rose-400 transition-all duration-200 rounded-md w-full placeholder:text-gray-500 text-white"
              required
            />
            <Button
              onClick={togglePasswordVisibility}
              type="button"
              variant="ghost"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-0 h-auto text-rose-300 hover:text-rose-400"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'signup' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="space-y-2 relative">
                  <Label htmlFor="confirmPassword" className="text-rose-700 dark:text-rose-300">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="bg-black/80 border-rose-300/20 focus:border-rose-500 hover:border-rose-400 transition-all duration-200 rounded-md w-full placeholder:text-gray-500 text-white"
                    required={mode === 'signup'}
                  />
                  <Button
                    onClick={togglePasswordVisibility}
                    type="button"
                    variant="ghost"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-0 h-auto text-rose-300 hover:text-rose-400"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                {mode === 'signup' ? 'Signing up...' : 'Signing in...'}
              </div>
            ) : (
              <>{mode === 'signup' ? 'Sign up' : 'Sign in'}</>
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
        >
          {mode === 'login'
            ? "Don't have an account? Sign up"
            : 'Already have an account? Sign in'}
        </Button>
      </div>
    </div>
  );
}
