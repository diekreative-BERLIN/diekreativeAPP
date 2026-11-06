// Vorlage für die lokalen Umgebungsdateien.
// Kopieren nach environment.ts und environment.prod.ts und echte Werte eintragen.
// Die echten Dateien sind per .gitignore vom Repo ausgeschlossen.

export const environment = {
  production: false,
  tueroeffnerurl: "https://…",
  tueroeffnerurlHN: "https://…",
  churchtoolsurl: "https://…",
  prayerapiurl: "https://…",
  prayerapitoken: "…",
  tokenHN: "…",
  predigtenurl: "https://…",
  eventsurl: "https://…",
  dkeventsapiurl: "https://…",
  lifegroupsurl: "https://…",
  gebetskalenderurl: "https://…",
  gebetskalenderHNurl: "https://…",
  // WLAN-Erkennung Schivelbeiner Str. ("diekreative Guest"): DynDNS-Name des Anschlusses
  // (z. B. MyFRITZ-Adresse) und/oder feste IPs. Beides leer = nur GPS-Prüfung.
  standortHostSchivelbeiner: "",
  standortIPsSchivelbeiner: []
};
