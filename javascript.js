// variables
const productos = [
  { id: 1, nombre: "Almendras oscuras de 50 grs", precio: 21.0 },
  { id: 2, nombre: "Avena con cacao 400g", precio: 12.5 },
  { id: 3, nombre: "Cocoa alcalina 1kg", precio: 12.5 },
  { id: 4, nombre: "Cocoa natural 1kg", precio: 174.0 },
  { id: 5, nombre: "Chocolate 1kg 80%", precio: 111.0 },
  { id: 6, nombre: "Chocolate 1kg 100% cacao", precio: 158.0 },
  { id: 7, nombre: "Chocolate para mesa 340g", precio: 158.0 },
  { id: 8, nombre: "Chocolate amargo 100g 100% cacao", precio: 40.0 },
  { id: 9, nombre: "Chocolate amargo 100g 90% cacao", precio: 27.0 },
  { id: 10, nombre: "Chocolate semi-amargo 100g 70% cacao", precio: 27.0 },
];

// Obtener el carrito de localStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Función para mostrar los productos en la página
function mostrarProductos() {
  // Obtener el elemento UL donde se mostrarán los productos
  var lista = document.getElementById("lista-productos");
  lista.innerHTML = "";
  // Recorrer el array de productos y crear un elemento por cada uno
  for (var i = 0; i < productos.length; i++) {
    var producto = productos[i];
    var li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML =
      producto.nombre +
      " - $" +
      producto.precio.toFixed(2) +
      '<button class="btn btn-primary btn-sm ms-2" onclick="agregarProductoAlCarrito(' +
      producto.id +
      ')">Agregar</button>';
    lista.appendChild(li);
  }
}

// moostrar el carrito en la página
function mostrarCarrito() {
  var lista = document.getElementById("lista-carrito");
  lista.innerHTML = "";
  var total = 0;
  for (var i = 0; i < carrito.length; i++) {
    var producto = carrito[i];
    var li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML =
      producto.nombre +
      " - $" +
      producto.precio.toFixed(2) +
      '<button class="btn btn-danger btn-sm ms-2" onclick="eliminarProductoDelCarrito(' +
      i +
      ')">Eliminar</button>';
    lista.appendChild(li);
    total += producto.precio;
  }
  document.getElementById("total-carrito").textContent = total.toFixed(2);
}

// Agregar un producto al carrito
function agregarProductoAlCarrito(productoId) {
  // Buscar el producto por su id
  for (var i = 0; i < productos.length; i++) {
    if (productos[i].id === productoId) {
      carrito.push(productos[i]);
      break;
    }
  }
  // Guardar el carrito en localStorage
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

// Función para eliminar un producto del carrito por su índice
function eliminarProductoDelCarrito(indice) {
  // Eliminar el producto del array
  carrito.splice(indice, 1);
  // Guardar el carrito actualizado en localStorage
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

// finalizar la compra
function finalizarCompra() {
  // Obtener el área de mensajes
  var mensajeDiv = document.getElementById("mensaje-compra");
  // Limpiar los mensajes anteriores
  mensajeDiv.innerHTML = "";
  // Si el carrito está vacío, mostrar mensaje en la página
  if (carrito.length === 0) {
    mensajeDiv.innerHTML =
      '<div class="alert alert-warning mt-2">No has seleccionado ningún producto.</div>';
    return;
  }
  // Se calcula el total
  var total = 0;
  for (var i = 0; i < carrito.length; i++) {
    total += carrito[i].precio;
  }
  // Mensaje de compra exitosa en la página
  mensajeDiv.innerHTML =
    '<div class="alert alert-success mt-2">¡Gracias por tu compra!<br>Total pagado: $' +
    total.toFixed(2) +
    "</div>";
  // Vaciar el carrito y actualizar localStorage
  carrito = [];
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

// Se asocia el  evento al botón de finalizar compra
window.onload = function () {
  mostrarProductos();
  mostrarCarrito();
  document.getElementById("finalizar-compra").onclick = finalizarCompra;
};
