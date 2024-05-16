document.addEventListener("DOMContentLoaded", function () {
    console.log("Iniciando...");

    const contenedorProductos = document.getElementById('contenedor-productos');
    const carritoNav = document.querySelector('.carrito-nav');
    const asideCarrito = document.createElement('aside');
    asideCarrito.classList.add('carrito-container');
    document.body.appendChild(asideCarrito);
    const productosEnCarrito = [];

    // crear el elemento para mostrar el total
    const totalCarrito = document.createElement('p');
    totalCarrito.classList.add('total-carrito');
    asideCarrito.appendChild(totalCarrito);

    // ocultar carrito al recargar la página
    asideCarrito.style.display = 'none';

    // mostrar / esconder carrito
    function toggleCarrito() {
        if (asideCarrito.style.display === 'none' || asideCarrito.style.display === '') {
            asideCarrito.style.display = 'block'; // Mostrar el carrito si está oculto
        } else {
            asideCarrito.style.display = 'none'; // Ocultar carrito si está vacío
        }
    }

    // mostrar productos en index
    fetch('productos.json')
        .then(response => response.json())
        .then(data => mostrarProductos(data))
        .catch(error => console.error('Error cargando productos:', error));

    // inicio para filtrar productos
    document.querySelector('.nav-links li:first-child a').addEventListener('click', function (event) {
        event.preventDefault();
        fetch('productos.json')
            .then(response => response.json())
            .then(data => mostrarProductos(data))
            .catch(error => console.error('Error cargando productos:', error));

        asideCarrito.style.display = 'none'; // Para ocultar carrito cuando recargo
    });

    // manejar clics en los enlaces de filtro de marca
    document.querySelectorAll('.dropdown-content a').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const marca = this.dataset.marca;
            filtrarProductosPorMarca(marca);
        });
    });

    carritoNav.addEventListener('click', () => {
        toggleCarrito();
    });

    function mostrarProductos(productos, marca = null) {
        contenedorProductos.innerHTML = '';

        const flexContainer = document.createElement('div');
        flexContainer.classList.add('productos-flex');

        if (marca) {
            const tituloContainer = document.createElement('div');
            tituloContainer.style.width = '100%';
            tituloContainer.style.textAlign = 'center';
            tituloContainer.style.textDecoration = 'underline';
            const tituloMarca = document.createElement('h2');
            tituloMarca.innerHTML = `${marca}`;
            tituloContainer.appendChild(tituloMarca);
            contenedorProductos.appendChild(tituloContainer);
        }

        productos.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('producto');
            const card = crearTarjetaProducto(producto, marca);
            productoDiv.appendChild(card);
            flexContainer.appendChild(productoDiv);
        });

        contenedorProductos.appendChild(flexContainer);
    }

    function crearTarjetaProducto(producto, marca) {
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto');

        const card = document.createElement('div');
        card.classList.add('card');

        const imagen = document.createElement('img');
        imagen.src = producto.imagen;
        imagen.alt = producto.modelo;

        const marcaModelo = document.createElement('h3');
        marcaModelo.innerHTML = `<strong>${producto.modelo}</strong>`;

        const descripcion = document.createElement('p');
        descripcion.textContent = producto.descripcion;
        descripcion.classList.add('descripcion');

        const precio = document.createElement('p');
        precio.innerHTML = `<strong>Precio</strong>: $${producto.precio.toFixed(2)}`;
        precio.classList.add('precio');

        const botonAgregar = document.createElement('button');
        botonAgregar.classList.add('agregar-carrito');
        botonAgregar.addEventListener('click', () => {
            agregarAlCarrito(producto);
        });
        const iconoAgregar = document.createElement('img');
        iconoAgregar.classList.add('plusMath');
        iconoAgregar.src = './assets/Plus Math.svg';
        iconoAgregar.alt = 'Agregar a carrito';
        botonAgregar.appendChild(iconoAgregar);

        card.appendChild(marcaModelo);
        card.appendChild(imagen);
        card.appendChild(descripcion);
        card.appendChild(precio);
        card.appendChild(botonAgregar);

        productoDiv.appendChild(card);

        return productoDiv;
    }

    function filtrarProductosPorMarca(marca) {
        fetch('productos.json')
            .then(response => response.json())
            .then(data => {
                const productosFiltrados = data.filter(producto => producto.marca === marca);
                mostrarProductos(productosFiltrados, marca);
            })
            .catch(error => console.error('Error filtrando productos por marca:', error));
    }

    function agregarAlCarrito(producto) {
        productosEnCarrito.push(producto);
        mostrarCarrito();
    }

    function mostrarCarrito() {
        asideCarrito.innerHTML = '';

        if (productosEnCarrito.length === 0) {
            asideCarrito.style.display = 'none';
            return;
        }

        const listaProductos = document.createElement('ul');
        listaProductos.style.listStyle = 'none';

        productosEnCarrito.forEach((producto, index) => {
            const itemProducto = document.createElement('li');

            const imagenProducto = document.createElement('img');
            imagenProducto.src = producto.imagen;
            imagenProducto.alt = producto.modelo;
            imagenProducto.style.width = '50px';
            imagenProducto.style.height = '50px';
            imagenProducto.style.marginRight = '20px';
            itemProducto.appendChild(imagenProducto);

            const textoProducto = document.createElement('span');
            textoProducto.innerHTML = `<hr>${producto.marca} ${producto.modelo}  <strong>Precio</strong>: $${producto.precio.toFixed(2)}<hr>`;
            itemProducto.appendChild(textoProducto);

            const botonEliminar = document.createElement('a');
            botonEliminar.href = '#';
            const iconoEliminar = document.createElement('img');
            iconoEliminar.src = './assets/Close.svg';
            iconoEliminar.alt = 'Eliminar del carrito';
            botonEliminar.appendChild(iconoEliminar);
            botonEliminar.addEventListener('click', () => {
                eliminarDelCarrito(index);
            });

            itemProducto.appendChild(botonEliminar);
            listaProductos.appendChild(itemProducto);
        });

        asideCarrito.appendChild(listaProductos);
        asideCarrito.appendChild(totalCarrito);
        actualizarTotalCarrito();

        asideCarrito.style.display = 'block'; // Mostrar el aside si hay productos en el carrito
    }

    function eliminarDelCarrito(index) {
        productosEnCarrito.splice(index, 1);
        mostrarCarrito();
    }

    function actualizarTotalCarrito() {
        const total = productosEnCarrito.reduce((sum, producto) => sum + producto.precio, 0);
        totalCarrito.textContent = `Total: $${total}`;
    }
});
