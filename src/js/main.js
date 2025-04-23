const btnModo = document.getElementById("modo-btn");
const iconoModo = document.getElementById("modo-icono");
// const videoFondo = document.getElementById("video-fondo");

window.addEventListener("DOMContentLoaded", () => {
  const modoGuardado = localStorage.getItem("modoOscuro") === "true";
  

  document.body.classList.toggle("light-mode", modoGuardado);
  
  iconoModo.src = modoGuardado ? "./src/storage/img/luna.png" : "./src/storage/img/sol.png";
  
  cambiarFondoVideo(modoGuardado);
});


btnModo.addEventListener("click", () => {
 
  const modoOscuroActivo = document.body.classList.toggle("light-mode");
  iconoModo.src = modoOscuroActivo ? "./src/storage/img/luna.png" : "./src/storage/img/sol.png";
  
 
  localStorage.setItem("modoOscuro", modoOscuroActivo);
  

cambiarFondoVideo(modoOscuroActivo);
});

// function cambiarFondoVideo(modoOscuro) {
//   if (modoOscuro) {
//     videoFondo.src = "/src/storage/img/claro.mp4"; 
//   } else {
//     videoFondo.src = "/src/storage/img/noche.mp4"; 
//   }
// }