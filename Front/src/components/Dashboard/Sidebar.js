import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path); // Navega a la ruta correspondiente
  };

  return (
    <div className="w-64 h-full bg-gray-800 text-white p-4">
      <h2 className="text-lg font-bold mb-4">Panel de Control</h2>
      <ul className="space-y-2">
        <li>
          <button onClick={() => handleNavigation('/usuarios')} className="w-full text-left hover:bg-gray-700 p-2 rounded">
            Usuarios
          </button>
        </li>
        <li>
          <button onClick={() => handleNavigation('/productos')} className="w-full text-left hover:bg-gray-700 p-2 rounded">
            Productos
          </button>
        </li>
        <li>
          <button onClick={() => handleNavigation('/customizaciones')} className="w-full text-left hover:bg-gray-700 p-2 rounded">
            Customizaciones
          </button>
        </li>
        <li>
          <button onClick={() => handleNavigation('/pedidos')} className="w-full text-left hover:bg-gray-700 p-2 rounded">
            Pedidos
          </button>
        </li>
        <li>
          <button onClick={() => handleNavigation('/ventas')} className="w-full text-left hover:bg-gray-700 p-2 rounded">
            Ventas
          </button>
        </li>
        <li>
          <button onClick={() => handleNavigation('/mensajes')} className="w-full text-left hover:bg-gray-700 p-2 rounded">
            Mensajes
          </button>
        </li>
        <li>
          <button onClick={() => handleNavigation('/banners')} className="w-full text-left hover:bg-gray-700 p-2 rounded">
            Banners
          </button>
        </li>
        <li>
          <button onClick={() => handleNavigation('/ofertas')} className="w-full text-left hover:bg-gray-700 p-2 rounded">
            Ofertas
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;