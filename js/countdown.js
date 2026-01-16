document.addEventListener("DOMContentLoaded", () => {
    const dEl = document.getElementById("cd-d");
    const hEl = document.getElementById("cd-h");
    const mEl = document.getElementById("cd-m");
    const sEl = document.getElementById("cd-s");
    const box = document.getElementById("countdown");
    if (!dEl || !hEl || !mEl || !sEl || !box) return;

    const target = new Date("2026-02-07T20:00:00-03:00").getTime();

    const pad = (n) => String(n).padStart(2, "0");

    function tick() {
    const now = Date.now();
    let diff = target - now;

    if (diff <= 0) {
        box.querySelector(".cd-title").textContent = "🎉 É hoje!";
        dEl.textContent = "00";
        hEl.textContent = "00";
        mEl.textContent = "00";
        sEl.textContent = "00";
        return;
    }

    const day = Math.floor(diff / 86400000); diff -= day * 86400000;
    const hr  = Math.floor(diff / 3600000);  diff -= hr  * 3600000;
    const min = Math.floor(diff / 60000);    diff -= min * 60000;
    const sec = Math.floor(diff / 1000);

    dEl.textContent = pad(day);
    hEl.textContent = pad(hr);
    mEl.textContent = pad(min);
    sEl.textContent = pad(sec);
    }

    tick();
    setInterval(tick, 1000);
});