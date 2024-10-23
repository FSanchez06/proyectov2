import React, { useState } from "react";
import { motion } from "framer-motion";
import NavTitle from "./NavTitle";

const Color = ({ setSelectedColor }) => {
  const [showColors, setShowColors] = useState(true);

  const colors = [
    { _id: 9001, title: "Verde", base: "#22c55e" },
    { _id: 9002, title: "Naranja", base: "#f97316" },
    { _id: 9003, title: "Beige", base: "#f5f5dc" },
    { _id: 9004, title: "Blanco", base: "#ffffff" },
    { _id: 9005, title: "Negro", base: "#000000" },
    { _id: 9006, title: "Gris", base: "#6b7280" },
    { _id: 9007, title: "Azul", base: "#3b82f6" },
    { _id: 9008, title: "Morado", base: "#a855f7" },
  ];

  const handleColorClick = (colorTitle) => {
    setSelectedColor(colorTitle); // Actualizar el color seleccionado
  };

  return (
    <div>
      <div onClick={() => setShowColors(!showColors)} className="cursor-pointer">
        <NavTitle title="Colores" icons={true} />
      </div>
      {showColors && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
            {colors.map((item) => (
              <li
                key={item._id}
                onClick={() => handleColorClick(item.title)} // Llamar a la función cuando se haga clic
                className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 cursor-pointer"
              >
                <span style={{ background: item.base }} className={`w-3 h-3 rounded-full`}></span>
                {item.title}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default Color;