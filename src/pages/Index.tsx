import { useEffect, useState } from 'react';
import { BloodRequest } from '../types/blood';
import RequestForm from '../components/RequestForm';
import RequestList from '../components/RequestList';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('blood_requests')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blood_requests'
        },
        () => {
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('blood_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const formattedRequests: BloodRequest[] = data.map(item => ({
        id: item.id,
        name: item.name,
        bloodType: item.blood_type,
        location: item.location,
        contactNumber: item.contact_number,
        cnicId: item.cnic_id,
        type: item.type,
        createdAt: new Date(item.created_at)
      }));

      setRequests(formattedRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewRequest = (request: BloodRequest) => {
    setRequests(prev => [request, ...prev]);
  };

  const donors = requests.filter(r => r.type === 'donor');
  const receivers = requests.filter(r => r.type === 'receiver');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-primary mb-8">
          Blood Donation Network
        </h1>
        
        <RequestForm onSubmit={handleNewRequest} />

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-4">Available Donors</h2>
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              <RequestList requests={donors} />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-secondary mb-4">Blood Requests</h2>
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              <RequestList requests={receivers} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;