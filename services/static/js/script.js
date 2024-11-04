document.addEventListener('DOMContentLoaded', function () {
    // --- Funciones del carrito ---
    if (!localStorage.getItem('carrito')) {
        localStorage.setItem('carrito', JSON.stringify([]));
    }

    actualizarCarrito();
	
    // Función para redirigir al index al hacer clic en "Seguir comprando"
    const btnSeguirComprando = document.getElementById('seguir-comprando');
    if (btnSeguirComprando) {
        btnSeguirComprando.addEventListener('click', function () {
            window.location.href = '/';  // Redirige al index
        });
    }

    // Función para vaciar el carrito al hacer clic en "Vaciar carrito"
    const btnVaciarCarrito = document.getElementById('vaciar-carrito');
    if (btnVaciarCarrito) {
        btnVaciarCarrito.addEventListener('click', function () {
            localStorage.setItem('carrito', JSON.stringify([]));  // Vacía el carrito
            actualizarCarrito();  // Actualiza la vista del carrito
        });
    }

function actualizarCarrito() {
	console.log("Ejecutando actualizarCarrito"); // Verifica si la función se llama correctamente
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
	console.log("Contenido del carrito:", carrito); // Muestra el contenido del carrito en consola
    const contenedorCarrito = document.querySelector('.carrito-productos');
    const subtotalElement = document.querySelector('#subtotal');
    const totalElement = document.querySelector('#total');

    if (contenedorCarrito) {
        contenedorCarrito.innerHTML = '';
        let subtotal = 0;

        carrito.forEach(producto => {
            const productoHTML = `
                <div class="carrito-producto">
                    <div class="producto-info">
                        <img src="${producto.imagen}" alt="${producto.nombre}">
                        <div class="producto-detalles">
                            <h3>${producto.nombre}</h3>
                            <p>$${(producto.precio * producto.cantidad).toFixed(0)}</p>
                        </div>
                    </div>
                    <div class="producto-cantidad">
                        <button class="btn-disminuir" data-nombre="${producto.nombre}">➖</button>
                        <span>${producto.cantidad} und.</span>
                        <button class="btn-incrementar" data-nombre="${producto.nombre}">➕</button>
                    </div>
                </div>
            `;
            contenedorCarrito.innerHTML += productoHTML;
            subtotal += producto.precio * producto.cantidad;
        });

        if (subtotalElement) {
            subtotalElement.textContent = `$${subtotal.toFixed(0)}`;
        }

        // Ajusta el total para que sea igual al subtotal o aplica cambios si tienes impuestos, descuentos, etc.
        if (totalElement) {
            totalElement.textContent = `$${subtotal.toFixed(0)}`;
        }

        agregarEventosCarrito();
    }
}


    function agregarProducto(nombreProducto, precioProducto, imagenProducto) {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const productoExistente = carrito.find(p => p.nombre === nombreProducto);

        if (productoExistente) {
            productoExistente.cantidad += 1;
        } else {
            carrito.push({ nombre: nombreProducto, precio: precioProducto, cantidad: 1, imagen: imagenProducto });
        }

        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarrito();
    }

    function eliminarProducto(nombreProducto) {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const productoExistente = carrito.find(p => p.nombre === nombreProducto);

        if (productoExistente && productoExistente.cantidad > 1) {
            productoExistente.cantidad -= 1;
        } else {
            carrito = carrito.filter(p => p.nombre !== nombreProducto);
        }

        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarrito();
    }

    function agregarEventosCarrito() {
        document.querySelectorAll('.btn-incrementar').forEach(boton => {
            boton.addEventListener('click', function () {
                const nombreProducto = this.getAttribute('data-nombre');
                const producto = JSON.parse(localStorage.getItem('carrito')).find(p => p.nombre === nombreProducto);
                agregarProducto(nombreProducto, producto.precio, producto.imagen);
            });
        });

        document.querySelectorAll('.btn-disminuir').forEach(boton => {
            boton.addEventListener('click', function () {
                const nombreProducto = this.getAttribute('data-nombre');
                eliminarProducto(nombreProducto);
            });
        });
    }

    // Evento para gestionar los botones de productos en las páginas
    document.querySelectorAll('.product-card').forEach(productoCard => {
        const botonAgregar = productoCard.querySelector('.btn-agregar-carrito');
        const nombreProducto = productoCard.querySelector('h3').textContent;
        const precioProducto = parseFloat(productoCard.querySelector('p').textContent.replace('$', '').replace(',', ''));
        const imagenProducto = productoCard.querySelector('img').src;

        function mostrarControlesCantidad(cantidad) {
            botonAgregar.outerHTML = `
                <div class="producto-cantidad-controles">
                    <button class="btn-disminuir" data-nombre="${nombreProducto}">➖</button>
                    <span>${cantidad} und.</span>
                    <button class="btn-incrementar" data-nombre="${nombreProducto}">➕</button>
                </div>
            `;
            agregarEventosCarrito();
        }

        botonAgregar.addEventListener('click', function () {
            agregarProducto(nombreProducto, precioProducto, imagenProducto);
            mostrarControlesCantidad(1);
        });
    });

    // --- Funcionalidad del banner ---
    const slides = document.querySelectorAll('.carousel img');
    let currentSlide = 0;
    const slideIntervalTime = 5000;

    function nextSlide() {
        slides.forEach((slide, index) => {
            slide.style.transform = `translateX(${(index - currentSlide) * 100}%)`;
        });
        currentSlide = (currentSlide + 1) % slides.length;
    }

    // Configura la posición inicial para cada imagen del banner
    slides.forEach((slide, index) => {
        slide.style.position = 'absolute';
        slide.style.left = `${index * 100}%`; // Posiciona cada imagen consecutivamente
        slide.style.transition = 'transform 1s ease'; // Suaviza la transición
    });

    // Cambia la imagen cada 3 segundos
    setInterval(nextSlide, slideIntervalTime);

    // --- Registro e inicio de sesión ---
    function registrarUsuario() {
        const nombre = document.querySelector('input[placeholder="Nombre"]').value;
        const correo = document.querySelector('input[placeholder="Correo Electrónico"]').value;
        const contraseña = document.querySelector('input[placeholder="Contraseña"]').value;

        fetch('/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, correo, contraseña })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                alert('Usuario registrado exitosamente');
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function iniciarSesion() {
        const correo = document.querySelector('input[placeholder="Usuario"]').value;
        const contraseña = document.querySelector('input[placeholder="Contraseña"]').value;

        fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, contraseña })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                alert(`Bienvenido ${data.mensaje}`);
                localStorage.setItem('userName', data.mensaje);
                document.body.classList.add('user-logged-in');
                document.getElementById('user-name').textContent = data.mensaje;
            }
        })
        .catch(error => console.error('Error:', error));
    }
});