import { useState } from 'react';
import { BloodRequest, BloodType } from '../types/blood';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { LocationPicker } from './LocationPicker';
import { toast } from 'sonner';
import { useAuth } from './auth/AuthProvider';
import { useRequests } from '@/context/RequestContext';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { User, Droplet, Phone, IdCard, MapPin, Loader2, Crosshair, Heart, Send, RefreshCw } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface FormData {
  name: string;
  bloodType: BloodType;
  location: string;
  coordinates: string;
  contactNumber: string;
  cnicId: string;
  type: 'donor' | 'receiver';
}

const BLOOD_TYPES: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RequestForm = () => {
  const { user } = useAuth();
  const { addRequest } = useRequests();
  const [loading, setLoading] = useState(false);
  const [isDonor, setIsDonor] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    bloodType: 'O+',
    location: '',
    coordinates: '',
    contactNumber: '',
    cnicId: '',
    type: 'donor',
  });
  const [locationLoading, setLocationLoading] = useState(false);
  const [mapPosition, setMapPosition] = useState<[number, number] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTypeChange = (checked: boolean) => {
    setIsDonor(checked);
    setFormData(prev => ({ ...prev, type: checked ? 'donor' : 'receiver' }));
  };

  const handleLocationClick = async () => {
    setLocationLoading(true);
    try {
      if (!navigator.geolocation) {
        toast.error('Geolocation is not supported by your browser');
        return;
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      
      // Fetch location name using reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      // Format the location string
      const locationName = data.display_name.split(',').slice(0, 3).join(', ');
      
      setFormData(prev => ({
        ...prev,
        location: locationName,
        coordinates: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      }));

      // Update map position
      setMapPosition([latitude, longitude]);
      
      toast.success('Location detected successfully');
    } catch (error) {
      console.error('Error getting location:', error);
      toast.error('Failed to detect location. Please enter manually.');
    } finally {
      setLocationLoading(false);
    }
  };

  const ensureProfileExists = async () => {
    if (!user) return false;

    try {
      // Check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!profile) {
        // Create profile if it doesn't exist
        const { error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: formData.name,
            contact_number: formData.contactNumber,
            cnic_id: formData.cnicId,
            location: formData.location
          });

        if (createError) throw createError;
      }

      return true;
    } catch (error) {
      console.error('Error ensuring profile exists:', error);
      return false;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (!user) {
        toast.error('You must be logged in to submit a request');
        return;
      }

      // Validate form data
      if (!formData.name || !formData.bloodType || !formData.location || !formData.contactNumber || !formData.cnicId) {
        toast.error('Please fill in all required fields');
        return;
      }

      const newRequest = {
        name: formData.name,
        blood_type: formData.bloodType,
        location: formData.location,
        coordinates: formData.coordinates || '0,0',
        contact_number: formData.contactNumber,
        cnic_id: formData.cnicId,
        type: formData.type,
        status: 'active' as const,
        user_id: user.id
      };

      await addRequest(newRequest);
      
      // Reset form
      setFormData({
        name: '',
        bloodType: 'O+',
        location: '',
        coordinates: '',
        contactNumber: '',
        cnicId: '',
        type: isDonor ? 'donor' : 'receiver',
      });
      
      // Reset map position
      setMapPosition(null);
      
    } catch (error: any) {
      console.error('Error submitting request:', error);
      toast.error(error.message || 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
          Blood Request Form
        </h2>
        <p className="mt-2 text-gray-600">
          Fill in your details to {formData.type === 'donor' ? 'donate blood' : 'request blood'}
        </p>
      </div>

      {/* Type Selector */}
      <div className="relative w-full h-16 mx-auto mb-8 bg-rose-900/10 dark:bg-rose-900/5 rounded-full p-2 border border-rose-900/20 dark:border-rose-800/20 shadow-sm">
        <div
          className="absolute inset-y-2 w-[calc(50%-4px)] bg-gradient-to-r from-rose-600 to-rose-700 dark:from-rose-700 dark:to-rose-800 rounded-full shadow-sm transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(${isDonor ? '4px' : 'calc(100% + 4px)'})`
          }}
        />
        <div className="relative flex h-full">
          <button
            onClick={() => handleTypeChange(true)}
            className={`flex-1 flex items-center justify-center text-lg font-medium transition-colors duration-200 rounded-full ${
              isDonor ? 'text-white' : 'text-rose-700 dark:text-rose-500'
            }`}
          >
            <Heart className={`w-6 h-6 mr-2.5 ${isDonor ? 'text-white' : 'text-rose-600 dark:text-rose-500'}`} />
            Donor
          </button>
          <button
            onClick={() => handleTypeChange(false)}
            className={`flex-1 flex items-center justify-center text-lg font-medium transition-colors duration-200 rounded-full ${
              !isDonor ? 'text-white' : 'text-rose-700 dark:text-rose-500'
            }`}
          >
            <Droplet className={`w-6 h-6 mr-2.5 ${!isDonor ? 'text-white' : 'text-rose-600 dark:text-rose-500'}`} />
            Receiver
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900/5 dark:bg-gray-800/10 backdrop-blur-sm rounded-xl p-6 border border-rose-900/10 dark:border-rose-800/10 shadow-sm">
        <div>
          <Label htmlFor="name" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <User className={`w-4 h-4 ${isDonor ? 'text-emerald-600 dark:text-emerald-500' : 'text-rose-600 dark:text-rose-500'}`} />
            Full Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
            placeholder="Enter your full name"
            className="mt-1.5 bg-white/50 dark:bg-gray-900/50 border-gray-200/50 dark:border-gray-700/50 focus:border-rose-500 dark:focus:border-rose-600 focus:ring-rose-500/20 dark:focus:ring-rose-600/20"
          />
        </div>

        <div>
          <Label htmlFor="bloodType" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Droplet className={`w-4 h-4 ${isDonor ? 'text-emerald-600 dark:text-emerald-500' : 'text-rose-600 dark:text-rose-500'}`} />
            Blood Type
          </Label>
          <Select
            id="bloodType"
            value={formData.bloodType}
            onValueChange={(value) => setFormData(prev => ({ ...prev, bloodType: value as BloodType }))}
            required
          >
            <SelectTrigger className="mt-1.5 bg-white/50 dark:bg-gray-900/50 border-gray-200/50 dark:border-gray-700/50 focus:border-rose-500 dark:focus:border-rose-600 focus:ring-rose-500/20 dark:focus:ring-rose-600/20">
              <SelectValue placeholder="Select blood type" />
            </SelectTrigger>
            <SelectContent>
              {BLOOD_TYPES.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <div className="flex gap-2">
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder="Enter your location"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleLocationClick}
              disabled={locationLoading}
              className="shrink-0"
            >
              {locationLoading ? (
                <div className="animate-spin">
                  <RefreshCw className="h-4 w-4" />
                </div>
              ) : (
                <MapPin className="h-4 w-4" />
              )}
            </Button>
          </div>
          {formData.coordinates && (
            <p className="text-xs text-muted-foreground">
              Coordinates: {formData.coordinates}
            </p>
          )}
          {mapPosition && (
            <div className="mt-2 rounded-lg overflow-hidden border border-input">
              <MapContainer
                center={mapPosition}
                zoom={13}
                style={{ height: '200px', width: '100%' }}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={mapPosition}>
                  <Popup>
                    {formData.location}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="contactNumber" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Phone className={`w-4 h-4 ${isDonor ? 'text-emerald-600 dark:text-emerald-500' : 'text-rose-600 dark:text-rose-500'}`} />
            Contact Number
          </Label>
          <Input
            id="contactNumber"
            value={formData.contactNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
            required
            placeholder="Enter your contact number"
            className="mt-1.5 bg-white/50 dark:bg-gray-900/50 border-gray-200/50 dark:border-gray-700/50 focus:border-rose-500 dark:focus:border-rose-600 focus:ring-rose-500/20 dark:focus:ring-rose-600/20"
          />
        </div>

        <div>
          <Label htmlFor="cnicId" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <IdCard className={`w-4 h-4 ${isDonor ? 'text-emerald-600 dark:text-emerald-500' : 'text-rose-600 dark:text-rose-500'}`} />
            CNIC ID
          </Label>
          <Input
            id="cnicId"
            value={formData.cnicId}
            onChange={(e) => setFormData(prev => ({ ...prev, cnicId: e.target.value }))}
            required
            placeholder="Enter your CNIC ID"
            className="mt-1.5 bg-white/50 dark:bg-gray-900/50 border-gray-200/50 dark:border-gray-700/50 focus:border-rose-500 dark:focus:border-rose-600 focus:ring-rose-500/20 dark:focus:ring-rose-600/20"
          />
        </div>

        <Button 
          type="submit" 
          disabled={loading || isSubmitting}
          className={`w-full mt-6 ${
            isDonor 
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800' 
              : 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800'
          }`}
        >
          {loading || isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Request
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default RequestForm;