import { ArrowRight, ArrowUpRight, Copy } from "lucide-react";
import { agency, mail } from "../config/agency";
import { candidateConsent, employerConsent, legalRevision } from "./legalDocuments";

function Field({ prefix, name, label, optional = false, multiline = false, ...attributes }) {
  const id = prefix + "-" + name;
  const Control = multiline ? "textarea" : "input";
  return <div className="mail-field">
    <label htmlFor={id}>{label}{optional && <span> · по желанию</span>}</label>
    <Control id={id} name={name} required={!optional} aria-describedby={id + "-error"} {...attributes}/>
    <small id={id + "-error"} data-error hidden />
  </div>;
}

export default function MailEnquiry({ employer = false }) {
  const id = employer ? "hiring-mail" : "candidate-mail";
  const consent = employer ? employerConsent : candidateConsent;
  const title = employer ? "Заявка на подбор" : "Письмо рекрутеру";
  const heading = employer ? "Название вакансии" : "Какая работа вас интересует?";
  return <form id={id} className="mail-enquiry" aria-labelledby={id + "-title"} method="post"
    data-mail={mail} data-subject={employer ? "Заявка на подбор" : "Отклик на вакансию"}
    data-consent-title={consent.title} data-consent-revision={legalRevision.iso}>
    <fieldset data-editor disabled hidden>
      <legend id={id + "-title"} className={employer ? "sr-only" : undefined}>{title}</legend>
      <div className="mail-fields">
        <Field prefix={id} name="vacancy" label={heading} maxLength={100}
          placeholder={employer ? "Например, продавец-кассир" : "Например, оператор поддержки"}/>
        <div className="mail-pair">
          <Field prefix={id} name="person" label="Ваше имя" maxLength={80} autoComplete="name"/>
          <Field prefix={id} name="phone" label="Телефон для звонка" optional type="tel" maxLength={32} autoComplete="tel"/>
        </div>
        <Field prefix={id} name="message" label={employer ? "О вакансии" : "Что хотите уточнить?"}
          optional multiline rows={3} maxLength={500} placeholder={employer
            ? "В каком городе предстоит работать? Когда нужен сотрудник?"
            : "Можно спросить о графике, оплате или месте работы."}/>
      </div>
      <div className="mail-consent">
        <a className="document-link" href={"/" + consent.slug + "/"} target="_blank" rel="noopener">
          {consent.link}<span className="sr-only"> (откроется в новой вкладке)</span>
        </a>
        <label htmlFor={id + "-consent"}>
          <input id={id + "-consent"} name="consent" type="checkbox" required aria-describedby={id + "-consent-error"}/>
          <span>Даю согласие на обработку моих персональных данных {employer ? "для обсуждения этой заявки на подбор." : "для рассмотрения моего отклика."}</span>
        </label>
        <small id={id + "-consent-error"} data-error hidden/>
      </div>
      <button className="action primary" type="submit">Подготовить письмо<ArrowRight size={17} aria-hidden="true"/></button>
    </fieldset>
    <div data-draft hidden>
      <h3 tabIndex={-1}>Черновик готов</h3>
      <p className="mail-help">Откройте письмо в почте, проверьте его и нажмите «Отправить».</p>
      <p className="mail-to">Кому <a className="document-link" href={mail}>{agency.email}</a></p>
      <label className="sr-only" htmlFor={id + "-copy"}>Текст для отправки</label>
      <textarea className="mail-preview" id={id + "-copy"} data-body readOnly rows={5}/>
      <div className="draft-actions">
        <a className="action primary" data-compose>Открыть в почте<ArrowUpRight size={17} aria-hidden="true"/></a>
        <button type="button" className="action secondary" data-copy>Скопировать текст<Copy size={16} aria-hidden="true"/></button>
      </div>
      <p className="copy-status" role="status"></p>
      <button className="text-control" type="button" data-edit>Изменить письмо</button>
    </div>
    <noscript><p>Напишите напрямую на <a className="document-link" href={mail}>{agency.email}</a>.</p></noscript>
    <a className="mail-policy document-link" href="/personal-data/">Как мы обрабатываем данные</a>
  </form>;
}
