import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject('LigneArticle')
export class Article {
  @JsonProperty('Quantite', Number)
  public quantite = 0;
  @JsonProperty('Description', String)
  public description = '';
  @JsonProperty('Prix', Number)
  public prix = 0;
  @JsonProperty('PrixTotal', Number)
  public prixTotal = 0;
  @JsonProperty('TauxTva', Number)
  public tauxTva = 0;
}
