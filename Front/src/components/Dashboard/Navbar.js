import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeUserInfo } from '../../redux/orebiSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Modal from '../Modal/Modal'; // Asegúrate de importar el nuevo componente Modal

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.orebiReducer.userInfo[0]); // Accede a la información del primer usuario
  const [dropdownOpen, setDropdownOpen] = useState(false); // Estado para controlar el menú desplegable
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal
  const [loadingMessage, setLoadingMessage] = useState('');
  const dropdownRef = useRef(null); // Ref para el menú desplegable

  const handleLogout = () => {
    setLoadingMessage('Cerrando sesión...');
    setDropdownOpen(false);
    setModalVisible(true);
    
    setTimeout(() => {
      dispatch(removeUserInfo()); // Despacha la acción para eliminar la información del usuario
      navigate('/signin'); // Redirige a la página de inicio de sesión
    }, 3000); // Espera 3 segundos antes de cerrar sesión
  };

  const handleRedirect = () => {
    setLoadingMessage(`Redirigiendo al perfil del usuario ${userInfo.name}...`);
    setDropdownOpen(false);
    setModalVisible(true);
    
    setTimeout(() => {
      navigate('/profile'); // Redirige al perfil después de mostrar el mensaje
    }, 3000); // Espera 3 segundos antes de redirigir
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev); // Alterna el estado del menú desplegable
  };

  // Cierra el menú si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className='bg-white text-gray-900 border-b border-gray-300 p-4 flex justify-between items-center'>
      {/* Mensaje de bienvenida con animación */}
      {userInfo ? (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className='flex-grow text-center'
        >
          <span className='text-lg font-semibold'>
            Bienvenido {userInfo.name} al panel de control de {userInfo.role}
          </span>
        </motion.div>
      ) : (
        <button 
          onClick={() => navigate('/signin')} 
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200'
        >
          Login
        </button>
      )}

      {/* Apartado del usuario a la derecha */}
      {userInfo && (
        <div className='relative flex items-center ml-4'>
          <button onClick={toggleDropdown} className='flex items-center'>
            <img src={userInfo.photo} alt="Profile" className='w-10 h-10 rounded-full border border-gray-300' />
            <span className='ml-2 font-medium text-gray-800'>{userInfo.name}</span>
          </button>

          {/* Menú desplegable */}
          {dropdownOpen && (
            <motion.div 
              ref={dropdownRef} // Asignar ref al menú desplegable
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.3 }}
              className='absolute right-0 mt-28 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10'
            >
              <button 
                onClick={handleRedirect} 
                className='block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left'
              >
                Regresar
              </button>
              <button 
                onClick={handleLogout} 
                className='block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left'
              >
                Cerrar Sesión
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* Ventana modal */}
      {modalVisible && (
        <Modal message={loadingMessage} loading={true} onClose={() => setModalVisible(false)} />
      )}
    </div>
  );
};

export default Navbar;