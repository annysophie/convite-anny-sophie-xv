(function () {
  const openBtn = document.getElementById("openRsvp");
  const modal = document.getElementById("rsvpModal");
  const nameInput = document.getElementById("rsvpName");
  const form = document.getElementById("rsvpForm");
  const msg = document.getElementById("rsvpMsg");

  if (!openBtn || !modal || !nameInput || !form) return;

  const openModal = () => {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    msg.textContent = "";
    setTimeout(() => nameInput.focus(), 50);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  openBtn.addEventListener("click", openModal);

  modal.addEventListener("click", (e) => {
    if (e.target?.dataset?.close === "true") closeModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = nameInput.value.trim();
    if (fullName.length < 5) {
      msg.textContent = "Digite seu nome completo.";
      return;
    }

    msg.textContent = "Enviando...";

    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzO9J8tWXWkiT9rg8-D1iYHWibRjVWCfpl5YIUwwn1ELFsvmArZWbHj96xKA430VSNa/exec";

    try {
      const res = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ name: fullName })
      });

      const json = await res.json();

      if (!json.ok) {
        msg.textContent = "Erro ao confirmar presença.";
        return;
      }

      msg.textContent = "Presença confirmada! 💙";
      setTimeout(() => {
        form.reset();
        closeModal();
      }, 900);

    } catch {
      msg.textContent = "Falha de conexão. Tente novamente.";
    }
  });
})();
