const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navLinks?.classList.toggle("open", !isOpen);
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

/* ─── Theme toggle with View Transitions (clip-path from button) ─── */
(function () {
  const KEY = "sahla-theme";
  const html = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  let transitioning = false;

  function getPreferredTheme() {
    const stored = localStorage.getItem(KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  function applyTheme(theme) {
    html.setAttribute("data-theme", theme);
    toggle.setAttribute("aria-label", "Switch to " + (theme === "dark" ? "light" : "dark") + " mode");
  }

  applyTheme(getPreferredTheme());

  toggle.addEventListener("click", function () {
    if (transitioning) return;

    const current = html.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";

    function commit() {
      applyTheme(next);
      localStorage.setItem(KEY, next);
    }

    if (!document.startViewTransition) {
      commit();
      return;
    }

    // Clip-path origin from button center
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var rect = toggle.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    var maxR = Math.hypot(Math.max(cx, vw - cx), Math.max(cy, vh - cy));

    transitioning = true;
    html.style.setProperty("--vt-clip-from", "circle(0% at " + cx + "px " + cy + "px)");

    var transition = document.startViewTransition(commit);

    transition.ready.then(function () {
      html.animate(
        {
          clipPath: [
            "circle(0% at " + cx + "px " + cy + "px)",
            "circle(" + maxR + "px at " + cx + "px " + cy + "px)",
          ],
        },
        {
          duration: 600,
          easing: "ease-in-out",
          fill: "forwards",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });

    transition.finished.finally(function () {
      transitioning = false;
      html.style.removeProperty("--vt-clip-from");
    });
  });
})();

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reducedMotion) {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("visible"));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 3, 2) * 90}ms`;
    observer.observe(element);
  });
}
