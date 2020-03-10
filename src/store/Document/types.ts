import { Devis } from "@/datas/Devis";
import { DocumentDetail } from '@/datas/DocumentDetail';

export interface DocumentState {
    loading: boolean;
    document?: any;
    articles: DocumentDetail[];
    isNewDoc: boolean;
    refDoc: string;
    guidDoc: string;
}


