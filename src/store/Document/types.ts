import { Compte } from '@/datas/Compte';
import { Document } from "@/datas/Document";

export interface DocumentState {
    isNewDoc: boolean;
    document?: Document;
    client?: Compte;
    refDevis: string;
    numeroClient: string;
    errorMessage: string;
}


