const form = document.querySelector("#registration");
if (form) {
  const fields = form.querySelector(".form-controls");
  const contact = form.elements.contact;
  const name = form.elements.namedItem("name");
  const submit = form.querySelector("button");
  const status = form.querySelector(".form-status");
  let pending = false;
  let accepted = false;
  let requestId;
  let previous;
  const contactValues = { phone: "", email: "" };
  let contactKind = form.elements.kind.value;
  function validate() {
    name.setCustomValidity(name.value.trim() ? "" : "Укажите, как к вам обращаться.");
    const value = contact.value.trim();
    const phone = form.elements.kind.value === "phone";
    const valid = phone ? /^\+?[\d ()-]+$/.test(value) && /^\d{7,15}$/.test(value.replace(/\D/g,"")) : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    contact.setCustomValidity(valid ? "" : phone ? "Введите номер из 7–15 цифр с кодом страны." : "Введите электронную почту с доменом.");
  }
  form.addEventListener("input", validate);
  form.addEventListener("change", event => {
    if (event.target.name !== "kind") return;
    contactValues[contactKind] = contact.value;
    contactKind = event.target.value;
    const phone = contactKind === "phone";
    contact.type = phone ? "tel" : "email";
    if (contact.autocomplete !== "off") contact.autocomplete = contact.type;
    contact.value = contactValues[contactKind];
    form.querySelector("#contact-label").textContent = phone ? "Номер телефона" : "Электронная почта";
    form.querySelector("#contact-hint").textContent = phone ? "Укажите номер с кодом страны." : "На этот адрес рекрутер сможет ответить.";
    validate();
  });
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (pending || accepted) return;
    validate();
    if (!form.reportValidity()) return;
    const body = { name: name.value.trim(), kind: form.elements.kind.value, contact: contact.value.trim(), direction: form.elements.direction.value,
      comment: form.elements.comment.value.trim(), consent: form.elements.consent.checked, consentVersion: form.dataset.version };
    const fingerprint = JSON.stringify(body);
    if (previous !== fingerprint) { requestId = crypto.randomUUID(); previous = fingerprint; }
    pending = true;
    fields.disabled = submit.disabled = true;
    status.textContent = "Отправляем анкету…";
    status.dataset.state = "pending";
    try {
      const response = await fetch(form.action, { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify({...body,requestId}), credentials: "omit", referrerPolicy:"no-referrer", redirect:"error", signal:AbortSignal.timeout(20000) });
      if (!response.ok || (await response.json()).accepted !== true) throw new Error();
      accepted = true;
      form.reset();
      fields.hidden = submit.hidden = true;
      status.dataset.state = "success";
      status.textContent = "Анкета получена";
      status.focus();
    } catch {
      status.dataset.state = "error";
      status.textContent = "Не удалось подтвердить приём анкеты. Поля сохранены. Попробуйте отправить ещё раз.";
      fields.disabled = submit.disabled = false;
      status.focus();
    } finally { pending = false; }
  });
  submit.disabled = false;
}
