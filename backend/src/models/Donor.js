export default class Donor {
  constructor({ id, gender, date_of_birth, blood_type, availability, last_donation_date, next_eligible_date }) {
    this.id = id; // doit correspondre à users.id
    this.gender = gender;
    this.date_of_birth = date_of_birth;
    this.blood_type = blood_type;
    this.availability = availability;
    this.last_donation_date = last_donation_date;
    this.next_eligible_date = next_eligible_date;
  }
}