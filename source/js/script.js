let nav = document.querySelector(".nav");
let toggle = document.querySelector(".nav__toggle");

nav.classList.remove("nav--nojs");

toggle.addEventListener("click", function () {
  if (nav.classList.contains("nav--closed")) {
    nav.classList.remove("nav--closed");
    nav.classList.add("nav--opened");
  } else {
    nav.classList.add("nav--closed");
    nav.classList.remove("nav--opened");
  }
});
