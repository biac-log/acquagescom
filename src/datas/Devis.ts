import { JsonObject, JsonProperty } from 'json2typescript';
import { DocumentDetail } from './DocumentDetail';

@JsonObject('Devis')
export class Devis {
  @JsonProperty('NumeroDevis ', String)
  public NumeroDevis  = '';
  @JsonProperty('Date', Date)
  public Date = new Date();
  @JsonProperty('Createur ', String)
  public Createur = '';
  @JsonProperty('NumeroClient', Number)
  public NumeroClient = 0;
  @JsonProperty('LibelleClient', String)
  public LibelleClient = '';
  @JsonProperty('AdresseLigne1', String)
  public AdresseLigne1 = '';
  @JsonProperty('AdresseLigne2', String)
  public AdresseLigne2 = '';
  @JsonProperty('CodePays', String)
  public CodePays = '';
  @JsonProperty('CodePostal', String)
  public CodePostal = '';
  @JsonProperty('Localite', String)
  public Localite = '';
  @JsonProperty('Telephone', String)
  public Telephone = '';
  @JsonProperty('Email', String)
  public Email = '';
  @JsonProperty('Articles', [DocumentDetail])
  public Articles : DocumentDetail[] = [];
  @JsonProperty('PrixTotalHtva', Number)
  public PrixTotalHtva = 0;
  @JsonProperty('TotalTva', Number)
  public TotalTva = 0;
  @JsonProperty('PrixTotalTtc', Number)
  public PrixTotalTtc = 0;
  @JsonProperty('Commentaire', String)
  public Commentaire = "";
  @JsonProperty('DemandePar', String)
  public DemandePar = '';
  @JsonProperty('AcQuaDocsId ', String)
  public AcQuaDocsId = '';
}