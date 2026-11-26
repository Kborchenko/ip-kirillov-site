const toggle = document.getElementById("map-toggle");
const embed = document.getElementById("map-embed");

if (toggle && embed) {
  toggle.hidden = false;
  toggle.addEventListener("click", () => {
    const opening = embed.hidden;
    if (opening) {
      const frame = document.createElement("iframe");
      frame.title = embed.dataset.title;
      frame.referrerPolicy = "no-referrer";
      frame.src = embed.dataset.src;
      embed.replaceChildren(frame);
    } else {
      embed.replaceChildren();
    }
    embed.hidden = !opening;
    toggle.setAttribute("aria-expanded", String(opening));
    toggle.textContent = opening ? "Скрыть карту" : "Загрузить Яндекс Карту";
  });
}
