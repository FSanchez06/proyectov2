import React, { useState, useEffect } from 'react';
import Heading from '../Products/Heading';
import Product from '../Products/Product';

const BestSellers = () => {
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:9000/api/productos') // Fetching all products
      .then(response => response.json())
      .then(data => {
        // Mezclar los productos aleatoriamente
        const shuffledProducts = data.sort(() => 0.5 - Math.random());
        
        // Seleccionar los primeros 4 productos después de mezclar
        const randomBestSellers = shuffledProducts.slice(0, 4);
        
        setBestSellers(randomBestSellers);
      });
  }, []);

  return (
    <div className="w-full pb-20">
      <Heading heading="Lo más Vendido" />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-4 gap-10">
        {bestSellers.map(product => (
          <Product
            key={product.ID_Producto}  // Asegúrate de usar el campo correcto de ID de producto
            _id={product.ID_Producto}
            img={product.ImgProducto}  // Asegúrate de usar los nombres correctos de las propiedades
            productName={product.NombreProducto}
            price={product.PrecioProducto}
            color={product.Color}
            badge={product.Insignia}
            des={product.Descripcion}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSellers;
