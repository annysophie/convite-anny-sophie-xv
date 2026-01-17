document.addEventListener("DOMContentLoaded", () => {
  const mql = window.matchMedia("(max-width: 600px)");

  function initDesktop() {
    const pageIds = ["page-1","page-3","page-5","page-7","page-9","page-11"];
    const pages = pageIds.map(id => document.getElementById(id)).filter(Boolean);
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    if (!pages.length || !prevBtn || !nextBtn) return;

    const idx = () => pages.findIndex(p => p.checked);

    const update = () => {
      const i = idx();
      prevBtn.style.display = i <= 0 ? "none" : "";
      nextBtn.style.display = i >= pages.length - 1 ? "none" : "";

      const last = pages.length - 1;

      if (i <= 0) {
        prevBtn.style.display = "none";
        nextBtn.style.display = "inline-flex";
        nextBtn.textContent = "✨ Abrir o Convite";
      } else if (i === 1) {
        nextBtn.style.display = "inline-flex";
        prevBtn.style.display = "inline-flex";
        prevBtn.textContent = "🌙 Fechar o Livro";
        nextBtn.textContent = "Próximo ▶";
      } else if (i === last) {
        nextBtn.style.display = "none";
        prevBtn.style.display = "inline-flex";
        prevBtn.textContent = "◀ Anterior";
      } else {
        prevBtn.style.display = "inline-flex";
        nextBtn.style.display = "inline-flex";
        prevBtn.textContent = "◀ Anterior";
        nextBtn.textContent = "Próximo ▶";
      }
    };

    const go = (d) => {
      let i = idx();
      if (i < 0) i = 0;
      const j = Math.max(0, Math.min(pages.length - 1, i + d));
      pages[j].checked = true;
      update();
    };

    prevBtn.addEventListener("click", (e) => { e.preventDefault(); go(-1); });
    nextBtn.addEventListener("click", (e) => { e.preventDefault(); go(1); });

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    });

    pages.forEach(p => p.addEventListener("change", update));
    update();
  }

  function initMobile() {
    const book = document.querySelector(".book");
    if (!book) return;

    // Monta lista de páginas em "ordem de leitura" no mobile:
    // para cada input, temos 2 labels; no mobile queremos mostrar a 2ª antes da 1ª.
    const kids = Array.from(book.children);
    const pages = [];

    for (let i = 0; i < kids.length; i++) {
      const el = kids[i];
      if (el.matches && el.matches('input[type="radio"][name="page"]')) {
        const l1 = kids[i + 1];
        const l2 = kids[i + 2];

        const isPage = (x) => x && x.matches && x.matches("label.page");
        if (isPage(l1)) pages.push(l1);
        if (isPage(l2)) pages.push(l2);
      }
    }

    // Filtra capas/páginas vazias (ex.: capas finais sem conteúdo)
    const hasContent = (label) => {
      const txt = (label.textContent || "").replace(/\s+/g, " ").trim();
      const hasImg = !!label.querySelector("img");
      const hasBtn = !!label.querySelector("a,button");
      return hasImg || hasBtn || txt.length > 0;
    };

    const mobilePages = pages.filter(hasContent);

    if (!mobilePages.length) return;

    let current = 0;

    const setActive = (idx) => {
      mobilePages.forEach(p => p.classList.remove("is-active"));
      current = Math.max(0, Math.min(mobilePages.length - 1, idx));
      mobilePages[current].classList.add("is-active");
    };

    const go = (d) => setActive(current + d);

    book.addEventListener("click", (e) => {
      // ignora cliques em links/botões/inputs (pra não quebrar "Abrir no mapa", etc)
      if (e.target.closest("a, button, input, textarea, select")) return;

      const page = e.target.closest("label.page");
      if (!page) return;

      // opcional: se clicar na metade esquerda, volta; metade direita, avança
      const rect = page.getBoundingClientRect();
      const x = (e.clientX ?? (e.touches?.[0]?.clientX)) - rect.left;
      const leftSide = x < rect.width * 0.35;

      go(leftSide ? -1 : 1);
    }, { passive: true });

    // expõe pra swipe.js se você quiser usar lá
    window.__bookMobileGo = go;

    // teclado
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    });

    // swipe simples (se seu swipe.js já faz isso, pode remover este bloco)
    let startX = 0, startY = 0, active = false;

    book.addEventListener("touchstart", (e) => {
      if (!e.touches || e.touches.length !== 1) return;
      active = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    book.addEventListener("touchend", (e) => {
      if (!active) return;
      active = false;

      const t = e.changedTouches && e.changedTouches[0];
      if (!t) return;

      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      // ignora swipe mais vertical do que horizontal
      if (Math.abs(dy) > Math.abs(dx)) return;

      const threshold = 40;
      if (dx <= -threshold) go(1);
      if (dx >= threshold) go(-1);
    }, { passive: true });

    // começa na primeira “página real”
    setActive(0);
  }

  function boot() {
    if (mql.matches) initMobile();
    else initDesktop();
  }

  boot();
});
