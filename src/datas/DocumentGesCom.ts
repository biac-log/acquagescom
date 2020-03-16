import { JsonObject, JsonProperty } from 'json2typescript';
import { DocumentDetail } from './DocumentDetail';

@JsonObject('DocumentGesCom')
export class DocumentGesCom {
  @JsonProperty('NumeroDevis', String)
  public numeroDevis = '';
  @JsonProperty('NumeroBL', String)
  public numeroBL = '';
  @JsonProperty('NumeroBC', String)
  public numeroBC = '';
  @JsonProperty('NumeroFacture', String)
  public numeroFacture = '';
  @JsonProperty('Date', Date)
  public date = new Date();
  @JsonProperty('DateCommande', Date)
  public dateCommande = new Date();
  @JsonProperty('DateLivraison', Date)
  public dateLivraison = new Date();
  @JsonProperty('Createur ', String)
  public createur = '';
  @JsonProperty('NumeroClient', Number)
  public numeroClient = 0;
  @JsonProperty('LibelleClient', String)
  public libelleClient = '';
  @JsonProperty('AdresseLigne1', String)
  public adresseLigne1 = '';
  @JsonProperty('AdresseLigne2', String)
  public adresseLigne2 = '';
  @JsonProperty('CodePays', String)
  public codePays = '';
  @JsonProperty('CodePostal', String)
  public codePostal = '';
  @JsonProperty('Localite', String)
  public localite = '';
  @JsonProperty('Telephone', String)
  public telephone = '';
  @JsonProperty('Email', String)
  public email = '';
  @JsonProperty('Articles', [DocumentDetail])
  public articles : DocumentDetail[] = [];
  @JsonProperty('PrixTotalHtva', Number)
  public prixTotalHtva = 0;
  @JsonProperty('TotalTva', Number)
  public totalTva = 0;
  @JsonProperty('PrixTotalTtc', Number)
  public prixTotalTtc = 0;
  @JsonProperty('Commentaire', String)
  public commentaire = "";
  @JsonProperty('DemandePar', String)
  public demandePar = '';
  @JsonProperty('AcQuaDocsId ', String)
  public acQuaDocsId = '';
}