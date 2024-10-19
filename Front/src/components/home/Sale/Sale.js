import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Image from "../../designLayouts/Image";

const Sale = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetch('http://localhost:9000/api/images')
      .then(response => response.json())
      .then(data => setSales(data));
  }, []);

  return (
    <div className="py-20 flex flex-col md:flex-row items-center justify-between gap-4 lg:gap-10">
      {/* Left Image */}
      <div className="w-full md:w-2/3 lg:w-1/2 h-full">
        {sales.length > 0 && (
          <Link to="/shop">
            <img 
              className="w-full h-128 object-cover rounded-lg" // Height for left image
              src={sales[0].ImageHome} 
              alt="Sale Item" 
            />
          </Link>
        )}
      </div>
      
      {/* Right Images */}
      <div className="w-full md:w-2/3 lg:w-1/2 h-auto flex flex-col gap-4 lg:gap-10">
        {sales.length > 1 && (
          <div className="h-1/2 w-full flex flex-col gap-4">
            <Link to="/shop" className="flex-grow">
              <img 
                className="w-full h-80 object-cover rounded-lg" // Increased height for right images
                src={sales[1].ImageHome} 
                alt="Sale Item" 
              />
            </Link>
            <Link to="/shop" className="flex-grow">
              <img 
                className="w-full h-80 object-cover rounded-lg" // Increased height for right images
                src={sales[2].ImageHome} 
                alt="Sale Item" 
              />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sale;