// Array de servicios turísticos simulados para la tienda virtual
const servicios = [
  {
    id: 1,
    nombre: "Clase de surf",
    categoria: "Deportes",
    ubicacion: "uvita",
    precio: 80,
    imagen: "../recursos/carruseles/surf-lesson/surfboards-7300935_1280.jpg"
  },
  {
    id: 2,
    nombre: "Chef privado",
    categoria: "Gastronomía",
    ubicacion: "quepos",
    precio: 150,
    imagen: "../recursos/carruseles/private-chef/food-8266439_1280.jpg"
  },
  {
    id: 3,
    nombre: "Transporte aeropuerto",
    categoria: "Transporte",
    ubicacion: "cóbano",
    precio: 60,
    imagen: "../recursos/transport_icon.png"
  },
  {
    id: 4,
    nombre: "Sesión de spa",
    categoria: "Bienestar",
    ubicacion: "uvita",
    precio: 120,
    imagen: "../recursos/carruseles/spa-session/Imagen de WhatsApp 2025-05-13 a las 15.18.00_a7c28100.jpg"
  },
  {
    id: 5,
    nombre: "Alquiler de bicicletas",
    categoria: "Deportes",
    ubicacion: "quepos",
    precio: 25,
    imagen: "../recursos/carruseles/bike-rentals/bicycles-1867046_1280.jpg"
  },
  {
    id: 6,
    nombre: "Tour de avistamiento de ballenas",
    categoria: "Tours",
    ubicacion: "uvita",
    precio: 100,
    imagen: "../recursos/carruseles/tours/humpback-whale-436120_640.jpg"
  },
  {
    id: 7,
    nombre: "Clase de yoga al amanecer",
    categoria: "Bienestar",
    ubicacion: "cóbano",
    precio: 40,
    imagen: "../recursos/carruseles/yoga-session/sunrise-3848628_1280.jpg"
  },
  {
    id: 8,
    nombre: "Servicio de limpieza",
    categoria: "Servicios",
    ubicacion: "quepos",
    precio: 30,
    imagen: "../recursos/cleaning-icon.png"
  },
  {
    id: 9,
    nombre: "Tour de delfines",
    categoria: "Tours",
    ubicacion: "uvita",
    precio: 90,
    imagen: "../recursos/carruseles/tours/dolphin-1818853_1280.jpg"
  },
  {
    id: 10,
    nombre: "Sesión de pilates",
    categoria: "Bienestar",
    ubicacion: "cóbano",
    precio: 50,
    imagen: "../recursos/753880_pillates_exercise_fitness_pilates_strength_icon.png"
  }
];
// El array 'servicios' queda disponible de forma global para otros scripts. 

// Función para renderizar los servicios en el contenedor con id="store"
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

function toggleFavorito(id) {
  if (favoritos.includes(id)) {
    favoritos = favoritos.filter(f => f !== id);
  } else {
    favoritos.push(id);
  }
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  renderServicios(servicios);
}

function renderServicios(lista) {
  const contenedor = document.getElementById('store');
  if (!contenedor) return;
  contenedor.innerHTML = '';
  lista.forEach(servicio => {
    const card = document.createElement('div');
    card.className = 'servicio-card';
    card.innerHTML = `
      <img src="${servicio.imagen}" alt="${servicio.nombre}">
      <h3>${servicio.nombre}</h3>
      <p>${servicio.categoria}</p>
      <p><strong>Ubicación:</strong> ${servicio.ubicacion.charAt(0).toUpperCase() + servicio.ubicacion.slice(1)}</p>
      <p>$${servicio.precio}</p>
      <button class="reservar" data-id="${servicio.id}">Reservar</button>
      <button class="favorito ${favoritos.includes(servicio.id) ? 'activo' : ''}" data-id="${servicio.id}">⭐</button>
    `;
    contenedor.appendChild(card);
  });
}

