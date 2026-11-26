import { agency, formEndpoint, isDemo } from "../config/agency";
import { directions } from "./content";
import { ArrowRight } from "lucide-react";

export default function Registration() {
  return <form id="registration" className="registration" method="post" action={formEndpoint} data-version={agency.consentVersion} autoComplete="off">
    <fieldset className="form-controls"><legend className="sr-only">Анкета для рекрутера</legend>
      {isDemo && <p className="demo-form-note"><strong>Тестовая анкета.</strong> Используйте только вымышленные сведения. Запись сохраняется на этом компьютере.</p>}
      <label htmlFor="candidate-name">Как к вам обращаться</label><input id="candidate-name" name="name" autoComplete={isDemo ? "off" : "name"} required maxLength={80}/>
      <fieldset className="contact-choice"><legend>Способ связи</legend><label><input type="radio" name="kind" value="phone" defaultChecked/>Телефон</label><label><input type="radio" name="kind" value="email"/>Электронная почта</label></fieldset>
      <label htmlFor="candidate-contact" id="contact-label">Номер телефона</label><input id="candidate-contact" name="contact" type="tel" autoComplete={isDemo ? "off" : "tel"} required maxLength={254} aria-describedby="contact-hint"/><small id="contact-hint">Укажите номер с кодом страны.</small>
      <label htmlFor="candidate-direction">Направление работы</label><select id="candidate-direction" name="direction" required defaultValue=""><option value="" disabled>Выберите направление</option>{[...directions.map(({title})=>title),"Пока выбираю"].map(name=><option key={name}>{name}</option>)}</select>
      <label htmlFor="candidate-note">Комментарий <span>· необязательно</span></label><textarea id="candidate-note" name="comment" maxLength={500} rows={3}/>
      <details className="consent-text"><summary>Текст согласия на обработку данных</summary><p>{agency.consentText}</p></details>
      <a className="document-link" href="/personal-data/">Политика обработки персональных данных</a>
      <label className="check-line"><input type="checkbox" name="consent" required/>Соглашаюсь на обработку данных для связи по анкете</label>
    </fieldset>
    <p role="status" aria-live="polite" tabIndex={-1} className="form-status"></p>
    <button type="submit" disabled className="action primary">Отправить анкету<ArrowRight size={17} aria-hidden="true"/></button>
    <noscript><p>Включите JavaScript для отправки анкеты.</p><a href="/#contacts">Контакты агентства</a></noscript>
  </form>;
}
