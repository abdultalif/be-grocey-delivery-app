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
  is_verified: boolean;
}

export class RegisterResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  is_verified: boolean;
}

export class LoginResponse {
  token: string;
}
