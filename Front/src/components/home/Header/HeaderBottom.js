import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaUser, FaCaretDown, FaShoppingCart } from "react-icons/fa";
import Flex from "../../designLayouts/Flex";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";  // Importar Axios para hacer la petición a la API
import { useSelector, useDispatch } from "react-redux";
import { removeUserInfo, resetCart } from "../../../redux/orebiSlice"; // Importar acciones de Redux
import Product from "../Products/Product"; // Importar el componente Product

const HeaderBottom = () => {
  const products = useSelector((state) => state.orebiReducer.products);  // Estado global para los productos
  const userInfo = useSelector((state) => state.orebiReducer.userInfo);  // Estado global para el usuario
  const [show, setShow] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);  // Estado para mostrar el modal de logout
  const navigate = useNavigate();
  const dispatch = useDispatch();  // Para manejar acciones de Redux
  const ref = useRef();

  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (ref.current && ref.current.contains(e.target)) {
        setShow(true);
      } else {
        setShow(false);
      }
    });
  }, [show, ref]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);

  // Estado para manejar los productos de la API
  const [apiProducts, setApiProducts] = useState([]);

  // Efecto para obtener los productos desde la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:9000/api/productos");  // Aquí haces la petición a tu API
        setApiProducts(response.data);  // Guardas los productos obtenidos de la API
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };
    fetchProducts();  // Ejecutas la función que obtiene los productos
  }, []);

  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filtrar productos cuando cambia el término de búsqueda
  useEffect(() => {
    const filtered = apiProducts.filter((item) =>
      item.NombreProducto.toLowerCase().includes(searchQuery.toLowerCase())  // Asegúrate de usar el campo correcto
    );
    setFilteredProducts(filtered);
  }, [searchQuery, apiProducts]);

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    dispatch(removeUserInfo());  // Eliminar información del usuario del estado global
    dispatch(resetCart());  // Resetear el carrito (opcional)
    navigate("/signin");  // Redirigir al login
    setShowLogoutModal(false);  // Cerrar el modal
  };

  return (
    <div className="w-full bg-[#F5F5F3] relative">
      <div className="max-w-container mx-auto">
        <Flex className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full px-4 pb-4 lg:pb-0 h-full lg:h-24">
          <div
            onClick={() => setShow(!show)}
            ref={ref}
            className="flex h-14 cursor-pointer items-center gap-2 text-primeColor"
          >
            {/* Espacio para añadir íconos o más contenido */}
          </div>

          <div className="relative w-full lg:w-[600px] h-[50px] text-base text-primeColor bg-white flex items-center gap-2 justify-between px-6 rounded-xl">
            <input
              className="flex-1 h-full outline-none placeholder:text-[#C4C4C4] placeholder:text-[14px]"
              type="text"
              onChange={handleSearch}
              value={searchQuery}
              placeholder="Busca los productos aquí"
            />
            <FaSearch className="w-5 h-5" />
            {searchQuery && (
              <div
                className={`w-full mx-auto h-96 bg-white top-16 absolute left-0 z-50 overflow-y-scroll shadow-2xl scrollbar-hide cursor-pointer`}
              >
                {filteredProducts.map((item) => (
                  <div
                    onClick={() => {
                      navigate(`/product/${item.NombreProducto.toLowerCase().split(" ").join("")}`, {
                        state: {
                          item: item,  // Aquí pasas el producto seleccionado como state
                        },
                      });
                      setShowSearchBar(false);
                      setSearchQuery("");
                    }}
                    key={item.ID_Producto}
                    className="max-w-[600px] h-28 bg-gray-100 mb-3 flex items-center gap-3"
                  >
                    <img className="w-24" src={item.ImgProducto} alt="productImg" />
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-lg">{item.NombreProducto}</p>
                      <p className="text-xs">{item.Descripcion}</p>
                      <p className="text-sm">
                        Precio:{" "}
                        <span className="text-primeColor font-semibold">
                          ${item.PrecioProducto}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-2 lg:mt-0 items-center pr-6 cursor-pointer relative">
            <div onClick={() => setShowUser(!showUser)} className="flex">
              <FaUser />
              <FaCaretDown />
            </div>
            {showUser && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute top-6 left-0 z-50 bg-primeColor w-44 text-[#767676] h-auto p-4 pb-6"
              >
                {!userInfo.length ? (
                  <>
                    <Link to="/signin">
                      <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                        Login
                      </li>
                    </Link>
                    <Link onClick={() => setShowUser(false)} to="/signup">
                      <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                        Registro
                      </li>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/profile">
                      <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                        Perfil
                      </li>
                    </Link>
                    <li
                      className="text-gray-400 px-4 py-1 hover:text-white duration-300 cursor-pointer"
                      onClick={() => setShowLogoutModal(true)}  // Mostrar modal al hacer clic en Log Out
                    >
                      Log Out
                    </li>
                  </>
                )}
              </motion.ul>
            )}
            <Link to="/cart">
              <div className="relative">
                <FaShoppingCart />
                <span className="absolute font-titleFont top-3 -right-2 text-xs w-4 h-4 flex items-center justify-center rounded-full bg-primeColor text-white">
                  {products.length > 0 ? products.length : 0}
                </span>
              </div>
            </Link>
          </div>
        </Flex>
      </div>

      {/* Modal de confirmación de Log Out */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <p className="text-lg font-semibold mb-4">¿Estás seguro de querer cerrar sesión?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleLogout}  // Cerrar sesión si selecciona "Sí"
              >
                Sí
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowLogoutModal(false)}  // Cerrar modal si selecciona "No"
              >
                No
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HeaderBottom;
