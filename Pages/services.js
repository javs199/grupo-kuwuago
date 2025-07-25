document.addEventListener('DOMContentLoaded', () => {
    const store = document.getElementById('store');
    const resumen = document.getElementById('resumen');
    const searchInput = document.getElementById('search');
    const locationFilter = document.getElementById('filter-location');
    const categoryFilter = document.getElementById('filter-category');
    const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
    const checkoutBtn = document.getElementById('checkout');
    const carritoItems = document.querySelector('.carrito-items');
    const carritoTotal = document.querySelector('.carrito-total');

    // Load services from the embedded script tag
    const servicesDataElement = document.getElementById('services-data');
    const services = JSON.parse(servicesDataElement.textContent);

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const renderServices = (servicesToRender) => {
        store.innerHTML = '';
        servicesToRender.forEach(service => {
            const serviceDiv = document.createElement('div');
            serviceDiv.classList.add('service');
            serviceDiv.innerHTML = `
                <img src="${service.imagen}" alt="${service.nombre}">
                <h3>${service.nombre}</h3>
                <p>${service.categoria}</p>
                <p><strong>Ubicación:</strong> ${service.ubicacion}</p>
                <p><strong>Precio:</strong> $${service.precio}</p>
                <button class="add-to-cart" data-id="${service.id}">Agregar al carrito</button>
            `;
            store.appendChild(serviceDiv);
        });
    };

    const renderCarrito = () => {
        carritoItems.innerHTML = '';
        if (carrito.length === 0) {
            carritoItems.innerHTML = '<p>El carrito está vacío</p>';
            carritoTotal.innerHTML = '';
            return;
        }

        let total = 0;
        carrito.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <span>${item.nombre}</span>
                <span>$${item.precio}</span>
                <button class="remove-from-cart" data-id="${item.id}">Eliminar</button>
            `;
            carritoItems.appendChild(cartItem);
            total += item.precio;
        });

        carritoTotal.innerHTML = `<strong>Total:</strong> $${total}`;
        localStorage.setItem('carrito', JSON.stringify(carrito));
    };

    const addToCart = (id) => {
        const service = services.find(s => s.id === id);
        if (service) {
            carrito.push(service);
            renderCarrito();
            Toastify({ text: 'Servicio agregado al carrito', duration: 3000 }).showToast();
        }
    };

    const removeFromCart = (id) => {
        carrito = carrito.filter(item => item.id !== id);
        renderCarrito();
        Toastify({ text: 'Servicio eliminado del carrito', duration: 3000 }).showToast();
    };

    const vaciarCarrito = () => {
        carrito = [];
        renderCarrito();
        Toastify({ text: 'Carrito vaciado', duration: 3000 }).showToast();
    };

    const filterServices = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const location = locationFilter.value;
        const category = categoryFilter.value;

        let filteredServices = services;

        if (searchTerm) {
            filteredServices = filteredServices.filter(service =>
                service.nombre.toLowerCase().includes(searchTerm) ||
                service.categoria.toLowerCase().includes(searchTerm)
            );
        }

        if (location) {
            filteredServices = filteredServices.filter(service => service.ubicacion === location);
        }

        if (category) {
            filteredServices = filteredServices.filter(service => service.categoria.toLowerCase() === category);
        }

        renderServices(filteredServices);
    };

    store.addEventListener('click', e => {
        if (e.target.classList.contains('add-to-cart')) {
            const id = parseInt(e.target.dataset.id);
            addToCart(id);
        }
    });

    resumen.addEventListener('click', e => {
        if (e.target.classList.contains('remove-from-cart')) {
            const id = parseInt(e.target.dataset.id);
            removeFromCart(id);
        }
    });

    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

    checkoutBtn.addEventListener('click', () => {
        if (carrito.length > 0) {
            Swal.fire({
                title: '¡Gracias por tu compra!',
                text: 'Tu reserva ha sido confirmada.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
            vaciarCarrito();
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Tu carrito está vacío.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });

    searchInput.addEventListener('input', filterServices);
    locationFilter.addEventListener('change', filterServices);
    categoryFilter.addEventListener('change', filterServices);

    // Initial render
    renderServices(services);
    renderCarrito();
});