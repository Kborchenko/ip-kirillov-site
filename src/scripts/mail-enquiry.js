for (const form of document.querySelectorAll("form.mail-enquiry")) {
  const editor = form.querySelector("[data-editor]");
  const draft = form.querySelector("[data-draft]");
  const preview = draft.querySelector("[data-body]");
  const status = draft.querySelector("[role=status]");
  const fields = Array.from(editor.querySelectorAll("input, textarea"));
  const { vacancy, person, phone, message, consent } = form.elements;

  function validate(field) {
    const value = field.value.trim();
    let error = "";
    if (field.required && !value) error = field === person ? "Укажите ваше имя." : "Укажите вакансию или направление.";
    if (field === consent && !consent.checked) error = "Чтобы подготовить письмо, отметьте согласие на обработку данных.";
    if (field === phone && value && (!/^\+?[\d ()-]+$/.test(value) || !/^\d{7,15}$/.test(value.replace(/\D/g, "")))) {
      error = "Введите номер из 7–15 цифр или оставьте поле пустым.";
    }
    const notice = document.getElementById(field.getAttribute("aria-describedby"));
    notice.textContent = error;
    notice.hidden = !error;
    field.setAttribute("aria-invalid", String(Boolean(error)));
    return !error;
  }

  form.addEventListener("input", event => {
    if (event.target.getAttribute("aria-invalid") === "true") validate(event.target);
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const invalid = fields.filter(field => !validate(field));
    if (invalid.length) {
      invalid[0].focus();
      return;
    }
    const subject = form.dataset.subject + " — " + vacancy.value.trim();
    const lines = ["Здравствуйте!", "", "Вакансия: " + vacancy.value.trim(), "Имя: " + person.value.trim()];
    if (phone.value.trim()) lines.push("Телефон для связи: " + phone.value.trim());
    if (message.value.trim()) lines.push("", message.value.trim());
    lines.push("", "Отметка в форме: согласие дано.",
      form.dataset.consentTitle + " (редакция " + form.dataset.consentRevision + ").");
    preview.value = lines.join("\n");
    draft.querySelector("[data-compose]").href = form.dataset.mail + "?subject=" + encodeURIComponent(subject)
      + "&body=" + encodeURIComponent(preview.value.replace(/\r?\n/g, "\r\n"));
    status.textContent = "";
    editor.disabled = editor.hidden = true;
    draft.hidden = false;
    draft.querySelector("h3").focus();
  });

  draft.querySelector("[data-copy]").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(preview.value);
      status.textContent = "Текст скопирован. Вставьте его в письмо.";
    } catch {
      preview.focus();
      preview.select();
      status.textContent = "Текст выделен. Выберите «Копировать» в меню устройства.";
    }
  });
  draft.querySelector("[data-edit]").addEventListener("click", () => {
    draft.hidden = true;
    editor.disabled = editor.hidden = false;
    vacancy.focus();
  });
  form.noValidate = true;
  editor.disabled = editor.hidden = false;
}
