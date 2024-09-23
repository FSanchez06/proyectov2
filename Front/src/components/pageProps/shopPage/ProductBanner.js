import React, { useState } from "react";
import { BsGridFill } from "react-icons/bs";
import { GoTriangleDown } from "react-icons/go";

const ProductBanner = ({ itemsPerPageFromBanner, setGridViewActive }) => {
  const [gridViewActive, setLocalGridViewActive] = useState(true); // Local state to manage grid/list view
  
  // Function to handle grid view click
  const handleGridView = () => {
    setLocalGridViewActive(true);  // Update local state for grid view
    setGridViewActive(true);       // Propagate the view change to parent (Shop.js)
  };


  return (
    <div className="w-full flex flex-col md:flex-row md:items-center justify-between">
      {/* =========================================================
                            Left Part Start here
        ======================================================== */}
      <div className="flex items-center gap-4">
        {/* Grid View Icon */}
        <span
          className={`${
            gridViewActive
              ? "bg-primeColor text-white"
              : "border-[1px] border-gray-300 text-[#737373]"
          } w-8 h-8 text-lg flex items-center justify-center cursor-pointer`}
          onClick={handleGridView}  // Set Grid view on click
        >
          <BsGridFill />
        </span>

        
      </div>
      {/* =========================================================
                            Left Part End here
        ======================================================== */}
      
      {/* =========================================================
                            Right Part Start here
        ======================================================== */}
      <div className="flex items-center gap-2 md:gap-6 mt-4 md:mt-0">
        <div className="flex items-center gap-2 text-[#767676] relative">
          <label className="block">Mostrar:</label>
          <select
            onChange={(e) => itemsPerPageFromBanner(+e.target.value)} // Update items per page
            id="countries"
            className="w-16 md:w-20 border-[1px] border-gray-200 py-1 px-4 cursor-pointer text-primeColor text-base block dark:placeholder-gray-400 appearance-none focus-within:outline-none focus-visible:border-primeColor"
          >
            <option value="12">12</option>
            <option value="24">24</option>
            <option value="36">36</option>
            <option value="48">48</option>
          </select>
          <span className="absolute text-sm right-3 top-2.5">
            <GoTriangleDown />
          </span>
        </div>
      </div>
      {/* =========================================================
                            Right Part End here
        ======================================================== */}
    </div>
  );
};

export default ProductBanner;
