const valorPrestamo = document.getElementById("valorPrestamo");
const valorInteres = document.getElementById("valorInteres");
const aniosaPagar = document.getElementById("aniosaPagar");
const botonCalcular = document.getElementById("botonCalcular");
const cuotaPorMes = document.getElementById("cuotaPorMes");
const totalaPagar = document.getElementById("totalaPagar");
const intereses = document.getElementById("intereses");
const botonAgregar = document.getElementById("botonAgregar");
const tbody = document.getElementById("tbody");
const botonLimpiar = document.getElementById("botonLimpiar");
let localStorage = JSON.parse(window.localStorage.getItem("array"));
let compraOficial = document.getElementById("compraOficial");
let compraBlue = document.getElementById("compraBlue");
let compraLiqui = document.getElementById("compraLiqui");
let ventaOficial = document.getElementById("ventaOficial");
let ventaLiqui = document.getElementById("ventaLiqui");
let ventaBlue = document.getElementById("ventaBlue");

document.addEventListener("DOMContentLoaded", function () {
  let localStorage = JSON.parse(window.localStorage.getItem("array"));
  if (localStorage) {
    localStorage.forEach(function (elemento) {
      let nuevoPrestamoHTML = document.createElement("tr");
      nuevoPrestamoHTML.innerHTML = `<td>${
        localStorage.indexOf(elemento) + 1
      }</td><td>$${elemento.valorPrestamo}</td><td>$${
        elemento.totalAPagar
      }</td><td>$${elemento.cuotaPorMes}</td>`;
      tbody.appendChild(nuevoPrestamoHTML);
    });
  }

  $.ajax({
    url: "https://www.dolarsi.com/api/api.php?type=valoresprincipales",
    type: "GET",
    crossDomain: true,
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    success: function (data) {
      compraOficial.innerText = "$" + data[0].casa.compra;
      compraBlue.innerText = "$" + data[1].casa.compra;
      compraLiqui.innerText = "$" + data[3].casa.compra;
      ventaOficial.innerText = "$" + data[0].casa.venta;
      ventaBlue.innerText = "$" + data[1].casa.venta;
      ventaLiqui.innerText = "$" + data[3].casa.venta;
    },
  });
});

botonCalcular.addEventListener("click", function (event) {
  event.preventDefault();
  if (
    valorPrestamo.value <= 0 ||
    aniosaPagar.value <= 0 ||
    !valorInteres.value
  ) {
    Toastify({
      text: "Error: no es posible calcular el prestamo con los valores ingresados",
      duration: 3000,
      style: {
        background: "red",
      },
    }).showToast();
  } else {
    let totalaPagarResultado =
      parseFloat(valorPrestamo.value) +
      (parseFloat(valorInteres.value) * parseFloat(valorPrestamo.value)) / 100;
    totalaPagar.value = totalaPagarResultado;
    cuotaPorMes.value =
      totalaPagarResultado / (parseFloat(aniosaPagar.value) * 12);
    intereses.value =
      (parseFloat(valorInteres.value) * parseFloat(valorPrestamo.value)) / 100;
  }
});

botonAgregar.addEventListener("click", function (event) {
  event.preventDefault();

  let nuevoPrestamo = {
    valorPrestamo: totalaPagar.value - intereses.value,
    totalAPagar: totalaPagar.value,
    cuotaPorMes: cuotaPorMes.value,
  };

  let localStorage = JSON.parse(window.localStorage.getItem("array"));
  if (!localStorage) {
    window.localStorage.setItem("array", JSON.stringify([nuevoPrestamo]));
  } else {
    localStorage.push(nuevoPrestamo);
    window.localStorage.setItem("array", JSON.stringify(localStorage));
  }

  tbody.innerHTML = "";

  localStorage = JSON.parse(window.localStorage.getItem("array"));
  localStorage.forEach(function (elemento) {
    let nuevoPrestamoHTML = document.createElement("tr");
    nuevoPrestamoHTML.innerHTML = `<td>${
      localStorage.indexOf(elemento) + 1
    }</td><td>$${elemento.valorPrestamo}</td><td>$${
      elemento.totalAPagar
    }</td><td>$${elemento.cuotaPorMes}</td>`;
    tbody.appendChild(nuevoPrestamoHTML);
  });

  Toastify({
    text: "Nuevo prestamo agregado a la tabla!",
    duration: 3000,
    style: {
      background: "green",
    },
  }).showToast();
});

botonLimpiar.addEventListener("click", function (event) {
  event.preventDefault();
  tbody.innerHTML = "";
  let localStorage = JSON.parse(window.localStorage.getItem("array"));
  if (localStorage) {
    window.localStorage.removeItem("array");
    Toastify({
      text: "Se ha limpiado la tabla!",
      duration: 3000,
      style: {
        background: "green",
      },
    }).showToast();
  } else {
    Toastify({
      text: "Error: la tabla no contiene ningun dato para borrar",
      duration: 3000,
      style: {
        background: "red",
      },
    }).showToast();
  }
});
