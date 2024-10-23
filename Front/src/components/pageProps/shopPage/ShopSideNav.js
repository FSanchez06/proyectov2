import React from "react";
import Color from "./shopBy/Color";

const ShopSideNav = ({ setSelectedColor }) => {
  return (
    <div className="w-full flex flex-col gap-6">
      <Color setSelectedColor={setSelectedColor} /> {/* Pasar la función al componente de Color */}
    </div>
  );
};

export default ShopSideNav;