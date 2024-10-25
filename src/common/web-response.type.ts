export class WebResponse<T> {
  message: string;
  statusCode: number;
  data?: T;
}
