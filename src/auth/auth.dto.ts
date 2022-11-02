export class RegisterDto {
  username: string;
  email: string;
  password: string;
}

export class RefreshDto {
  refreshToken: string;
}

export interface RefreshPayload {
  username: string;
  sub: number;
  roles: string[];
  userAgent: any;
  random: string;
}
