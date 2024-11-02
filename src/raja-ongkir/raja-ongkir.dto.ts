export class ProvincesResponse {
  id: string;
  name: string;
}
export class CitiesResponse {
  id: string;
  name: string;
  type: string;
  postal_code: string;
  province: ProvincesResponse;
}

export class costRequest {
  destination: number;
  weight: number;
  courier: string;
}
