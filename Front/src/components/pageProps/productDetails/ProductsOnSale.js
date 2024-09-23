import React, { useEffect, useState } from "react";

const ProductsOnSale = () => {
  const [products, setProducts] = useState([]);

  // Función para obtener 4 productos al azar
  const getRandomProducts = (productsArray) => {
    const shuffled = [...productsArray].sort(() => 0.5 - Math.random()); // Baraja los productos
    return shuffled.slice(0, 4); // Retorna los primeros 4 productos
  };

  // Usamos useEffect para obtener los productos desde la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3002/products"); // Ajusta la URL si es necesario
        const data = await response.json();
        const randomProducts = getRandomProducts(data);
        setProducts(randomProducts);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <h3 className="font-titleFont text-xl font-semibold mb-6 underline underline-offset-4 decoration-[1px]">
        Más Productos
      </h3>
      <div className="flex flex-col gap-2">
        {products.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-4 border-b-[1px] border-b-gray-300 py-2"
          >
            <div>
              <img className="w-24" src={item.img} alt={item.productName} />
            </div>
            <div className="flex flex-col gap-2 font-titleFont">
              <p className="text-base font-medium">{item.productName}</p>
              <p className="text-sm font-semibold">${item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsOnSale;
