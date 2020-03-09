<template>
  <v-menu
    v-model="fromDateMenu"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        class="ml-2 mb-n5 mr-3 float-right min-width"
        v-model="date"
        label="Date"
        placeholder="jj/mm/aaaa"
        append-icon="mdi-calendar"
        v-on="on"
        :rules="dateRules"
        solo
        counter="10"
        maxlength="10"
      ></v-text-field>
    </template>
    <v-date-picker
      locale="fr-fr"
      v-model="dateFromDatePicker"
      no-title
      @input="fromDateMenu = false"
    ></v-date-picker>
  </v-menu>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, PropSync } from "vue-property-decorator";
const COLOR_OK = "green lighten-1 white--text";
const COLOR_NOT_OK = "orange lighten-3";

@Component({})
export default class DatePickerPerso extends Vue {
  @PropSync("dateFromPicker")
  private date!: string;
  @PropSync("colorDate")
  private color!: string;

  private fromDateMenu = false;
  private dateFromDatePicker = new Date().toISOString().substr(0, 10);

  @Watch("dateFromDatePicker")
  private ondateFromDatePickerChanged() {
    this.date = this.formatDate(this.dateFromDatePicker) || "";
  }

  private dateRules = [
    (d: any) => this.isDateValid(d) || "La date n'est pas valide"
  ];

  private isDateValid(date: string): boolean {
    if (date != "" && date.length == 10) {
      if (this.verifyDate(date)) {
        this.color = COLOR_OK;
        return true;
      } else {
        this.color = COLOR_NOT_OK;
        return false;
      }
    } else {
      this.color = COLOR_NOT_OK;
      return true;
    }
  }

  //Doit recevoir une date au format JJ/MM/AAAA après année 2000
  private verifyDate(date: string): boolean {
    if (!date) return false;

    const [dayStr, monthStr, yearStr] = date.split("/");
    if (dayStr.length != 2 || monthStr.length != 2 || yearStr.length != 4)
      return false;
    const day = +dayStr;
    const month = +monthStr;
    const year = +yearStr;
    if (day <= 0 || month <= 0 || month > 12 || year < 2000) return false;

    const isBisextile = year % 100 === 0 ? year % 400 === 0 : year % 4 === 0;

    if (month == 2 && isBisextile && day > 29) return false;
    if (month == 2 && !isBisextile && day > 28) return false;

    if (
      month == 1 ||
      month == 3 ||
      month == 5 ||
      month == 7 ||
      month == 8 ||
      month == 10 ||
      month == 12
    ) {
      if (day > 31) return false;
    } else {
      if (day > 30) return false;
    }
    return true;
  }

  private formatDate(date: string) {
    if (!date) return null;

    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  }
}
</script>
