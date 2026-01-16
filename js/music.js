document.addEventListener("DOMContentLoaded", () => {
    const book = document.querySelector(".book");
    const audio = document.getElementById("bg-music");

    if (!book || !audio) return;

    const MAX_VOLUME = 0.02;
    let started = false;

    audio.volume = MAX_VOLUME;
    audio.addEventListener("volumechange", () => {
    if (audio.volume > MAX_VOLUME) audio.volume = MAX_VOLUME;
    });

    book.addEventListener("click", () => {
    if (started) return;

    audio.volume = MAX_VOLUME;
    audio.play().catch(() => {});
    started = true;
    });
});