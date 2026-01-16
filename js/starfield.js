function initStarfield() {
    const sky = document.getElementById("sky");
    if (!sky) return;

    let starCount = parseInt(sky.dataset.stars || "80", 10);

    if (window.matchMedia("(max-width: 600px)").matches) {
    starCount = Math.round(starCount * 0.4);
    }

    sky.innerHTML = "";

    const starChar = "✦";

    for (let i = 0; i < starCount; i++) {
    const el = document.createElement("div");
    el.className = "star";
    el.textContent = starChar;

    el.style.left = Math.random() * 100 + "vw";
    el.style.top = Math.random() * 100 + "vh";

    const size = gsap.utils.random(6, 18);
    el.style.fontSize = size + "px";

    sky.appendChild(el);

    function sparkle() {
        gsap.timeline()
        .set(el, { opacity: 0, scale: 0.2 })
        .to(el, {
            opacity: gsap.utils.random(0.6, 1),
            scale: gsap.utils.random(1.5, 2.4),
            duration: gsap.utils.random(0.25, 0.45),
            ease: "power2.out"
        })
        .to(el, {
            opacity: 0,
            scale: 0.1,
            duration: gsap.utils.random(0.4, 0.7),
            ease: "power1.inOut",
            delay: gsap.utils.random(0.2, 0.6),
            onComplete: sparkle
        });
    }

    gsap.delayedCall(Math.random() * 3, sparkle);
    }
}

document.addEventListener("DOMContentLoaded", initStarfield);