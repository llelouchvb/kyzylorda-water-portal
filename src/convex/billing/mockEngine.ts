/**
 * ─────────────────────────────────────────────────────────────────────────────
 * MOCK BILLING SOURCE (integration layer)
 *
 * The portal talks to billing only through `billing.ts` functions. That file
 * currently delegates to this deterministic demo engine so every account
 * number yields stable, realistic data without a real billing system.
 *
 * To connect the real billing system later:
 *   1. keep the public API in `billing.ts` unchanged;
 *   2. add a `realSource.ts` that calls the operator's billing API
 *      (GET /api/accounts/{n}, /balance, /accruals, /payments, /readings,
 *       POST /api/readings);
 *   3. swap the delegation here for the real source.
 *
 * Values are intentionally derived from the account number (pure function) —
 * no writes, no randomness across requests.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type BiValue = { ru: string; kk: string };

export interface DemoMonth {
  /** ISO date of the month start (yyyy-mm-dd). */
  month: string;
  volume: number;
  rate: number;
  accrual: number;
  paid: number;
}

export interface DemoAccount {
  number: string;
  name: BiValue;
  address: BiValue;
  balance: number;
  lastAccrual: number;
  lastPayment: number;
  updatedAt: number;
  months: DemoMonth[];
}

/* ------------------------------------------------------------------ */

const STREETS: BiValue[] = [
  { ru: "ул. Желтоксан", kk: "Желтоқсан к-сі" },
  { ru: "пр. Абая", kk: "Абай даңғ." },
  { ru: "ул. Коркыт-Ата", kk: "Қорқыт-Ата к-сі" },
  { ru: "ул. Муратбаева", kk: "Мұратбаев к-сі" },
  { ru: "ул. Сырдарьинская", kk: "Сырдария к-сі" },
  { ru: "мкр. Акмешит", kk: "Ақмешіт ықш." },
  { ru: "мкр. Арай", kk: "Арай ықш." },
  { ru: "мкр. Байтерек", kk: "Бәйтерек ықш." },
  { ru: "ул. Жанкожа батыра", kk: "Жанқожа батыр к-сі" },
  { ru: "ул. Сунак-Ата", kk: "Сүйеніш (Сұнақ-ата) к-сі" },
];

const SURNAMES_RU = [
  "Ахметов",
  "Ибраев",
  "Серікбаев",
  "Жумабаева",
  "Нурланова",
  "Оспанов",
  "Тажибаева",
  "Кусаинов",
  "Ержанова",
  "Муратова",
];
const NAMES_RU = ["Айбек", "Гульнара", "Данияр", "Айгуль", "Ерлан", "Сауле"];
const SURNAMES_KK = [
  "Ахметов",
  "Ыбыраев",
  "Серікбаев",
  "Жұмабаева",
  "Нұрланова",
  "Оспанов",
  "Тажібаева",
  "Құсайынов",
  "Ержанова",
  "Мұратова",
];
const NAMES_KK = ["Айбек", "Гүлнара", "Дәнияр", "Айгүл", "Ерлан", "Сәуле"];

/* ------------------------------------------------------------------ */

/** 32-bit hash of a string (FNV-1a). */
function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Deterministic PRNG (mulberry32). */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Demo "account exists" rule: 8 digits, first digit not 0/1, not all equal. */
export function accountExists(accountNumber: string): boolean {
  if (!/^\d{8}$/.test(accountNumber)) return false;
  if (/^[01]/.test(accountNumber)) return false;
  if (/^(\d)\1{7}$/.test(accountNumber)) return false;
  return true;
}

function lastMonths(count: number): Date[] {
  const out: Date[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push(d);
  }
  return out;
}

/** Build the full demo profile for an account. Stable across requests. */
export function buildAccount(accountNumber: string): DemoAccount | null {
  if (!accountExists(accountNumber)) return null;

  const seed = hashString(`ksj-${accountNumber}`);
  const rnd = mulberry32(seed);
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rnd() * arr.length) % arr.length];

  const street = pick(STREETS);
  const house = 1 + Math.floor(rnd() * 140);
  const flat = 1 + Math.floor(rnd() * 120);
  const nameIdx = Math.floor(rnd() * SURNAMES_RU.length);
  const nameInitial = NAMES_RU[Math.floor(rnd() * NAMES_RU.length)];
  const kkInitial = NAMES_KK[nameIdx % NAMES_KK.length];

  const address: BiValue = {
    ru: `г. Кызылорда, ${street.ru}, ${house}, кв. ${flat}`,
    kk: `Қызылорда қ., ${street.kk}, ${house}, пәтер ${flat}`,
  };
  const name: BiValue = {
    ru: `${SURNAMES_RU[nameIdx]} ${nameInitial[0]}.${SURNAMES_RU[nameIdx][0]}.`,
    kk: `${SURNAMES_KK[nameIdx]} ${kkInitial[0]}.${SURNAMES_KK[nameIdx][0]}.`,
  };

  // Deterministic rate per account, e.g. 118–146 ₸ / m³.
  const rate = round2(118 + rnd() * 28);

  const months: DemoMonth[] = lastMonths(12).map((monthDate, i) => {
    // Seasonal-ish usage 3–21 m³.
    const season = 1 + Math.sin((monthDate.getMonth() / 12) * Math.PI * 2);
    const volume = round2(Math.max(2.5, 9 + season * 5 + rnd() * 7));
    const accrual = round2(volume * rate);
    const payChance = 0.52 + (i / 14) * 0.4; // older bills more likely paid
    const paid = rnd() < payChance ? accrual : round2(accrual * rnd() * 0.55);
    return {
      month: monthDate.toISOString().slice(0, 10),
      volume,
      rate,
      accrual,
      paid,
    };
  });

  const totalAccrual = months.reduce((s, m) => s + m.accrual, 0);
  const totalPaid = months.reduce((s, m) => s + m.paid, 0);
  const balance = round2(totalAccrual - totalPaid);
  const lastPaidMonth = months.find((m) => m.paid > 0);

  return {
    number: accountNumber,
    name,
    address,
    balance,
    lastAccrual: months[0]?.accrual ?? 0,
    lastPayment: lastPaidMonth ? lastPaidMonth.paid : 0,
    updatedAt:
      Date.now() - Math.floor(rnd() * 24 * 3600 * 1000) - 6 * 3600 * 1000,
    months,
  };
}

/** Small helper so UI shows demo totals consistently. */
export const MONTH_LABELS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
] as const;
