import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject('DocumentDetail')
export class DocumentDetail {
  @JsonProperty('Mode', String)
  public typeDetail = 'Article';
  @JsonProperty('Quantite', Number)
  public quantite = 0;
  @JsonProperty('Description', String)
  public description = '';
  @JsonProperty('PrixUnitaire', Number)
  public prixUnitaire = 0;
  @JsonProperty('PrixTotal', Number)
  public prixTotal = 0;
  @JsonProperty('TauxTva', Number)
  public tauxTva = 0;
  @JsonProperty('NumeroLigne', Number)
  public numeroLigne = 0;
}
