// variables
const PRODUCTS_PER_PAGE = 8;
let productos = [];
let currentPage = 1;
let totalPages = 1;

// Obtener el carrito de localStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Variable global para llevar el conteo de pedidos
let numeroPedido = 1;
// Array para almacenar los pedidos realizados
let pedidosRealizados = [];

// Cargar productos desde el archivo JSON
async function cargarProductos() {
  try {
    const response = await fetch("ecommerce_dataset_20250524_211459.json");
    productos = await response.json();
    totalPages = Math.ceil(productos.length / PRODUCTS_PER_PAGE);
    mostrarProductos();
    mostrarPaginacion();
  } catch (error) {
    document.getElementById("lista-productos").innerHTML =
      '<li class="list-group-item text-danger">Error cargando productos.</li>';
  }
}

// Mostrar productos con paginación e imagen
function mostrarProductos() {
  var lista = document.getElementById("lista-productos");
  lista.innerHTML = "";
  const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const end = start + PRODUCTS_PER_PAGE;
  const productosPagina = productos.slice(start, end);
  for (let producto of productosPagina) {
    var li = document.createElement("li");
    li.className = "list-group-item d-flex align-items-center";
    li.innerHTML = `
      <img src="${producto.image_url}" alt="${
      producto.title
    }" style="width:60px;height:60px;object-fit:contain;margin-right:15px;">
      <div class="flex-grow-1 text-start">
        <strong>${producto.title}</strong><br>
        <span class="text-muted">${producto.category}</span><br>
        $${producto.price.toFixed(2)}
      </div>
      <button class="btn btn-primary btn-sm ms-2" onclick="agregarProductoAlCarrito(${
        producto.product_id
      })">Agregar</button>
    `;
    lista.appendChild(li);
  }
}

// Mostrar paginación
function mostrarPaginacion() {
  let paginacion = document.getElementById("paginacion-productos");
  if (!paginacion) {
    paginacion = document.createElement("div");
    paginacion.id = "paginacion-productos";
    document
      .getElementById("lista-productos")
      .parentElement.appendChild(paginacion);
  }
  paginacion.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    paginacion.innerHTML += `<button class="btn btn-outline-secondary btn-sm mx-1${
      i === currentPage ? " active" : ""
    }" onclick="cambiarPagina(${i})">${i}</button>`;
  }
}

function cambiarPagina(pagina) {
  currentPage = pagina;
  mostrarProductos();
  mostrarPaginacion();
}

// Mostrar el carrito en la página
function mostrarCarrito() {
  var lista = document.getElementById("lista-carrito");
  lista.innerHTML = "";
  var total = 0;
  for (var i = 0; i < carrito.length; i++) {
    var producto = carrito[i];
    var li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";
    // Usar las propiedades correctas del producto según la fuente de datos
    var nombre = producto.title || producto.nombre || "Producto";
    var precio =
      producto.price !== undefined ? producto.price : producto.precio;
    li.innerHTML =
      nombre +
      " - $" +
      (typeof precio === "number" ? precio.toFixed(2) : "0.00") +
      '<button class="btn btn-danger btn-sm ms-2" onclick="eliminarProductoDelCarrito(' +
      i +
      ')">Eliminar</button>';
    lista.appendChild(li);
    total += typeof precio === "number" ? precio : 0;
  }
  document.getElementById("total-carrito").textContent = total.toFixed(2);
}

// Función para eliminar un producto del carrito por su índice
function eliminarProductoDelCarrito(indice) {
  // Confirmación con SweetAlert2 antes de eliminar
  Swal.fire({
    title: "¿Eliminar producto?",
    text: "¿Deseas eliminar este producto del carrito?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      carrito.splice(indice, 1);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      mostrarCarrito();
      Swal.fire({
        icon: "success",
        title: "Producto eliminado",
        showConfirmButton: false,
        timer: 900,
      });
    }
  });
}

