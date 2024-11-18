export class CurrentResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string;
  address: string;
  phone: string;
  city_id: number;
  province_id: number;
  is_verified: boolean;
}

export class RequestChangePassword {
  current_password: string;
  new_password: string;
  new_confirm_password: string;
}
