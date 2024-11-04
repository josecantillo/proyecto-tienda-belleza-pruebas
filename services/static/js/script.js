document.addEventListener('DOMContentLoaded', function () {
    // --- Funciones del carrito ---
    if (!localStorage.getItem('carrito')) {
        localStorage.setItem('carrito', JSON.stringify([]));
    }

    actualizarCarrito();

    function actualizarCarrito() {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const contenedorCarrito = document.querySelector('.carrito-productos');
        const resumenTotal = document.querySelector('.resumen-detalles span');

        if (contenedorCarrito) {
            contenedorCarrito.innerHTML = '';  // Limpiar contenido del carrito

            let total = 0;
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
                            <button class="btn-eliminar" data-nombre="${producto.nombre}">❌</button>
                        </div>
                    </div>
                `;
                contenedorCarrito.innerHTML += productoHTML;
                total += producto.precio * producto.cantidad;
            });

            if (resumenTotal) {
                resumenTotal.textContent = `$${total.toFixed(0)}`;
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
                agregarProducto(nombreProducto, 0, '');  // Incrementar cantidad
            });
        });

        document.querySelectorAll('.btn-disminuir').forEach(boton => {
            boton.addEventListener('click', function () {
                const nombreProducto = this.getAttribute('data-nombre');
                eliminarProducto(nombreProducto);  // Disminuir cantidad
            });
        });

        document.querySelectorAll('.btn-eliminar').forEach(boton => {
            boton.addEventListener('click', function () {
                const nombreProducto = this.getAttribute('data-nombre');
                eliminarProducto(nombreProducto);  // Eliminar producto completamente
            });
        });
    }

    // Evento para agregar productos desde la página de productos
    document.querySelectorAll('.btn-agregar-carrito').forEach(boton => {
        boton.addEventListener('click', function () {
            const productoCard = this.closest('.product-card');
            const nombreProducto = productoCard.querySelector('h3').textContent;
            const precioProducto = parseFloat(productoCard.querySelector('p').textContent.replace('$', '').replace(',', ''));
            const imagenProducto = productoCard.querySelector('img').src;

            agregarProducto(nombreProducto, precioProducto, imagenProducto);
        });
    });

    // --- Configuración del carrusel ---
    const slides = document.querySelectorAll('.carousel img');
    const prevButton = document.querySelector('.carousel-button-prev');
    const nextButton = document.querySelector('.carousel-button-next');
    let currentSlide = 0;
    let autoSlideInterval;
    const slideIntervalTime = 3000; // Tiempo en milisegundos (3 segundos)

    // Verificar que las flechas y las imágenes existen en el DOM
    if (slides.length > 0 && prevButton && nextButton) {
        // Función para mostrar la diapositiva actual
        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.style.display = i === index ? 'block' : 'none';
            });
        }

        // Función para pasar a la siguiente diapositiva
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        // Función para pasar a la diapositiva anterior
        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }

        // Función para iniciar el cambio automático de diapositivas
        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, slideIntervalTime);
        }

        // Función para detener el cambio automático de diapositivas
        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        // Event listeners para los botones de navegación
        prevButton.addEventListener('click', function () {
            console.log('Flecha anterior clicada'); // Agregar log para verificar si funciona
            stopAutoSlide();  // Detenemos el cambio automático temporalmente
            prevSlide();
            startAutoSlide(); // Reiniciamos el cambio automático
        });

        nextButton.addEventListener('click', function () {
            console.log('Flecha siguiente clicada'); // Agregar log para verificar si funciona
            stopAutoSlide();  // Detenemos el cambio automático temporalmente
            nextSlide();
            startAutoSlide(); // Reiniciamos el cambio automático
        });

        // Iniciar el carrusel al cargar la página
        showSlide(currentSlide);
        startAutoSlide();
    } else {
        console.warn('No se encontraron las imágenes o los botones de navegación del carrusel.');
    }
});

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
