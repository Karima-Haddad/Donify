// backend/src/models/User.js
import { v4 as uuidv4 } from "uuid"; 

export default class User {
  constructor({
    id,
    name,
    email,
    password_hash,
    role,
    contact_phone,
    location_id,
    created_at,
    updated_at
  }) {
    this.id = id || uuidv4();
    this.name = name;
    this.email = email;
    this.password_hash = password_hash;
    this.role = role;
    this.contact_phone = contact_phone;
    this.location_id = location_id;
    this.created_at = created_at || new Date();
    this.updated_at = updated_at || new Date();
  }
}