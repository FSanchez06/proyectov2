import React, { useState, useEffect } from "react";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import Pagination from "../../components/pageProps/shopPage/Pagination";
import ProductBanner from "../../components/pageProps/shopPage/ProductBanner";
import ShopSideNav from "../../components/pageProps/shopPage/ShopSideNav";

const Shop = () => {
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/productos");
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data); // Inicialmente mostrar todos los productos
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedColor) {
      const filtered = products.filter((product) =>
        product.Color.toLowerCase() === selectedColor.toLowerCase() // Comparar en minúsculas
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products); // Si no hay color seleccionado, mostrar todos los productos
    }
  }, [selectedColor, products]);

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Productos" />
      <div className="w-full h-full flex pb-20 gap-10">
        <div className="w-[20%] lgl:w-[25%] hidden mdl:inline-flex h-full">
          <ShopSideNav setSelectedColor={setSelectedColor} />
        </div>
        <div className="w-full mdl:w-[80%] lgl:w-[75%] h-full flex flex-col gap-10">
          <ProductBanner itemsPerPageFromBanner={setItemsPerPage} />
          <Pagination items={filteredProducts} itemsPerPage={itemsPerPage} />
        </div>
      </div>
    </div>
  );
};

export default Shop;