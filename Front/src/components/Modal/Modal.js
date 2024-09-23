import React from 'react';
import { motion } from 'framer-motion';

const Modal = ({ message, loading, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div 
        initial={{ scale: 0 }} 
        animate={{ scale: 1 }} 
        exit={{ scale: 0 }} 
        className="bg-white rounded-lg p-6 shadow-lg"
      >
        {loading && (
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-3 text-blue-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"></path>
            </svg>
            <span>{message}</span>
          </div>
        )}
        {!loading && (
          <div className="flex flex-col items-center">
            <span>{message}</span>
            <button onClick={onClose} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">
              Cerrar
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Modal;