// Mostrar todas las órdenes en la tabla
function mostrarTablaPedidos() {
  let tablaHTML = "";
  if (pedidosRealizados.length > 0) {
    tablaHTML = `
      <div class="mt-4">
        <table class="table table-bordered table-striped table-hover align-middle shadow">
          <thead class="table-primary">
            <tr>
              <th>Nombre del pedido</th>
              <th>Número de artículos</th>
              <th>Fecha de compra</th>
              <th>Total pagado</th>
            </tr>
          </thead>
          <tbody>
            ${pedidosRealizados
              .map(
                (pedido) => `
              <tr>
                <td>${pedido.nombre}</td>
                <td>${pedido.cantidad}</td>
                <td>${pedido.fecha}</td>
                <td>$${pedido.total}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  }
  document.getElementById("mensaje-compra").innerHTML = tablaHTML;
}

// Guardar los pedidos realizados en localStorage para persistencia
function guardarPedidos() {
  localStorage.setItem("pedidosRealizados", JSON.stringify(pedidosRealizados));
  localStorage.setItem("numeroPedido", numeroPedido.toString());
}

// Cargar los pedidos realizados y el número de pedido desde localStorage
function cargarPedidos() {
  const pedidosGuardados = localStorage.getItem("pedidosRealizados");
  if (pedidosGuardados) {
    pedidosRealizados = JSON.parse(pedidosGuardados);
  }
  const numeroGuardado = localStorage.getItem("numeroPedido");
  if (numeroGuardado) {
    numeroPedido = parseInt(numeroGuardado, 10);
  }
}

// Finalizar la compra
function finalizarCompra() {
  // Confirmación para limpiar todo el carrito
  if (carrito.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "Carrito vacío",
      text: "No has seleccionado ningún producto.",
    });
    return;
  }
  // Proponer el nombre del pedido según el número de pedidos
  let nombrePropuesto = `Compra #${numeroPedido}`;
  Swal.fire({
    title: "Nombre del pedido",
    input: "text",
    inputLabel: "Por favor, ingresa el nombre del pedido:",
    inputValue: nombrePropuesto,
    showCancelButton: true,
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar",
    inputValidator: (value) => {
      if (!value) {
        return "Debes ingresar un nombre para el pedido";
      }
    },
  }).then((inputResult) => {
    if (inputResult.isConfirmed) {
      // Calcular el total y obtener la fecha actual usando dayjs
      var total = 0;
      for (var i = 0; i < carrito.length; i++) {
        var precio =
          carrito[i].price !== undefined ? carrito[i].price : carrito[i].precio;
        total += typeof precio === "number" ? precio : 0;
      }
      var nombrePedido = inputResult.value || nombrePropuesto;
      var cantidadItems = carrito.length;
      var fechaCompra = dayjs().format("YYYY-MM-DD HH:mm:ss");
      // Guardar el pedido en el array de pedidos realizados
      pedidosRealizados.push({
        nombre: nombrePedido,
        cantidad: cantidadItems,
        fecha: fechaCompra,
        total: total.toFixed(2),
      });
      // Incrementar el número de pedido para la próxima compra
      numeroPedido++;
      guardarPedidos();
      // Mostrar la tabla de pedidos
      mostrarTablaPedidos();
      // Vaciar el carrito y actualizar localStorage
      carrito = [];
      localStorage.setItem("carrito", JSON.stringify(carrito));
      mostrarCarrito();
    }
  });
}

// Agregar un producto al carrito
function agregarProductoAlCarrito(productoId) {
  const producto = productos.find((p) => p.product_id === productoId);
  if (producto) {
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    // Notificación de éxito con SweetAlert2
    Swal.fire({
      icon: "success",
      title: "¡Producto agregado al carrito!",
      showConfirmButton: false,
      timer: 900,
    });
  }
}

// Se asocia el  evento al botón de finalizar compra
window.onload = function () {
  cargarPedidos();
  cargarProductos();
  mostrarCarrito();
  mostrarTablaPedidos();
  document.getElementById("finalizar-compra").onclick = finalizarCompra;
};
