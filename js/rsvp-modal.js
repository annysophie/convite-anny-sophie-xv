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

(function () {
    const addBtn = document.getElementById("addCompanionBtn");
    const list = document.getElementById("companionsList");

    let count = 0;
    const MAX = 10; // se quiser limitar

    function addCompanionInput() {
      if (count >= MAX) return;

      count += 1;

      const row = document.createElement("div");
      row.className = "companion-row";

      const inputId = `companion_${count}`;

      row.innerHTML = `
        <input
          name="companions[]"
          type="text"
          class="js-autocomplete"
          placeholder="Nome do acompanhante"
          autocomplete="off"
        />
        <button type="button" class="remove-companion" aria-label="Remover acompanhante">✕</button>
      `;

      row.querySelector(".remove-companion").addEventListener("click", () => {
        row.remove();
        // opcional: diminuir count? (normalmente não precisa)
      });

      list.appendChild(row);

      // já foca no input novo
      row.querySelector("input").focus();
    }

    addBtn.addEventListener("click", addCompanionInput);
  })();

(() => {
  /* MOCK */
  const NAMES = [
    "Maria Aparecida Silva",
    "João Pedro Souza",
    "Ana Carolina Lima",
    "Bruno Henrique Santos",
    "Camila Oliveira",
    "Carlos Eduardo Rocha",
    "Fernanda Almeida",
    "Gabriel Martins",
    "Juliana Costa",
    "Lucas Pereira"
  ];

  const box = document.getElementById("autocompleteBox");
  let activeInput = null;
  let activeIndex = -1;
  let items = [];

  const norm = (s) =>
    s.toLowerCase()
     .normalize("NFD")
     .replace(/[\u0300-\u036f]/g, "");

  function close(){
    box.classList.remove("is-open");
    box.innerHTML = "";
    activeIndex = -1;
    items = [];
  }

  function positionBox(input){
    const r = input.getBoundingClientRect();
    box.style.width = r.width + "px";
    box.style.left = r.left + window.scrollX + "px";
    box.style.top  = r.bottom + window.scrollY + 8 + "px";
  }

  function render(list){
    box.innerHTML = "";
    list.forEach((name, idx) => {
      const li = document.createElement("li");
      li.textContent = name;
      li.addEventListener("mousedown", e => {
        e.preventDefault();
        select(idx);
      });
      box.appendChild(li);
    });
    box.classList.add("is-open");
  }

  function select(idx){
    if (!activeInput || !items[idx]) return;
    activeInput.value = items[idx];
    close();
    activeInput.focus();
  }

  function update(){
    if (!activeInput) return;

    const q = norm(activeInput.value.trim());
    if (!q) return close();

    items = NAMES.filter(n => norm(n).includes(q)).slice(0, 8);
    if (!items.length) return close();

    positionBox(activeInput);
    render(items);
  }

  /* EVENT DELEGATION */
  document.addEventListener("focusin", e => {
    if (e.target.classList.contains("js-autocomplete")) {
      activeInput = e.target;
      update();
    }
  });

  document.addEventListener("input", e => {
    if (e.target === activeInput) update();
  });

  document.addEventListener("keydown", e => {
    if (!box.classList.contains("is-open")) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, items.length - 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        e.preventDefault();
        select(activeIndex);
      }
    } else if (e.key === "Escape") {
      close();
    }

    [...box.children].forEach((li, i) =>
      li.classList.toggle("is-active", i === activeIndex)
    );
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".js-autocomplete")) close();
  });
})();
