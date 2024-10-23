import React, { useState, useEffect } from "react";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import Pagination from "../../components/pageProps/shopPage/Pagination";
import ProductBanner from "../../components/pageProps/shopPage/ProductBanner";
import ShopSideNav from "../../components/pageProps/shopPage/ShopSideNav";

const Shop = () => {
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [products, setProducts] = useState([]); // Estado para productos
  const [filteredProducts, setFilteredProducts] = useState([]); // Estado para productos filtrados
  const [selectedColor, setSelectedColor] = useState(""); // Estado para el color seleccionado
  const [gridViewActive, setGridViewActive] = useState(true); // Nuevo estado para vista de rejilla o lista

  const itemsPerPageFromBanner = (itemsPerPage) => {
    setItemsPerPage(itemsPerPage);
  };

  // Llamada a la API para obtener los productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/productos"); // Cambia a tu puerto y ruta correcta
        const data = await response.json();
        setProducts(data); // Guardar los productos en el estado
        setFilteredProducts(data); // Inicialmente, todos los productos están visibles
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Filtrar productos por color seleccionado
  useEffect(() => {
    if (selectedColor) {
      const filtered = products.filter((product) =>
        product.color.toLowerCase().includes(selectedColor.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products); // Si no hay color seleccionado, mostrar todos los productos
    }
  }, [selectedColor, products]);

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Productos" />
      {/* ================= Products Start here =================== */}
      <div className="w-full h-full flex pb-20 gap-10">
        <div className="w-[20%] lgl:w-[25%] hidden mdl:inline-flex h-full">
          <ShopSideNav setSelectedColor={setSelectedColor} /> {/* Pasamos la función de selección de color */}
        </div>
        <div className="w-full mdl:w-[80%] lgl:w-[75%] h-full flex flex-col gap-10">
          {/* Pasamos la función para controlar la vista de rejilla/lista */}
          <ProductBanner itemsPerPageFromBanner={itemsPerPageFromBanner} setGridViewActive={setGridViewActive} />
          
          {/* Pasamos el estado de gridViewActive al componente de paginación */}
          <Pagination items={filteredProducts} itemsPerPage={itemsPerPage} gridViewActive={gridViewActive} />
        </div>
      </div>
      {/* ================= Products End here ===================== */}
    </div>
  );
};

export default Shop;
