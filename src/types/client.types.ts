export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientsState {
  clients: Client[];
  loading: boolean;
  error: string | null;
}
