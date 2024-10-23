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

    // --- Carrusel de imágenes del banner ---
    let diapositivaActual = 0;
    const diapositivas = document.querySelectorAll(".carousel img");

    function mostrarDiapositiva(indice) {
        diapositivas.forEach((diapositiva, i) => {
            diapositiva.style.transform = `translateX(${(i - indice) * 100}%)`;
        });
    }

    function siguienteDiapositiva() {
        diapositivaActual = (diapositivaActual + 1) % diapositivas.length;
        mostrarDiapositiva(diapositivaActual);
    }

    function anteriorDiapositiva() {
        diapositivaActual = (diapositivaActual - 1 + diapositivas.length) % diapositivas.length;
        mostrarDiapositiva(diapositivaActual);
    }

    document.querySelector('.carousel-button-prev').addEventListener('click', anteriorDiapositiva);
    document.querySelector('.carousel-button-next').addEventListener('click', siguienteDiapositiva);

    // Inicializar el carrusel
    mostrarDiapositiva(diapositivaActual);

    // --- Registro e inicio de sesión ---
    function registrarUsuario() {
        const nombre = document.querySelector('input[placeholder="Nombre"]').value;
        const apellidos = document.querySelector('input[placeholder="Apellidos"]').value;
        const fechaNacimiento = document.querySelector('input[placeholder="Fecha de Nacimiento"]').value;
        const correo = document.querySelector('input[placeholder="Correo Electrónico"]').value;
        const telefono = document.querySelector('input[placeholder="Teléfono"]').value;
        const tipoDocumento = document.querySelector('select').value;
        const numeroDocumento = document.querySelector('input[placeholder="Número de Documento"]').value;
        const contraseña = document.querySelector('input[placeholder="Contraseña"]').value;
        const direccion = document.querySelector('input[placeholder="Dirección"]').value;
        const barrio = document.querySelector('input[placeholder="Barrio"]').value;
        const ciudad = document.querySelector('input[placeholder="Ciudad"]').value;
        const departamento = document.querySelector('input[placeholder="Departamento"]').value;
        const pais = document.querySelector('input[placeholder="País"]').value;

        const nuevoUsuario = {
            nombre, apellidos, fechaNacimiento, correo, telefono,
            tipoDocumento, numeroDocumento, contraseña,
            direccion, barrio, ciudad, departamento, pais
        };

        localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
    }

    function iniciarSesion() {
        const correo = document.querySelector('input[placeholder="Usuario"]').value;
        const contraseña = document.querySelector('input[placeholder="Contraseña"]').value;

        const usuario = JSON.parse(localStorage.getItem('usuario'));

        if (usuario && usuario.correo === correo && usuario.contraseña === contraseña) {
            localStorage.setItem('userName', usuario.nombre);
            alert('Inicio de sesión exitoso.');
            window.location.href = 'index.html';
        } else {
            alert('Credenciales incorrectas.');
        }
    }

    function cerrarSesion() {
        localStorage.removeItem('userName');
        alert('Has cerrado sesión.');
        window.location.reload();
    }

    const userName = localStorage.getItem('userName');
    if (userName) {
        document.body.classList.add('user-logged-in');
        document.getElementById('user-name').textContent = userName;
    }
});