(() => {
  const book = document.querySelector(".book");
  if (!book) return;

  const radios = Array.from(book.querySelectorAll('input[type="radio"][name="page"]'));
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  const getIndex = () => radios.findIndex(r => r.checked);
  const go = (dir) => {
    const i = getIndex();
    if (i < 0) return;
    const next = radios[i + dir];
    if (next) next.checked = true;

    // se seu nav.js atual atualiza botões/estado, dispara clique também (opcional)
    // if (dir === 1 && nextBtn) nextBtn.click();
    // if (dir === -1 && prevBtn) prevBtn.click();
  };

  let startX = 0, startY = 0, tracking = false;

  // Importante: não bloquear scroll vertical
  book.addEventListener("touchstart", (e) => {
    if (!e.touches || e.touches.length !== 1) return;
    tracking = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  book.addEventListener("touchend", (e) => {
    if (!tracking) return;
    tracking = false;

    const t = e.changedTouches && e.changedTouches[0];
    if (!t) return;

    const dx = t.clientX - startX;
    const dy = t.clientY - startY;

    // se foi mais vertical que horizontal, ignora (scroll)
    if (Math.abs(dy) > Math.abs(dx)) return;

    // limiar do swipe
    if (Math.abs(dx) < 45) return;

    // swipe esquerdo = próximo / swipe direito = anterior
    if (dx < 0) go(+1);
    else go(-1);
  }, { passive: true });
})();
