import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject('DocumentDetail')
export class DocumentDetail {
  @JsonProperty('Quantite', Number)
  public quantite = 0;
  @JsonProperty('Libelle', String)
  public libelle = '';
  @JsonProperty('PrixUnitaire', Number)
  public prixUnitaire = 0;
  @JsonProperty('PrixTotal', Number)
  public prixTotal = 0;
  @JsonProperty('TauxTva', Number)
  public tauxTva = 0;
  @JsonProperty('NumeroLigne', Number)
  public numeroLigne = 0;
}
