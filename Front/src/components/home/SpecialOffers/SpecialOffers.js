import React, { useState, useEffect } from 'react';
import Heading from '../Products/Heading';
import Product from '../Products/Product';

const SpecialOffers = () => {
  const [specialOffers, setSpecialOffers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3002/products') // Fetching all products
      .then(response => response.json())
      .then(data => {
        // Filter to get only special offers (assuming they have specific IDs)
        const filteredSpecialOffers = data.filter(product =>
          ['100012', '100013', '100014', '100015'].includes(product._id)
        );
        setSpecialOffers(filteredSpecialOffers);
      });
  }, []);

  return (
    <div className="w-full pb-20">
      <Heading heading="Ofertas Especiales" />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-4 gap-10">
        {specialOffers.map(product => (
          <Product
            key={product._id}
            _id={product._id}
            img={product.img}
            productName={product.productName}
            price={product.price}
            color={product.color}
            badge={product.badge}
            des={product.des}
          />
        ))}
      </div>
    </div>
  );
};

export default SpecialOffers;