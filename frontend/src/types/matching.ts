export interface Donor {
  donor_id: string;
  public_id: string;
  gender: string;
  blood_type: string;
  age: number;
  phone: string | null,
  proba_accept: number;
}

export interface ValidatedDonation {
  donor_id: string;
  public_id: string;
  blood_type: string;
  gender: string;
  age: number;
  phone: string | null;
  volume_ml: number;
  request_id: string;
  donation_date: string;
}