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
    const target = e.target;
    if (target && target.dataset && target.dataset.close === "true") {
      closeModal();
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = nameInput.value.trim();
    if (fullName.length < 5) {
      msg.textContent = "Por favor, digite seu nome completo.";
      return;
    }

    // Aqui você decide o destino:
    // 1) Enviar para um endpoint (Google Forms, Sheets, API, etc)
    // 2) Ou só exibir confirmação local

    msg.textContent = "Enviando...";

    try {
      // EXEMPLO (sem backend): só confirma e fecha
      await new Promise((r) => setTimeout(r, 600));

      msg.textContent = "Presença confirmada! 💙";
      setTimeout(() => {
        closeModal();
        form.reset();
      }, 900);
    } catch (err) {
      msg.textContent = "Não foi possível enviar agora. Tente novamente.";
    }
  });
})();