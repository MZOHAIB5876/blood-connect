import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequestForm from './components/RequestForm';
import RequestList from './components/RequestList';
import { AuthProvider } from './components/auth/AuthProvider';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuth } from './components/auth/AuthProvider';
import { Button } from './components/ui/button';
import { supabase } from './integrations/supabase/client';
import { RequestProvider, useRequests } from './context/RequestContext';
import { Droplet, LogOut, Heart, User, Settings, Mail, Activity, Sun, Moon } from 'lucide-react';
import AnimatedBackground from "./components/AnimatedBackground";
import { AuthForm } from './components/auth/AuthForm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeProvider, useTheme } from './components/theme/theme-provider';
import { ThemeToggle } from './components/theme/theme-toggle';

function AppContent() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showContactModal, setShowContactModal] = useState(false);
  const { requests } = useRequests();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleContactUs = () => {
    setShowContactModal(true);
  };

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen bg-transparent">
        <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 shadow-sm py-2 px-3 sticky top-0 z-50">
          <div className="container mx-auto">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 group cursor-pointer">
                <div className="bg-gradient-to-r from-rose-600 to-rose-700 p-1.5 rounded-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-3deg] hover:shadow-lg hover:shadow-rose-500/20">
                  <Droplet className="w-5 h-5 text-white transform transition-transform duration-300 group-hover:rotate-12" />
                </div>
                <div className="transform transition-all duration-300 group-hover:translate-x-1">
                  <h1 className="text-lg font-bold tracking-wide bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent relative uppercase">
                    BLOOD CONNECT
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-rose-600 transition-all duration-300 group-hover:w-full"></span>
                  </h1>
                  <p className="text-xs text-muted-foreground transition-colors duration-300 group-hover:text-rose-500">
                    Connecting Lives Through Blood Donation
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Stats with hover effects */}
                <div className="hidden md:flex items-center gap-3 pr-4 border-r border-border/50">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-300 hover:bg-background/80 hover:shadow-sm">
                    <div className="p-1 rounded-full bg-rose-500/10 text-rose-500 transform transition-transform duration-300 group-hover:scale-110">
                      <Heart className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block text-xs font-medium text-foreground">
                        {requests.filter(r => r.type === 'donor').length}
                      </span>
                      <span className="text-[10px] text-muted-foreground">Donors</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-300 hover:bg-background/80 hover:shadow-sm">
                    <div className="p-1 rounded-full bg-blue-500/10 text-blue-500 transform transition-transform duration-300 group-hover:scale-110">
                      <Droplet className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block text-xs font-medium text-foreground">
                        {requests.filter(r => r.type === 'receiver').length}
                      </span>
                      <span className="text-[10px] text-muted-foreground">Receivers</span>
                    </div>
                  </div>
                </div>

                {/* Theme Toggle */}
                <div className="relative w-16 h-8 p-1 rounded-full bg-background/90 border border-border/50 cursor-pointer shadow-inner hover:shadow-lg transition-shadow duration-300"
                     onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                  {/* Background gradients */}
                  <div className="absolute inset-0 rounded-full transition-opacity duration-300 ease-in-out bg-gradient-to-r from-amber-100 to-yellow-100 dark:opacity-0" />
                  <div className="absolute inset-0 rounded-full transition-opacity duration-300 ease-in-out bg-gradient-to-r from-indigo-900 to-purple-900 opacity-0 dark:opacity-100" />
                  
                  {/* Sliding button */}
                  <div className={`absolute w-6 h-6 rounded-full bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${theme === 'dark' ? 'translate-x-8' : 'translate-x-0'} flex items-center justify-center hover:scale-105`}>
                    <div className="relative w-full h-full">
                      {/* Sun icon */}
                      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${theme === 'dark' ? 'opacity-0' : 'opacity-100'}`}>
                        <Sun className="w-4 h-4 text-amber-500" />
                      </div>
                      {/* Moon icon */}
                      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`}>
                        <Moon className="w-4 h-4 text-indigo-400" />
                      </div>
                    </div>
                  </div>

                  {/* Static icons for visual reference */}
                  <div className="absolute inset-y-0 left-0 flex items-center justify-center w-8 opacity-30">
                    <Sun className="w-3 h-3 text-amber-500" />
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center justify-center w-8 opacity-30">
                    <Moon className="w-3 h-3 text-indigo-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Bar */}
        <div className="bg-background/50 backdrop-blur-sm border-b border-border/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-6 py-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-rose-500/10 text-rose-500">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-medium text-foreground">
                    {requests.filter(r => r.type === 'donor').length}
                  </span>
                  <span className="text-sm text-muted-foreground">Donors</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-blue-500/10 text-blue-500">
                  <Droplet className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-medium text-foreground">
                    {requests.filter(r => r.type === 'receiver').length}
                  </span>
                  <span className="text-sm text-muted-foreground">Receivers</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-500">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-medium text-foreground">
                    {requests.filter(r => new Date(r.created_at) > new Date(Date.now() - 24*60*60*1000)).length}
                  </span>
                  <span className="text-sm text-muted-foreground">Active</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="border-t border-border/50 py-2 flex justify-center gap-4">
              <Button 
                variant="outline" 
                className="text-muted-foreground hover:text-foreground"
                onClick={handleContactUs}
              >
                <Mail className="w-3 h-3 mr-2" />
                Contact Us
              </Button>
              <Button 
                variant="outline"
                className="text-muted-foreground hover:text-foreground"
                onClick={handleSignOut}
              >
                <LogOut className="w-3 h-3 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-full max-w-md m-3">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Contact Us</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowContactModal(false)}
                  className="h-5 w-5"
                >
                  ×
                </Button>
              </div>
              <div className="space-y-3">
                <p className="text-gray-600 dark:text-gray-400">
                  Have questions or need assistance? Feel free to reach out to us:
                </p>
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                    <a href="mailto:dgzohaib444@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                      dgzohaib444@gmail.com
                    </a>
                  </p>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowContactModal(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <main className="container mx-auto py-6 px-4 space-y-6">
          <RequestForm />

          {/* Request Lists Section */}
          <div className="w-full max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-6">
              <div className="donor-list w-full space-y-3 p-3 sm:p-4 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:bg-gradient-to-br from-emerald-900/10 to-teal-900/10 rounded-xl shadow-sm border border-emerald-100/30 dark:border-emerald-800/30 backdrop-blur-sm">
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                  Available Donors
                </h2>
                <div className="overflow-hidden">
                  <RequestList type="donor" />
                </div>
              </div>

              <div className="receiver-list w-full space-y-3 p-3 sm:p-4 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:bg-gradient-to-br from-blue-900/10 to-indigo-900/10 rounded-xl shadow-sm border border-blue-100/30 dark:border-blue-800/30 backdrop-blur-sm">
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  <Droplet className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  Blood Requests
                </h2>
                <div className="overflow-hidden">
                  <RequestList type="receiver" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

function App() {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="reddrop-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RequestProvider>
            <TooltipProvider>
              <BrowserRouter>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <AppContent />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/auth" element={<AuthForm />} />
                </Routes>
              </BrowserRouter>
              <Toaster />
            </TooltipProvider>
          </RequestProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
