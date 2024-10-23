import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import Product from "../../home/Products/Product";

function Items({ currentItems }) {
  return (
    <>
      {currentItems &&
        currentItems.map((item) => (
          <div key={item.ID_Producto} className="w-full">
            <Product
              _id={item.ID_Producto}
              img={item.ImgProducto}
              productName={item.NombreProducto}
              price={item.PrecioProducto}
              color={item.Color}
              badge={item.Insignia}
              des={item.Descripcion}
            />
          </div>
        ))}
    </>
  );
}

const Pagination = ({ itemsPerPage }) => {
  const [products, setProducts] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const [itemStart, setItemStart] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/productos"); // Cambia a tu URL de API
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = products.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(products.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % products.length;
    setItemOffset(newOffset);
    setItemStart(newOffset + 1); // Ajustar para mostrar el inicio correcto
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mdl:gap-4 lg:gap-10">
        <Items currentItems={currentItems} />
      </div>
      <div className="flex flex-col mdl:flex-row justify-center mdl:justify-between items-center">
        <ReactPaginate
          nextLabel=""
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel=""
          pageLinkClassName="w-9 h-9 border-[1px] border-lightColor hover:border-gray-500 duration-300 flex justify-center items-center"
          pageClassName="mr-6"
          containerClassName="flex text-base font-semibold font-titleFont py-10"
          activeClassName="bg-black text-white"
        />
        <p className="text-base font-normal text-lightText">
          Productos del {itemStart} al {endOffset} de {products.length}
        </p>
      </div>
    </div>
  );
};

export default Pagination;