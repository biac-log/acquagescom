import { DocumentGesCom } from "@/datas/DocumentGesCom";
import { DocumentDetail } from '@/datas/DocumentDetail';

export interface DocumentState {
    loading: boolean;
    document?: DocumentGesCom;
    articles: DocumentDetail[];
    isNewDoc: boolean;
    refDoc: string;
    guidDoc: string;
}


