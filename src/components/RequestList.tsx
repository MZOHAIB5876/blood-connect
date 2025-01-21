import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/auth/AuthProvider';
import { useRequests } from '../context/RequestContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { MapPin, Phone, CreditCard, Navigation, Trash2, Heart } from 'lucide-react';
import { BloodRequest } from '../types/blood';

interface RequestListProps {
  type: 'donor' | 'receiver';
}

const RequestCard = ({ request, onDelete }: { request: BloodRequest; onDelete: () => Promise<void> }) => {
  const { user } = useAuth();
  
  console.log('Rendering request:', request); // Debug log

  const handleFollowLocation = () => {
    if (request.coordinates) {
      const [lat, lng] = request.coordinates.split(',').map(coord => coord.trim());
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(mapsUrl, '_blank');
    } else {
      const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(request.location)}`;
      window.open(searchUrl, '_blank');
    }
  };

  return (
    <Card className="w-full mb-4 overflow-hidden bg-card hover:bg-accent/50 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <CardTitle className="text-xl font-bold">{request.name}</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 px-3 inline-flex items-center text-sm font-semibold rounded-full bg-primary/10 text-primary">
            {request.blood_type}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
            onClick={handleFollowLocation}
            title="Follow Location"
          >
            <Navigation 
              className="h-4 w-4 hover:scale-110 transition-transform" 
              strokeWidth={2.5}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="text-sm space-y-3">
        <div className="grid gap-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex items-center gap-2 min-w-[80px]">
              <MapPin className="h-4 w-4" />
              <span className="font-medium">Location:</span>
            </div>
            <span>{request.location || 'Not specified'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex items-center gap-2 min-w-[80px]">
              <Phone className="h-4 w-4" />
              <span className="font-medium">Phone:</span>
            </div>
            <span>{request.contact_number}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex items-center gap-2 min-w-[80px]">
              <CreditCard className="h-4 w-4" />
              <span className="font-medium">CNIC:</span>
            </div>
            <span>{request.cnic_id}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => window.open(`tel:${request.contact_number}`)}
          >
            <Phone className="h-4 w-4" />
            Contact
          </Button>
          
          {request.user_id === user?.id && (
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center gap-2"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
              Delete Request
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const RequestList = ({ type }: RequestListProps) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { requests, deleteRequest, fetchRequests } = useRequests();

  console.log('All requests:', requests); // Debug log

  // Filter requests by type and sort by created_at
  const filteredRequests = requests
    .filter(request => request.type === type)
    .sort((a, b) => {
      if (!a.created_at || !b.created_at) return 0;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  console.log('Filtered requests:', filteredRequests); // Debug log

  const handleDelete = async (id: string) => {
    if (!id) return;
    try {
      setLoading(true);
      await deleteRequest(id);
      await fetchRequests(); // Refresh the list after deletion
      toast.success('Request deleted successfully');
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Failed to delete request');
    } finally {
      setLoading(false);
    }
  };

  // Fetch requests immediately and set up auto-refresh
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {filteredRequests.length === 0 ? (
        <Card className="p-6 text-center">
          <CardContent className="flex flex-col items-center gap-2">
            <Heart className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">No {type} requests found</p>
          </CardContent>
        </Card>
      ) : (
        filteredRequests.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            onDelete={() => request.id && handleDelete(request.id)}
          />
        ))
      )}
    </div>
  );
};

export default RequestList;