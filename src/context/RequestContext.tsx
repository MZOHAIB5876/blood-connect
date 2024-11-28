import React, { createContext, useContext, useState, useCallback } from 'react';
import { BloodRequest } from '../types/blood';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RequestContextType {
  requests: BloodRequest[];
  addRequest: (request: BloodRequest) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  refreshRequests: () => Promise<void>;
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export function RequestProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<BloodRequest[]>([]);

  const refreshRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('blood_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests');
    }
  };

  const addRequest = useCallback(async (newRequest: BloodRequest) => {
    // Optimistically add the request to the UI
    setRequests(prev => [newRequest, ...prev]);

    try {
      const { error } = await supabase
        .from('blood_requests')
        .insert(newRequest);

      if (error) {
        // If there's an error, revert the optimistic update
        setRequests(prev => prev.filter(r => r.id !== newRequest.id));
        throw error;
      }
    } catch (error) {
      console.error('Error adding request:', error);
      toast.error('Failed to save request');
      throw error;
    }
  }, []);

  const deleteRequest = useCallback(async (id: string) => {
    // Optimistically remove the request from the UI
    const previousRequests = [...requests];
    setRequests(prev => prev.filter(request => request.id !== id));

    try {
      const { error } = await supabase
        .from('blood_requests')
        .delete()
        .eq('id', id);

      if (error) {
        // If there's an error, revert the optimistic update
        setRequests(previousRequests);
        throw error;
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Failed to delete request');
      throw error;
    }
  }, [requests]);

  React.useEffect(() => {
    refreshRequests();
  }, []);

  return (
    <RequestContext.Provider value={{ requests, addRequest, deleteRequest, refreshRequests }}>
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
