// app.js (versión funcional limpia con eliminación individual)

document.addEventListener('DOMContentLoaded', function () {
  // Agregar productos al carrito
  const botones = document.querySelectorAll('.agg_carrito');

  botones.forEach((btn) => {
    btn.addEventListener('click', function () {
      const producto = btn.closest('.products');
      const nombre = producto.querySelector('h4').textContent;
      const descripcion = producto.querySelector('p').textContent;

      // Extraer solo el número del precio (por si viene con signo o coma)
      const precioTexto = btn.textContent.replace(/[^0-9.,]/g, '').replace(',', '.');
      const precio = parseFloat(precioTexto);

      const imagen = producto.querySelector('img').src;

      const productoData = {
        id: Date.now(),
        nombre,
        descripcion,
        precio,
        imagen
      };

      let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      carrito.push(productoData);
      localStorage.setItem('carrito', JSON.stringify(carrito));

      alert('Producto agregado al carrito');
    });
  });

  // Mostrar productos en el carrito
  const contenedor = document.getElementById('carrito-contenido');
  if (contenedor) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    carrito = carrito.filter(item => item.id && typeof item.precio === 'number');
    localStorage.setItem('carrito', JSON.stringify(carrito));

    if (carrito.length === 0) {
      contenedor.innerHTML = '<p class="carrito_vacio">No hay productos en el carrito.</p>';
    } else {
      carrito.forEach((item) => {
        const productoHTML = `
          <div class="contenido">
            <div class="pedido">
              <div class="imagen_pedidos">
                <img src="${item.imagen}" alt="">
              </div>
              <div class="descripcion_pedidos">
                <h4>${item.nombre}</h4>
                <label>${item.descripcion}</label>
                <p><strong>$${item.precio.toLocaleString('es-CO', { minimumFractionDigits: 3 })}</strong></p>
              </div>
              <div class="eliminar_pedidos">
                <button class="eliminar" data-id="${item.id}">
                  <img src="{{ url_for('static', filename='image/quitar-del-carrito.png') }}" alt="Eliminar">
                </button>
              </div>
            </div>
          </div>
        `;
        contenedor.insertAdjacentHTML('beforeend', productoHTML);
      });
    }
  }

  // Eliminar un solo producto del carrito
  document.addEventListener('click', function (e) {
    const btnEliminar = e.target.closest('.eliminar');
    if (btnEliminar) {
      const id = btnEliminar.dataset.id;
      let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      carrito = carrito.filter(producto => producto.id != id);
      localStorage.setItem('carrito', JSON.stringify(carrito));
      location.reload();
    }
  });
  

  // Mostrar resumen de la factura
  const subtotalEl = document.getElementById('subtotal');
  const ivaEl = document.getElementById('iva');
  const totalEl = document.getElementById('total');

  if (subtotalEl && ivaEl && totalEl) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const subtotal = carrito.reduce((sum, item) => sum + (parseFloat(item.precio) || 0), 0);
    const iva = Math.round(subtotal * 0.19);
    const total = subtotal + iva;

    subtotalEl.textContent = `$${subtotal.toLocaleString('es-CO', { minimumFractionDigits: 3 })}`;
    ivaEl.textContent = `$${iva.toLocaleString('es-CO', { minimumFractionDigits: 3 })}`;
    totalEl.textContent = `$${total.toLocaleString('es-CO', { minimumFractionDigits: 3 })}`;
  }
  
});
