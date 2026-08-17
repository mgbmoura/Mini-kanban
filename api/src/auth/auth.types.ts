export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
}

export interface AuthenticatedRequest {
  user: {
    id: string;
    email: string;
    name: string;
  };
}
