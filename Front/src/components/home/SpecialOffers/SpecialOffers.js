import React, { useState, useEffect } from 'react';
import Heading from '../Products/Heading';
import Product from '../Products/Product';

const SpecialOffers = () => {
  const [specialOffers, setSpecialOffers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:9000/api/productos') // Ajusta la URL de la API si es necesario
      .then(response => response.json())
      .then(data => {
        // Ordenar los productos por precio ascendente
        const sortedByPrice = data.sort((a, b) => a.PrecioProducto - b.PrecioProducto);
        // Seleccionar los primeros 4 productos con los precios más bajos
        const lowestPriceProducts = sortedByPrice.slice(0, 4);
        setSpecialOffers(lowestPriceProducts);
      })
      .catch(error => {
        console.error("Error al obtener los productos:", error);
      });
  }, []);

  return (
    <div className="w-full pb-20">
      <Heading heading="Ofertas Especiales" />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-4 gap-10">
        {specialOffers.map(product => (
          <Product
            key={product.ID_Producto} // Asegúrate de que la clave coincida con el ID de la base de datos
            _id={product.ID_Producto}
            img={product.ImgProducto}  // Campo de imagen correcto
            productName={product.NombreProducto}
            price={product.PrecioProducto}  // Campo de precio correcto
            color={product.Color}
            badge={product.Insignia}  // Badge para marcar los productos especiales
            des={product.Descripcion}  // Campo de descripción correcto
          />
        ))}
      </div>
    </div>
  );
};

export default SpecialOffers;
