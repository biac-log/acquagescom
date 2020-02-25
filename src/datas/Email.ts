import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject('Email')
export class Email {
  @JsonProperty('AdressesEmail', String)
  public AdressesEmail = '';
}