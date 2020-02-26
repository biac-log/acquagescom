import { Compte } from '@/datas/Compte';
import { Document } from "@/datas/Document";
import { Article } from '@/datas/Article';

export interface DocumentState {
    loading: boolean;
    document?: Document;
    client?: Compte;
    errorMessage: string;
    customers: Compte[];
    articles: Article[];
    email: string;
    messageClientNotFound: string;
}


