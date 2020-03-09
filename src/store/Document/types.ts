import { Compte } from '@/datas/Compte';
import { Devis } from "@/datas/Devis";
import { DocumentDetail } from '@/datas/DocumentDetail';

export interface DocumentState {
    loading: boolean;
    document?: Devis;
    client?: Compte;
    customers: Compte[];
    articles: DocumentDetail[];
    email: string;
    isNewDoc: boolean;
    refDoc: string;
}


