document.addEventListener("DOMContentLoaded", function() {
    const contenedorProductos = document.getElementById('contenedor-productos');
    const carritoNav = document.querySelector('.carrito-nav');
    const asideCarrito = document.createElement('aside');
    asideCarrito.classList.add('carrito-container');
    document.body.appendChild(asideCarrito);
    const productosEnCarrito = [];

    fetch('productos.json')
        .then(response => response.json())
        .then(data => mostrarProductos(data))
        .catch(error => console.error('Error cargando productos:', error));

    // Manejar clics en los enlaces de filtro de marca
    document.querySelectorAll('.dropdown-content a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const marca = this.dataset.marca;
            filtrarProductosPorMarca(marca);
        });
    });

    document.querySelector('.nav-links li:nth-child(2) a').addEventListener('click', function(event) {
        event.preventDefault();
        fetch('productos.json')
            .then(response => response.json())
            .then(data => mostrarProductos(data))
            .catch(error => console.error('Error cargando productos:', error));
    });

    carritoNav.addEventListener('click', () => {
        toggleCarrito();
    });

    function toggleCarrito() {
        if (asideCarrito.style.display === 'none' || asideCarrito.style.display === '') {
            asideCarrito.style.display = 'block'; // Mostrar el carrito si está oculto
        } else {
            asideCarrito.style.display = 'none'; // Ocultar el carrito si está visible
        }
    }

    function mostrarProductos(productos) {
        contenedorProductos.innerHTML = ''; // Limpiar contenido anterior
    
        productos.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('producto');
            const card = crearTarjetaProducto(producto);
            productoDiv.appendChild(card);
            contenedorProductos.appendChild(productoDiv);
        });
    }

    function crearTarjetaProducto(producto) {
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto');

        const card = document.createElement('div');
        card.classList.add('card');

        const imagen = document.createElement('img');
        imagen.src = producto.imagen;
        imagen.alt = producto.modelo;

        const marcaModelo = document.createElement('h3');
        marcaModelo.innerHTML = `<strong>${producto.marca}</strong> - <strong>${producto.modelo}</strong>`;

        const descripcion = document.createElement('p');
        descripcion.textContent = producto.descripcion;
        descripcion.classList.add('descripcion');
        
        const precio = document.createElement('p');
        precio.innerHTML = `<strong>Precio</strong>: $${producto.precio.toFixed(2)}`;
        precio.classList.add('precio')

        const botonAgregar = document.createElement('button');
        botonAgregar.classList.add('agregar-carrito');
        botonAgregar.addEventListener('click', () => {
            agregarAlCarrito(producto);
        });
        const iconoAgregar = document.createElement('img');
        iconoAgregar.src = './assets/Plus Math.svg';
        iconoAgregar.alt = 'Agregar a carrito';
        botonAgregar.appendChild(iconoAgregar);
        
        card.appendChild(imagen);
        card.appendChild(marcaModelo);
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
                mostrarProductos(productosFiltrados);
            })
            .catch(error => console.error('Error filtrando productos por marca:', error));
    }

    function mostrarCarrito() {
        asideCarrito.innerHTML = ''; // Limpiar contenido anterior
    
        if (productosEnCarrito.length === 0) {
            asideCarrito.style.display = 'none'; // Ocultar el aside si el carrito está vacío
            return; // Salir de la función si el carrito está vacío
        }
    
        const listaProductos = document.createElement('ul');
        listaProductos.style.listStyle = 'none'; // Eliminar el punto de la lista
    
        productosEnCarrito.forEach((producto, index) => {
            const itemProducto = document.createElement('li');
            
            // Crear una imagen para usar como marcador de lista
            const imagenProducto = document.createElement('img');
            imagenProducto.src = producto.imagen;
            imagenProducto.alt = producto.modelo;
            imagenProducto.style.width = '50px'; 
            imagenProducto.style.height = '50px';
            imagenProducto.style.marginRight = '20px';
            itemProducto.appendChild(imagenProducto);
    
            // Crear el texto con el modelo y el precio del producto
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
        asideCarrito.style.display = 'block'; // Mostrar el aside si hay productos en el carrito
    }
    

    function agregarAlCarrito(producto) {
        productosEnCarrito.push(producto);
        mostrarCarrito();
    }

    function eliminarDelCarrito(index) {
        productosEnCarrito.splice(index, 1);
        mostrarCarrito();
    }
});
