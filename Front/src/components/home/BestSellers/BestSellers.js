import React, { useState, useEffect } from 'react';
import Heading from '../Products/Heading';
import Product from '../Products/Product';

const BestSellers = () => {
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3002/products') // Fetching all products
      .then(response => response.json())
      .then(data => {
        // Filter to get only best sellers (assuming they have specific IDs)
        const filteredBestSellers = data.filter(product =>
          ['100008', '100009', '100010', '100011'].includes(product._id)
        );
        setBestSellers(filteredBestSellers);
      });
  }, []);

  return (
    <div className="w-full pb-20">
      <Heading heading="Lo mas Vendido" />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-4 gap-10">
        {bestSellers.map(product => (
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

export default BestSellers;