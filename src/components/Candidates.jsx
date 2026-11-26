import { MessagesSquare, CalendarCheck, ClipboardPenLine, Plus, MapPin, Building2, UserRound } from "lucide-react";
import { InterviewPhoto } from "./IndexArtwork";
import ServiceCard from "./ServiceCard";
import DirectionCard from "./DirectionCard";
import CategoryList from "./CategoryList";
import { ActionLink, ContactLinks } from "./Common";
import { directions, questions } from "./content";
import { agency, place, formEndpoint, hasLegal, hasContacts, isDemo, mail, vacancies } from "../config/agency";
import Registration from "./Registration";
import MailEnquiry from "./MailEnquiry";

const services = [
  ["specialist", "Один специалист", "Например, нужен делопроизводитель, который уже работал с договорами.", "Познакомим вас с кандидатами и расскажем, какие задачи каждый из них решал сам."],
  ["team-hiring", "Команда к открытию", "Магазин будет работать в две смены. К открытию нужны и кассиры, и продавцы.", "Уточним у каждого, удобны ли адрес и смена, и составим расписание встреч."],
  ["responses", "Разбор откликов", "На вакансию уже откликнулись, а времени на звонки у руководителя нет.", "Поговорим с людьми из вашего списка. Вы узнаете, кто готов встретиться и у кого остались вопросы."],
  ["sourcing", "Поиск для рекрутера", "Ваша команда сама проводит интервью, но ей нужны новые кандидаты.", "Найдём людей с нужным опытом, расскажем о вакансии и передадим контакты тех, кому она интересна."],
];
const benefits = [
  ["Подходит ли смена", "Кассиру важно знать, во сколько закрывается магазин и успеет ли он домой. Назовём точный адрес и часы работы уже при первом звонке."],
  ["Что человек уже умеет", "В резюме кладовщика может стоять просто «работа на складе». Спросим, принимал ли он поставки, собирал ли заказы и пользовался ли сканером."],
  ["Когда ждать ответа", "После интервью уточним решение у руководителя и передадим его кандидату. Если впереди ещё одна встреча, договоримся о времени."],
];
const roles = [
  [ClipboardPenLine, "Разбираем рабочий день", "Просим руководителя описать обычную смену. Так становится понятно, что сотрудник должен уметь сразу, а чему его научат на месте."],
  [MessagesSquare, "Звоним кандидатам", "Рассказываем о работе и задаём вопросы об опыте. Записываем примеры, которые пригодятся руководителю на собеседовании."],
  [CalendarCheck, "Договариваемся о встрече", "Если вы поручили нам организацию интервью, подберём время для обеих сторон и уточним, куда прийти или как подключиться."],
];
function Block({id, title, children, style=""}) {
  return <section id={id} tabIndex={-1} aria-labelledby={id+"-title"} className={"home-block "+style}><div className="wrap"><h2 id={id+"-title"}>{title}</h2>{children}</div></section>;
}
function ContactSection() {
  return <Block id="contacts" title="Связаться с агентством" style="contact-section">
    <CategoryList className="contact-pair"><div><Building2 aria-hidden="true"/><h3>Компаниям</h3><p>Напишите, кто нужен, где предстоит работать и когда человек должен выйти.</p><ActionLink href="/employers/#start">Заявка работодателя</ActionLink></div>
      <div><UserRound aria-hidden="true"/><h3>Соискателям</h3><p>Расскажите, какую работу ищете и какой график вам удобен.</p><ActionLink href="/#candidates">{formEndpoint ? "Заполнить анкету" : mail ? "Написать рекрутеру" : "Как откликнуться"}</ActionLink></div></CategoryList>
    {(hasContacts || agency.hours || agency.receptionAddress) && <address className="contact-data"><ContactLinks/>{agency.hours && <span>{agency.hours}</span>}{agency.receptionAddress && !isDemo && <a href="/#map">Адрес приёма · {agency.receptionAddress}</a>}</address>}
    {hasLegal && <div className="legal-data" id="legal" tabIndex={-1}><h3>Реквизиты</h3>
      <p className="legal-name">{agency.legalName}</p>
      <CategoryList as="dl" className="business-details">{[["ИНН", agency.inn], ["ОГРНИП", agency.ogrnip], ["Юридический адрес", agency.legalAddress]].filter(([,value]) => value).map(([label,value]) =>
        <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</CategoryList>
    </div>}
  </Block>;
}
function MapSection() {
  if (!agency.receptionAddress) return null;
  const pin = place && [place.longitude, place.latitude].join(",");
  return <Block id="map" title={isDemo ? "Карта в демоверсии" : "Как нас найти"} style="map-section"><div className="map-layout"><div><p className="map-address"><MapPin aria-hidden="true"/>{agency.receptionAddress}</p>
    {place && <ActionLink href={"https://yandex.ru/maps/?rtext=~"+place.latitude+","+place.longitude+"&rtt=auto"} direction="external">Построить маршрут</ActionLink>}</div>
    {place && <div className="map-choice"><p>При загрузке Яндекс получит IP-адрес и сведения о браузере и может использовать cookies.</p>
      <a className="document-link" href="/cookies/">О файлах cookies</a>
      <button className="action secondary" type="button" id="map-toggle" aria-expanded="false" aria-controls="map-embed" hidden>Загрузить Яндекс Карту</button>
      <div id="map-embed" hidden data-title={"Карта · "+agency.receptionAddress} data-src={"https://yandex.ru/map-widget/v1/?ll="+pin+"&pt="+pin+",pm2rdm&z=16"} /></div>}</div></Block>;
}
export default function Candidates() {
  return <>
    <section id="welcome" tabIndex={-1} className="cover pattern-panel" aria-labelledby="welcome-title"><div className="wrap cover-layout">
      <div className="intro"><h1 id="welcome-title">Кого вы ищете <span>в команду?</span></h1>
        <p>Продавца в новый магазин, оператора на вечернюю линию или целую смену на склад. Возьмём на себя поиск и первые разговоры с кандидатами.</p>
        <div className="actions"><ActionLink primary href="/employers/#start">Ищу сотрудников</ActionLink><ActionLink href="/#candidates" direction="down">Ищу работу</ActionLink></div></div>
      <div className="archive-stage grid place-items-center">
        <img className="archive-box" src="/images/archive-box.webp" width="1050" height="788" fetchPriority="high" alt="Открытая бордовая шкатулка с бумажными карточками и латунной рамкой"/>
      </div>
    </div></section>
    <Block id="about" title="Кого мы подбираем"><p className="section-lead">Работаем с вакансиями в поддержке, продажах, торговле, офисе и на складе. Вот кого можно искать вместе с нами.</p>
      <ul className="sectors" id="directions" tabIndex={-1}>
        {directions.map(direction => <DirectionCard key={direction.id} {...direction} />)}
      </ul><ActionLink href="/about/">Подробнее об агентстве</ActionLink></Block>
    <Block id="hire" title="Чем можем помочь" style="tinted">
      <div className="hire-grid">{services.map(([id,title,need,result]) =>
        <ServiceCard key={id} id={id} kind={id} title={title} description={need}>{result}</ServiceCard>
      )}</div><ActionLink primary href="/employers/#start">Обсудить задачу</ActionLink>
    </Block>
    <Block id="advantages" title="Что важно выяснить до встречи"><CategoryList as="dl" className="benefits">{benefits.map(([title,body])=><div key={title}><dt>{title}</dt><dd>{body}</dd></div>)}</CategoryList></Block>
    <Block id="team" title="Как работает рекрутер" style="team-section"><div className="team-layout"><InterviewPhoto/><CategoryList className="roles">{roles.map(([Icon,title,body])=><article key={title}><Icon aria-hidden="true"/><div><h3>{title}</h3><p>{body}</p></div></article>)}</CategoryList></div></Block>
    <ContactSection/>
    <Block id="candidates" title="Если вы ищете работу" style="tinted"><p className="section-lead">{formEndpoint ? "Оставьте имя и удобный контакт. Укажите, какая работа вас интересует." : mail ? "Укажите вакансию и задайте вопрос рекрутеру. Здесь вы подготовите письмо, а отправите его из своей почты." : "Если вас заинтересовала вакансия, назовите её, когда будете связываться с рекрутером."}</p>
      <div className="candidate-layout"><div>{formEndpoint ? <Registration/> : mail ? <MailEnquiry/> : <div className="registration closed"><h3>Как откликнуться</h3>{hasContacts ? <ActionLink href="/#contacts">Контакты агентства</ActionLink> : <ActionLink href="/about/#interview">Как проходит первое интервью</ActionLink>}</div>}</div>
        <aside className="faq"><h3>Перед собеседованием</h3><CategoryList>{questions.map(([q,a])=><details key={q}><summary>{q}<Plus size={18} aria-hidden="true"/></summary><p>{a}</p></details>)}</CategoryList>{vacancies && <ActionLink href={vacancies} direction="external">Смотреть вакансии</ActionLink>}</aside>
      </div></Block>
    <MapSection/></>;
}
