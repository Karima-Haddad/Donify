export interface Donor {
  public_id: string;
  gender: string;
  blood_type: string;
  age: number;
  phone: string | null,
  proba_accept: number;
}