import { Compte } from '@/datas/Compte';
import { Devis } from "@/datas/Devis";
import { DocumentDetail } from '@/datas/DocumentDetail';

export interface DocumentState {
    loading: boolean;
    document?: Devis;
    client?: Compte;
    errorMessage: string;
    customers: Compte[];
    articles: DocumentDetail[];
    email: string;
    messageClientNotFound: string;
}


