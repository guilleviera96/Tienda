document.addEventListener("DOMContentLoaded", function () {
    console.log("probando...");

    const contenedorProductos = document.getElementById('contenedorProductos');
    const carritoNav = document.querySelector('.carritoNav');
    const asideCarrito = document.createElement('aside');
    asideCarrito.classList.add('carritoContainer');
    document.body.appendChild(asideCarrito);
    const productosEnCarrito = [];

    // crear el elemento para mostrar el total
    const totalCarrito = document.createElement('p');
    totalCarrito.classList.add('totalCarrito');
    asideCarrito.appendChild(totalCarrito);

    // ocultar carrito al recargar la página
    asideCarrito.style.display = 'none';

    // mostrar / esconder carrito
    function toggleCarrito() {
        if (asideCarrito.style.display === 'none' || asideCarrito.style.display === '') {
            asideCarrito.style.display = 'block'; // muestra el carrito si está oculto
        } else {
            asideCarrito.style.display = 'none'; // se oculta carrito si está vacío
        }
    }

    // mostrar productos en index
    fetch('productos.json')
        .then(response => response.json())
        .then(data => mostrarProductos(data))
        .catch(error => console.error('Error al cargar productos:', error));

    // inicio para filtrar productos
    document.querySelector('.nav-links li:first-child a').addEventListener('click', function (event) {
        event.preventDefault();
        fetch('productos.json')
            .then(response => response.json())
            .then(data => mostrarProductos(data))
            .catch(error => console.error('Error al cargar productos:', error));

        asideCarrito.style.display = 'none'; // para ocultar carrito cuando recargo la pagina
    });

    // manejar clics en los enlaces de filtro de marca
    document.querySelectorAll('.dropdownContent a').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const marca = this.dataset.marca;
            filtrarProductosPorMarca(marca);
        });
    });
    //cuando se da click al carrito nav se ejecuta la func
    carritoNav.addEventListener('click', () => {
        toggleCarrito();
    });
    //la func para mostrar los prods
    function mostrarProductos(productos, marca = null) {
        contenedorProductos.innerHTML = ''; //reseteo el html
        //creacion de container de prods
        const flexContainer = document.createElement('div');
        flexContainer.classList.add('productosFlex');

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
        // iteracion para mostrar prods
        productos.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('producto');
            const card = crearTarjetaProducto(producto, marca);
            productoDiv.appendChild(card);
            flexContainer.appendChild(productoDiv);
        });

        contenedorProductos.appendChild(flexContainer);
    }
    // creo card para produs
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
        botonAgregar.classList.add('agregarCarrito');
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
            .catch(error => console.error('Error al filtrar los productos por marca:', error));
    }
    // func para agregar a carrito
    function agregarAlCarrito(producto) {
        productosEnCarrito.push(producto);
        mostrarCarrito();
    }
    // func de creacion carrito
    function mostrarCarrito() {
        // limpio el aside del carrito
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

        asideCarrito.style.display = 'block';
    }
    // func para eliminar prods del cart
    function eliminarDelCarrito(index) {
        productosEnCarrito.splice(index, 1);
        mostrarCarrito();
    }
    // func para sumatoria de total cart
    function actualizarTotalCarrito() {
        const total = productosEnCarrito.reduce((sum, producto) => sum + producto.precio, 0);
        totalCarrito.textContent = `Total: $${total}`;
    }
});
