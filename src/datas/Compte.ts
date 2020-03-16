import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject('Compte')
export class Compte {
  @JsonProperty('Nom', String)
  public nom = '';
  @JsonProperty('Numero', Number)
  public numero = 0;
  @JsonProperty('NumeroTelephone', String)
  public telephone = '';
  @JsonProperty('AdresseLigne1', String)
  public adrLigne1 = '';
  @JsonProperty('AdresseLigne2', String)
  public adrLigne2 = '';
  @JsonProperty('CodePostal', String)
  public codePostal = '';
  @JsonProperty('AdresseVille', String)
  public localite = '';
  @JsonProperty('CodePays', String)
  public codePays = '';
  public email = '';
}