import { ActionLink, Steps } from "./Common";
import CategoryList from "./CategoryList";
import PageCover from "./PageCover";
import ServiceCard from "./ServiceCard";
import { hasContacts, hasLegal } from "../config/agency";

const interview = [
  ["Обсуждаем вакансию", "Рекрутер расскажет о работе. Можно сразу спросить про деньги, график и дорогу."],
  ["Разбираем пример", "Вас попросят вспомнить похожую задачу. Например, как вы разбирались с недостачей при приёмке товара или искали расхождение в документах."],
  ["Планируем встречу", "Если вам интересно продолжить, обсудим встречу с компанией. Окончательное предложение делает работодатель."],
];

export default function About() {
  return <>
    <PageCover panelClass="about-panel" title="Сначала знакомимся" accent="с работой"
      href="#interview" action="Как проходит интервью" image="/images/recruiter-notebook.webp"
      alt="Раскрытый блокнот рекрутера в бордовом переплёте с перьевой ручкой на странице">
      Прежде чем звонить кандидатам, говорим с тем, кто ждёт нового сотрудника. Просим описать обычный день, показать самые частые задачи и объяснить, где новичку понадобится помощь.
    </PageCover>
    <section className="wrap section-gap"><h2>Что выясняем до поиска</h2>
      <div className="service-grid grid gap-4 md:grid-cols-2">
        <ServiceCard kind="specialist" title="Что скрывается за названием вакансии"
          description="В одном интернет-магазине оператор принимает заказы по телефону. В другом почти весь день отвечает в чате и оформляет возвраты.">
          Название должности одинаковое, а искать предстоит людей с разным опытом.
        </ServiceCard>
        <ServiceCard kind="responses" title="О чём спрашиваем руководителя"
          description="Кто покажет новичку рабочее место? Что ему поручат в первую смену? Какие ошибки обходятся дорого?">
          Отдельно уточняем адрес, график и оплату, чтобы у кандидата были ответы ещё до поездки на собеседование.
        </ServiceCard>
      </div>
      <div className="actions"><ActionLink href="/#directions">Кого мы подбираем</ActionLink></div>
    </section>
    <Steps id="interview" title="Как проходит первое интервью" items={interview}/>
    <section className="wrap section-gap"><h2>Кто за что отвечает</h2>
      <CategoryList as="dl" className="responsibilities mt-6 md:grid-cols-3">
        <div><dt>Агентство</dt><dd>Ведём поиск, разговариваем с кандидатами и держим связь между ними и компанией.</dd></div>
        <div><dt>Работодатель</dt><dd>Знакомит с будущей командой, отвечает за условия работы и решает, кому предложить место.</dd></div>
        <div><dt>Кандидат</dt><dd>Выбирает, продолжать ли знакомство и принимать ли предложение.</dd></div>
      </CategoryList>
    </section>
    <section className="wrap"><div className="request-panel pattern-panel about-contact">
      <div className="request-intro"><h2>{hasContacts ? "Как связаться с агентством" : hasLegal ? "Реквизиты агентства" : "Соискателям и работодателям"}</h2>
        {hasContacts && <p>Уже общались с рекрутером? Назовите вакансию и напомните, когда вы разговаривали. Так будет проще найти переписку.</p>}
      </div>
      <div className="actions">
        {hasContacts && <ActionLink primary href="/#contacts">Контакты агентства</ActionLink>}
        {hasLegal && <ActionLink primary={!hasContacts} href="/#legal">Сведения об ИП</ActionLink>}
        {!hasContacts && !hasLegal && <><ActionLink primary href="/#candidates">Регистрация соискателя</ActionLink><ActionLink href="/employers/">Услуги работодателям</ActionLink></>}
      </div>
    </div></section>
  </>;
}
