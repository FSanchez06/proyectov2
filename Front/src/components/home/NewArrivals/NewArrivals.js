import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import Heading from '../Products/Heading';
import Product from '../Products/Product';
import SampleNextArrow from './SampleNextArrow';
import SamplePrevArrow from './SamplePrevArrow';

const NewArrivals = () => {
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3002/products')
      .then(response => response.json())
      .then(data => {
        // Filtrar productos con badge true
        const filteredProducts = data.filter(product => product.badge);
        
        // Ordenar productos por fecha de creación (suponiendo que hay un campo 'createdAt')
        const sortedProducts = filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Actualizar el badge del más antiguo a false, si hay más de 8 productos
        if (sortedProducts.length > 8) {
          sortedProducts[sortedProducts.length - 1].badge = false; // Actualiza el badge del más antiguo
        }

        // Tomar solo los 8 más recientes
        setNewArrivals(sortedProducts.slice(0, 8));
      });
  }, []);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
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
          <div className="px-2" key={product._id}>
            <Product
              _id={product._id}
              img={product.img}
              productName={product.productName}
              price={product.price}
              color={product.color}
              badge={product.badge}
              des={product.des}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default NewArrivals;
