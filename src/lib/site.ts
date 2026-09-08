/** Organization-level constants for the Kyzylorda water utility portal.
 *  These mirror the official public data; nothing here is invented.
 *  Replaced via env/config when a real deployment is provisioned. */

export const ORG = {
  nameRu: "ГКП на ПХВ «Кызылорда Су Жүйесі»",
  nameKk: "«Қызылорда Су Жүйесі» ШЖҚ МКК",
  short: "ҚЫЗЫЛОРДА СУ ЖҮЙЕСІ",
  addressRu: "г. Кызылорда, ул. Желтоксан, 156",
  addressKk: "Қызылорда қаласы, Желтоқсан көшесі, 156 үй",
  workHoursRu: "Пн–Пт 08:00–18:00",
  workHoursKk: "Дс–Жм 08:00–18:00",
} as const;

export const PHONES = {
  /** Call-center (main line) */
  callCenter: "+77056903410",
  callCenterPretty: "+7 (705) 690-34-10",
  /** Physical persons second line */
  individuals: "+77056909283",
  individualsPretty: "+7 (705) 690-92-83",
  /** Dispatcher (office hours) */
  dispatcher: "+77242230445",
  dispatcherPretty: "+7 (7242) 23-04-45",
  /** Emergency dispatch 24/7 */
  emergency: "+77770049888",
  emergencyPretty: "+7 (777) 004-98-88",
} as const;

export const telHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, "")}`;

/** Demo bank requisites — marked as mock until the finance department confirms. */
export const REQUISITES = {
  bin: "Демо: 123456789012",
  iik: "Демо: KZ00 0000 0000 0000 0000",
  bank: "Демо: АО «Банк»",
  kbe: "Демо: 17",
} as const;

export const APP_DEMO_ACCOUNT = "12345678";
