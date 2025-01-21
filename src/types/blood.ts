export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  blood_group: string | null;
  phone_number: string | null;
  cnic: string | null;
  location: string | null;
  updated_at: string;
}

export interface BloodRequest {
  id?: string;
  name: string;
  blood_type: BloodType;
  location: string;
  coordinates?: string;
  contact_number: string;
  cnic_id: string;
  type: 'donor' | 'receiver';
  status: 'active' | 'completed' | 'cancelled';
  user_id: string;
  created_at?: string;
  updated_at?: string;
}