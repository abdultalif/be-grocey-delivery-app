export class CurrentResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string;
  address: string;
  phone: string;
  is_verified: boolean;
}

export class RequestChangePassword {
  current_password: string;
  new_password: string;
  new_confirm_password: string;
}
