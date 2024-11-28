import { useState } from 'react';
import { BloodRequest } from '../types/blood';
import { useAuth } from './auth/AuthProvider';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { formatDistanceToNow } from 'date-fns';
import { useRequests } from '@/context/RequestContext';
import { 
  MapPin, 
  Phone, 
  Calendar, 
  User2, 
  Droplet, 
  Heart, 
  Trash2, 
  CreditCard,
  ExternalLink
} from 'lucide-react';

interface RequestListProps {
  type: 'donor' | 'receiver';
}

const RequestList = ({ type }: RequestListProps) => {
  const [loading, setLoading] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const { user } = useAuth();
  const { requests, deleteRequest } = useRequests();

  // Filter requests by type
  const filteredRequests = requests.filter(request => request.type === type);

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await deleteRequest(id);
      toast.success('Request deleted successfully');
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Failed to delete request');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleContact = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (filteredRequests.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No {type}s available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredRequests.map((request) => (
        <div
          key={request.id}
          className={`relative p-6 rounded-xl border backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md ${
            request.type === 'donor'
              ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/20'
              : 'bg-rose-50/50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-800/20'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div
                className={`p-2 rounded-full ${
                  request.type === 'donor'
                    ? 'bg-emerald-100 dark:bg-emerald-800/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-100 dark:bg-rose-800/30 text-rose-600 dark:text-rose-400'
                }`}
              >
                {request.type === 'donor' ? (
                  <Heart className="w-5 h-5" />
                ) : (
                  <Droplet className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className={`font-medium ${
                  request.type === 'donor'
                    ? 'text-emerald-900 dark:text-emerald-100'
                    : 'text-rose-900 dark:text-rose-100'
                }`}>
                  {request.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              request.type === 'donor'
                ? 'bg-emerald-100 dark:bg-emerald-800/30 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-100 dark:bg-rose-800/30 text-rose-700 dark:text-rose-300'
            }`}>
              {request.blood_type}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm">{request.location}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Phone className="w-4 h-4 mr-2" />
              <span className="text-sm">{request.contact_number}</span>
            </div>
          </div>

          <div className="absolute bottom-4 right-4">
            <Button
              size="sm"
              variant="ghost"
              className={`${
                request.type === 'donor'
                  ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-800/30'
                  : 'text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-800/30'
              }`}
              onClick={() => handleContact(request.contact_number)}
            >
              Contact
            </Button>
            {user && user.id === request.user_id && (
              <Button
                size="sm"
                variant="destructive"
                className={`ml-2 ${
                  request.type === 'donor'
                    ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-800/30'
                    : 'text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-800/30'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(request.id);
                }}
                disabled={loading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Request
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RequestList;