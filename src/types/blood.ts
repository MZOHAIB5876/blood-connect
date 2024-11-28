export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  blood_type: string | null;
  contact_number: string | null;
  cnic_id: string | null;
  location: string | null;
  updated_at: string;
}

export interface BloodRequest {
  id: string;
  user_id: string;
  name: string;
  blood_type: BloodType;
  location: string;
  contact_number: string;
  cnic_id: string;
  type: 'donor' | 'receiver';
  created_at: string;
  profiles?: Profile;
}