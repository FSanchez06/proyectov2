import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import Heading from '../Products/Heading';
import Product from '../Products/Product';
import SampleNextArrow from './SampleNextArrow';
import SamplePrevArrow from './SamplePrevArrow';

const NewArrivals = () => {
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    fetch('http://localhost:9000/api/productos')
      .then(response => response.json())
      .then(data => {
        // Filtrar productos con insignia (badge) verdadera
        const filteredProducts = data.filter(product => product.Insignia);

        // Ordenar productos por su ID (puedes ajustar esto a otro campo de fecha si lo agregas)
        const sortedProducts = filteredProducts.sort((a, b) => b.ID_Producto - a.ID_Producto);

        // Si hay más de 8 productos, marcar el más antiguo como insignia falsa
        if (sortedProducts.length > 8) {
          sortedProducts[sortedProducts.length - 1].Insignia = false; // Actualiza el badge del más antiguo
        }

        // Tomar solo los 8 más recientes
        setNewArrivals(sortedProducts.slice(0, 8));
      });
  }, []);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(4, newArrivals.length), // Asegurarse de no mostrar más slides de los disponibles
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: Math.min(3, newArrivals.length),
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: Math.min(2, newArrivals.length),
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };

  return (
    <div className="w-full pb-16">
      <Heading heading="Nuevos Productos" />
      <Slider {...settings}>
        {newArrivals.map(product => (
          <div className="px-2" key={product.ID_Producto}>
            <Product
              _id={product.ID_Producto}
              img={product.ImgProducto}
              productName={product.NombreProducto}
              price={product.PrecioProducto}
              color={product.Color}
              badge={product.Insignia}
              des={product.Descripcion}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default NewArrivals;
