export class RegisterUserRequest {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}
export class LoginUserRequest {
  email: string;
  password: string;
}

export class JwtPayload {
  id: string;
  email: string;
  name: string;
  role: string;
  image: string;
  phone: string;
  address: string;
  is_verified: boolean;
  province_id: number;
  city_id: number;
}

export class RegisterResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  image: string;
  is_verified: boolean;
}

export class LoginResponse {
  token: string;
}
