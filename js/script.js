document.addEventListener('DOMContentLoaded', function() {
    const botonesCarrito = document.querySelectorAll('button');
    botonesCarrito.forEach(boton => {
        boton.addEventListener('click', function() {
            alert('Producto agregado al carrito');
        });
    });
});