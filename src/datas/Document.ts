import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject('Document')
export class Document {
  @JsonProperty('Id', String)
  public id = '';
  @JsonProperty('TypeDocument', String)
  public typeDocument = '';
  @JsonProperty('RefDevis', String)
  public refDevis = '';
  @JsonProperty('LibelleClient', String)
  public libelleClient = '';
  @JsonProperty('NumeroClient', String)
  public numeroClient = '';
  @JsonProperty('Telephone', String)
  public telephone = '';
  @JsonProperty('Email', String)
  public email = '';
  @JsonProperty('Date', Date)
  public dateCreation = new Date('01/01/0001');
  @JsonProperty('AdresseLigne1', String)
  public adrLigne1 = '';
  @JsonProperty('AdresseLigne2', String)
  public adrLigne2 = '';
  @JsonProperty('CodePostal', String)
  public codePostal = '';
  @JsonProperty('Localite', String)
  public localite = '';
  @JsonProperty('CodePays', String)
  public codePays = '';
  @JsonProperty('DemandePar', String)
  public demandePar = '';
}