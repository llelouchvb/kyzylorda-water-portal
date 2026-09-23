"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { common, type Lang } from "@/lib/content";

type Field = "name" | "contact" | "topic" | "address" | "message" | "consent";
type Errors = Partial<Record<Field, string>>;

export default function AppealForm({ lang }: { lang: Lang }) {
  const t = common[lang];
  const kz = lang === "kz";
  const [errors, setErrors] = useState<Errors>({});
  const [blocked, setBlocked] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const fieldLabels: Record<Field, string> = {
    name: kz ? "Аты-жөні" : "Имя",
    contact: kz ? "Кері байланыс тәсілі" : "Способ обратной связи",
    topic: kz ? "Тақырып" : "Тема",
    address: kz ? "Нысан мекенжайы" : "Адрес объекта",
    message: kz ? "Өтініш мәтіні" : "Текст обращения",
    consent: kz ? "Келісім" : "Согласие",
  };

  function validate() {
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    const value = (field: Field) => String(data.get(field) ?? "").trim();
    const next: Errors = {};

    if (value("name").length < 2) next.name = kz ? "Кемінде 2 таңба енгізіңіз." : "Укажите не менее 2 символов.";
    const contact = value("contact");
    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    const phone = /^[+\d()\s-]+$/.test(contact) && contact.replace(/\D/g, "").length >= 10 && contact.replace(/\D/g, "").length <= 15;
    if (!email && !phone) next.contact = kz ? "Жарамды телефон нөмірін немесе e-mail енгізіңіз." : "Укажите корректный телефон или e-mail.";
    if (!value("topic")) next.topic = kz ? "Тақырыпты таңдаңыз." : "Выберите тему.";
    if (!value("address")) next.address = kz ? "Нысан мекенжайын енгізіңіз." : "Укажите адрес объекта.";
    if (value("message").length < 10) next.message = kz ? "Кемінде 10 таңба енгізіңіз." : "Напишите не менее 10 символов.";
    if (!data.get("consent")) next.consent = kz ? "Келісімді растаңыз." : "Подтвердите согласие.";

    setErrors(next);
    const hasErrors = Object.keys(next).length > 0;
    setBlocked(!hasErrors);
    if (hasErrors) requestAnimationFrame(() => summaryRef.current?.focus());
  }

  function clear(field: Field) {
    setBlocked(false);
    setErrors(current => current[field] ? { ...current, [field]: undefined } : current);
  }

  return <form ref={formRef} className="form" onSubmit={event => { event.preventDefault(); validate(); }} noValidate>
    {Object.keys(errors).length > 0 && <div className="formSummary" ref={summaryRef} tabIndex={-1} role="alert">
      <strong>{t.validation}</strong>
      <ul>{(Object.entries(errors) as [Field, string][]).map(([field, message]) => <li key={field}><a href={`#${field}`}>{fieldLabels[field]}: {message}</a></li>)}</ul>
    </div>}
    <div className="field">
      <label htmlFor="name">{kz ? "Аты-жөні" : "Имя"} *</label>
      <input id="name" name="name" autoComplete="name" required minLength={2} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} onChange={() => clear("name")} />
      {errors.name && <p id="name-error" className="error">{errors.name}</p>}
    </div>
    <div className="field">
      <label htmlFor="contact">{kz ? "Кері байланыс тәсілі" : "Способ обратной связи"} *</label>
      <input id="contact" name="contact" autoComplete="email" required placeholder={kz ? "Телефон немесе e-mail" : "Телефон или e-mail"} aria-invalid={!!errors.contact} aria-describedby={errors.contact ? "contact-error" : undefined} onChange={() => clear("contact")} />
      {errors.contact && <p id="contact-error" className="error">{errors.contact}</p>}
    </div>
    <div className="field">
      <label htmlFor="topic">{kz ? "Тақырып" : "Тема"} *</label>
      <select id="topic" name="topic" required defaultValue="" aria-invalid={!!errors.topic} aria-describedby={errors.topic ? "topic-error" : undefined} onChange={() => clear("topic")}>
        <option value="" disabled>{kz ? "Таңдаңыз" : "Выберите"}</option>
        <option value="water">{t.water}</option>
        <option value="sewer">{t.sewer}</option>
        <option value="other">{kz ? "Басқа" : "Другое"}</option>
      </select>
      {errors.topic && <p id="topic-error" className="error">{errors.topic}</p>}
    </div>
    <div className="field">
      <label htmlFor="address">{kz ? "Нысан мекенжайы" : "Адрес объекта"} *</label>
      <input id="address" name="address" autoComplete="street-address" required aria-invalid={!!errors.address} aria-describedby={errors.address ? "address-error" : undefined} onChange={() => clear("address")} />
      {errors.address && <p id="address-error" className="error">{errors.address}</p>}
    </div>
    <div className="field">
      <label htmlFor="message">{kz ? "Өтініш мәтіні" : "Текст обращения"} *</label>
      <textarea id="message" name="message" required minLength={10} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} onChange={() => clear("message")} />
      {errors.message && <p id="message-error" className="error">{errors.message}</p>}
    </div>
    <label className="check"><input type="checkbox" name="consent" required aria-invalid={!!errors.consent} aria-describedby={errors.consent ? "consent-error" : undefined} onChange={() => clear("consent")} /> <span>{kz ? "Дербес деректерді өңдеу саясатының жобасымен таныстым" : "Ознакомлен(а) с проектом политики обработки персональных данных"} <Link href={`/${lang}/privacy`}>{t.nav.privacy}</Link></span></label>
    {errors.consent && <p id="consent-error" className="error checkError">{errors.consent}</p>}
    <button className="primaryBtn" type="button" onClick={validate}>{t.send}</button>
    {blocked && <div className="notice formBlocked" role="alert">{t.formBlocked} <Link href={`/${lang}/contacts`}>{t.nav.contacts} →</Link></div>}
  </form>;
}
