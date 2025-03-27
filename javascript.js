// Declaración de constantes y variables
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

let carrito = []; // Array para almacenar los productos seleccionados

// Función para mostrar el menú de productos y seleccionarlos
function mostrarMenuProductos() {
  let listaProductos =
    "Elige un número de producto para agregar al carrito o cero para salir:\n";
  productos.forEach((producto) => {
    listaProductos += `${producto.id}. ${
      producto.nombre
    } - $${producto.precio.toFixed(2)}\n`;
  });
  listaProductos += "0. Finalizar compra";

  let productoId = parseInt(prompt(listaProductos));
  if (productoId === 0) {
    finalizarCompra();
  } else {
    agregarProductoAlCarrito(productoId);
  }
}

// Función para agregar un producto al carrito
function agregarProductoAlCarrito(productoId) {
  const producto = productos.find((p) => p.id === productoId);
  if (producto) {
    carrito.push(producto);
    console.log(`Has agregado "${producto.nombre}" al carrito.`);
    console.log(`Total de productos en el carrito: ${carrito.length}`);
    alert(`Has agregado "${producto.nombre}" al carrito.`);
  } else {
    alert("Producto no válido. Intenta nuevamente.");
    console.log("Producto no válido. Intenta nuevamente.");
  }
  mostrarMenuProductos();
}

// fin de la compra y moestrar el total
function finalizarCompra() {
  if (carrito.length === 0) {
    alert("No has seleccionado ningún producto.");
    console.log("No has seleccionado ningún producto.");
    return;
  }

  let total = carrito.reduce(
    (acumulador, producto) => acumulador + producto.precio,
    0
  );
  let detalleCompra = "Detalle de tu compra:\n";
  carrito.forEach((producto, index) => {
    detalleCompra += `${index + 1}. ${
      producto.nombre
    } - $${producto.precio.toFixed(2)}\n`;
  });
  detalleCompra += `\nTotal a pagar: $${total.toFixed(2)}`;

  alert(detalleCompra);
  console.log(detalleCompra);
  carrito = []; // Vaciar el carrito después de la compra
}

// Iniciar el programa
mostrarMenuProductos();
