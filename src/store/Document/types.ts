import { Devis } from "@/datas/Devis";
import { DocumentDetail } from '@/datas/DocumentDetail';

export interface DocumentState {
    loading: boolean;
    document?: Devis;
    articles: DocumentDetail[];
    isNewDoc: boolean;
    refDoc: string;
}


