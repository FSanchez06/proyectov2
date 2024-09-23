import React from 'react';
import { motion } from 'framer-motion';
import { FaBox, FaCog, FaShoppingCart, FaUsers } from 'react-icons/fa';

const Card = ({ icon, title, value }) => {
  return (
    <motion.div 
      className="bg-white text-gray-900 p-4 rounded-lg shadow-md flex items-center space-x-6" // Cambiado a fondo blanco y texto oscuro
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-3xl text-gray-500">{icon}</div>
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-xl">{value}</p>
      </div>
    </motion.div>
  );
};

export default Card;