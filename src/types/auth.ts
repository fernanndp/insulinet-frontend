export type User = {
  id: number;
  name: string;
  email: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
};

export type MessageResponse = {
  message: string;
};
