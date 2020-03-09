import { Compte } from '@/datas/Compte';

export interface ClientState {
    loading: boolean;
    client?: Compte;
    customers: Compte[];
    email: string;
}


