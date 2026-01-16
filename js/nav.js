document.addEventListener("DOMContentLoaded", () => {
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
});