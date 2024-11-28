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

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('blood_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching requests:', error);
        throw error;
      }

      if (data) {
        setRequests(data);
      }
    } catch (error) {
      console.error('Error in fetchRequests:', error);
      toast.error('Failed to fetch requests');
    }
  };

  const addRequest = async (newRequest: BloodRequest) => {
    try {
      setRequests(prev => [newRequest, ...prev]);
      await fetchRequests(); // Refresh the list after adding
    } catch (error) {
      console.error('Error in addRequest:', error);
      toast.error('Failed to update requests list');
    }
  };

  const deleteRequest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blood_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRequests(prev => prev.filter(request => request.id !== id));
      await fetchRequests(); // Refresh the list after deleting
    } catch (error) {
      console.error('Error in deleteRequest:', error);
      throw error;
    }
  };

  React.useEffect(() => {
    fetchRequests();
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
