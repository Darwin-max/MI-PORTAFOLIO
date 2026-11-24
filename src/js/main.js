const html = document.documentElement;
const botonTema = document.getElementById("modo-btn");
const metaTema = document.querySelector('meta[name="theme-color"]');
const botonMenu = document.getElementById("menu-btn");
const menu = document.getElementById("menu-principal");
const header = document.getElementById("header");
const enlacesNav = Array.from(document.querySelectorAll(".nav-link"));
const secciones = Array.from(document.querySelectorAll("main section[id]"));

window.__revelarIniciado = true;

/* ===== Tema claro / oscuro ===== */
function actualizarTemaUI() {
  const esClaro = html.classList.contains("tema-claro");

  if (botonTema) {
    botonTema.setAttribute(
      "aria-label",
      esClaro ? "Activar modo oscuro" : "Activar modo claro"
    );
  }

  if (metaTema) {
    metaTema.setAttribute("content", esClaro ? "#f4fafb" : "#070c0f");
  }
}

if (botonTema) {
  botonTema.addEventListener("click", () => {
    const esClaro = html.classList.toggle("tema-claro");

    try {
      localStorage.setItem("tema-claro", String(esClaro));
    } catch (error) {
      /* El cambio de tema sigue funcionando aunque no se pueda guardar. */
    }

    actualizarTemaUI();
  });
}

actualizarTemaUI();

/* ===== Menú móvil ===== */
function establecerMenu(abierto, devolverFoco = false) {
  if (!botonMenu || !menu) return;

  const estabaAbierto = menu.classList.contains("abierto");

  menu.classList.toggle("abierto", abierto);
  botonMenu.setAttribute("aria-expanded", String(abierto));
  botonMenu.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");

  if (!abierto && devolverFoco && estabaAbierto) {
    const focoDentroDelMenu = menu.contains(document.activeElement);
    if (focoDentroDelMenu || document.activeElement === botonMenu) {
      botonMenu.focus();
    }
  }
}

if (botonMenu && menu) {
  botonMenu.addEventListener("click", () => {
    const abierto = botonMenu.getAttribute("aria-expanded") === "true";
    establecerMenu(!abierto);
  });

  menu.querySelectorAll("a").forEach((enlace) => {
    enlace.addEventListener("click", () => establecerMenu(false));
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && menu.classList.contains("abierto")) {
      establecerMenu(false, true);
    }
  });

  document.addEventListener("click", (evento) => {
    if (!menu.classList.contains("abierto")) return;
    if (menu.contains(evento.target) || botonMenu.contains(evento.target)) return;
    establecerMenu(false);
  });

  const consultaEscritorio = window.matchMedia("(min-width: 901px)");
  const alCambiarPantalla = (evento) => {
    if (evento.matches) establecerMenu(false);
  };

  if (consultaEscritorio.addEventListener) {
    consultaEscritorio.addEventListener("change", alCambiarPantalla);
  } else if (consultaEscritorio.addListener) {
    consultaEscritorio.addListener(alCambiarPantalla);
  }
}

/* ===== Header al hacer scroll ===== */
function actualizarHeader() {
  if (!header) return;
  header.classList.toggle("header--compacto", window.scrollY > 8);
}

window.addEventListener("scroll", actualizarHeader, { passive: true });
actualizarHeader();

/* ===== Sección activa en la navegación ===== */
if ("IntersectionObserver" in window && secciones.length > 0) {
  const observadorSecciones = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;

        const idActual = `#${entrada.target.id}`;

        enlacesNav.forEach((enlace) => {
          const estaActivo = enlace.getAttribute("href") === idActual;

          enlace.classList.toggle("activo", estaActivo);

          if (estaActivo) {
            enlace.setAttribute("aria-current", "location");
          } else {
            enlace.removeAttribute("aria-current");
          }
        });
      });
    },
    { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
  );

  secciones.forEach((seccion) => observadorSecciones.observe(seccion));
}

/* ===== Aparición suave de bloques ===== */
const prefiereMovimientoReducido = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
const bloquesReveal = Array.from(document.querySelectorAll(".reveal"));

if (
  prefiereMovimientoReducido ||
  !("IntersectionObserver" in window) ||
  bloquesReveal.length === 0
) {
  bloquesReveal.forEach((bloque) => bloque.classList.add("visible"));
} else {
  const observadorReveal = new IntersectionObserver(
    (entradas, observador) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visible");
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  bloquesReveal.forEach((bloque) => observadorReveal.observe(bloque));
}

/* ===== Año del footer ===== */
const anio = document.getElementById("anio");
if (anio) {
  anio.textContent = String(new Date().getFullYear());
}