function aplicarFiltros() {
  const searchInput = document.getElementById('search');
  const locationSelect = document.getElementById('filter-location');
  if (!searchInput || !locationSelect) return;

  const texto = searchInput.value.trim().toLowerCase();
  const ubicacion = locationSelect.value;

  let filtrados = servicios.filter(servicio => {
    const nombreCoincide = servicio.nombre.toLowerCase().includes(texto);
    const categoriaCoincide = servicio.categoria.toLowerCase().includes(texto);
    const ubicacionCoincide = ubicacion === '' || servicio.ubicacion === ubicacion;
    return (nombreCoincide || categoriaCoincide) && ubicacionCoincide;
  });

  // Optimización: Si no hay cambios, no renderizar de nuevo
  // (opcional, aquí se puede guardar el último estado si se desea)

  if (filtrados.length === 0) {
    const contenedor = document.getElementById('store');
    if (contenedor) {
      contenedor.innerHTML = '<p>No se encontraron servicios</p>';
    }
  } else {
    renderServicios(filtrados);
  }
}

// Array global para almacenar las reservas
let carrito = [];

// Función para agregar un servicio al carrito
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarReserva(id) {
  const servicio = servicios.find(s => s.id === id);
  
  if (!servicio) {
    Toastify({
      text: "Servicio no encontrado",
      duration: 2500,
      style: { background: "red" }
    }).showToast();
    return;
  }

  const yaEnCarrito = carrito.some(item => item.id === id);
  if (yaEnCarrito) {
    Toastify({
      text: "Este servicio ya fue reservado",
      duration: 2500,
      style: { background: "orange" }
    }).showToast();
    return;
  }

  carrito.push(servicio);
  guardarCarrito();

  Toastify({
    text: `${servicio.nombre} reservado con éxito`,
    duration: 3000,
    style: { background: "green" }
  }).showToast();

  actualizarContador();
  renderResumen();
}

// Función para actualizar el contador de reservas
function actualizarContador() {
  const contador = document.getElementById('contador-reservas');
  if (contador) {
    contador.textContent = carrito.length;
  }
}

// Función para renderizar el resumen de reservas
function renderResumen() {
  const contenedor = document.getElementById("resumen");
  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>No hay reservas aún.</p>";
    return;
  }

  const h2 = document.createElement("h2");
  h2.textContent = "Resumen de reservas";
  contenedor.appendChild(h2);

  const ul = document.createElement("ul");
  let total = 0;

  carrito.forEach(servicio => {
    const li = document.createElement("li");
    li.textContent = `${servicio.nombre} (${servicio.ubicacion}) - $${servicio.precio}`;
    ul.appendChild(li);
    total += servicio.precio;
  });

  const totalEl = document.createElement("p");
  totalEl.innerHTML = `<strong>Total:</strong> $${total}`;

  const boton = document.createElement("button");
  boton.textContent = "Confirmar reserva";
  boton.id = "confirmar";

  contenedor.appendChild(ul);
  contenedor.appendChild(totalEl);
  contenedor.appendChild(boton);
}

// Listener global para capturar clicks en botones de reservar y confirmar
document.addEventListener("click", e => {
  if (e.target.classList.contains("reservar")) {
    const id = parseInt(e.target.dataset.id);
    agregarReserva(id);
  } else if (e.target.classList.contains("favorito")) {
    const id = parseInt(e.target.dataset.id);
    toggleFavorito(id);
  } else if (e.target.id === "confirmar") {
    Swal.fire({
      title: "¡Reserva confirmada!",
      text: "Gracias por reservar con nosotros",
      icon: "success",
      confirmButtonText: "Aceptar"
    });

    carrito = [];
    localStorage.removeItem("carrito");
    renderResumen();
    actualizarContador();
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const carritoGuardado = JSON.parse(localStorage.getItem("carrito"));
  if (carritoGuardado) {
    carrito = carritoGuardado;
    renderResumen();
    actualizarContador();
  }
  renderServicios(servicios);
  const searchInput = document.getElementById('search');
  const locationSelect = document.getElementById('filter-location');
  if (searchInput) {
    searchInput.addEventListener('input', aplicarFiltros);
  }
  if (locationSelect) {
    locationSelect.addEventListener('change', aplicarFiltros);
  }
  
  // Inicializar contador y resumen
  actualizarContador();
  renderResumen();
});