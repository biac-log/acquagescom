import { Compte } from '@/datas/Compte';
import { Document } from "@/datas/Document";
import { Article } from '@/datas/Article';

export interface DocumentState {
    isNewDoc: boolean;
    document?: Document;
    client?: Compte;
    refDevis: string;
    numeroClient: string;
    errorMessage: string;
    customers:Compte[];
    articles: Article[];
}


