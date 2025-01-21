import React, { createContext, useContext, useState, useEffect } from 'react';
import { BloodRequest } from '../types/blood';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RequestContextType {
  requests: BloodRequest[];
  addRequest: (request: Omit<BloodRequest, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  fetchRequests: () => Promise<void>;
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export function RequestProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<BloodRequest[]>([]);

  const fetchRequests = async () => {
    try {
      console.log('Fetching requests...');
      const { data, error } = await supabase
        .from('blood_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching requests:', error);
        throw error;
      }

      if (data) {
        console.log('Fetched requests:', data);
        setRequests(data);
      }
    } catch (error) {
      console.error('Error in fetchRequests:', error);
      toast.error('Failed to fetch requests');
    }
  };

  const addRequest = async (newRequest: Omit<BloodRequest, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Adding new request:', newRequest);
      const { data, error } = await supabase
        .from('blood_requests')
        .insert([newRequest])
        .select();

      if (error) {
        console.error('Error creating request:', error);
        toast.error('Failed to create request: ' + error.message);
        return;
      }

      if (data) {
        console.log('Added request:', data[0]);
        setRequests(prev => [data[0], ...prev]);
        toast.success('Blood request created successfully!');
        
        // Refresh to ensure consistency
        await fetchRequests();
      }
    } catch (error) {
      console.error('Error in addRequest:', error);
      toast.error('Failed to create request');
    }
  };

  const deleteRequest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blood_requests')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting request:', error);
        toast.error('Failed to delete request: ' + error.message);
        return;
      }

      setRequests(prev => prev.filter(request => request.id !== id));
      toast.success('Request deleted successfully');
    } catch (error) {
      console.error('Error in deleteRequest:', error);
      toast.error('Failed to delete request');
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchRequests();
    // Set up auto-refresh every 10 seconds
    const interval = setInterval(fetchRequests, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <RequestContext.Provider value={{ requests, addRequest, deleteRequest, fetchRequests }}>
      {children}
    </RequestContext.Provider>
  );
}

export function useRequests() {
  const context = useContext(RequestContext);
  if (context === undefined) {
    throw new Error('useRequests must be used within a RequestProvider');
  }
  return context;
}
