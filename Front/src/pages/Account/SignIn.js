import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import Header from "../../components/home/Header/Header";
import Footer from "../../components/home/Footer/Footer";
import FooterBottom from "../../components/home/Footer/FooterBottom";
import { addUserInfo } from "../../redux/orebiSlice";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) => password.length >= 6;

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail("");
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validación de entrada
    if (!email) {
      setErrEmail("Ingrese su correo electrónico");
      return;
    } else if (!isValidEmail(email)) {
      setErrEmail("Formato de correo electrónico inválido");
      return;
    }

    if (!password) {
      setErrPassword("Ingrese su contraseña");
      return;
    } else if (!isValidPassword(password)) {
      setErrPassword("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      setLoading(true);
      
      // Hacer la petición de login directamente al endpoint correcto
      const response = await fetch("http://localhost:9000/api/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const userData = await response.json();
      
      // Guardar la información del usuario en Redux
      dispatch(addUserInfo({
        id: userData.ID_Usuario,
        email: userData.Email,
        nombre: userData.Nombre,
        telefono: userData.Telefono,
        ciudad: userData.Ciudad,
        codPostal: userData.CodPostal,
        direccion: userData.Direccion,
        fotoPerfil: userData.FotoPerfil,
        rol: userData.ID_Rol
      }));

      setSuccessMsg("¡Inicio de sesión exitoso!");
      setLoading(false);

      // Redirigir después de un breve delay
      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      setLoading(false);
      setErrorMsg(error.message || "Error al iniciar sesión");
    }
  };

  return (
    <>
      <Header />
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex align-center">
          {/* Mensaje de éxito */}
          {successMsg && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="bg-white p-10 rounded-lg shadow-lg text-center w-96 h-72 flex flex-col items-center justify-center"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-lg font-semibold mb-6">{successMsg}</p>
                <motion.div
                  className="w-16 h-16 border-4 border-green-500 rounded-full flex items-center justify-center mb-4"
                >
                  <motion.div
                    className="text-green-500 text-3xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    ✔
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* Mensaje de error */}
          {errorMsg && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="bg-white p-10 rounded-lg shadow-lg text-center w-96 h-72 flex flex-col items-center justify-center"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-lg font-semibold mb-6 text-red-500">{errorMsg}</p>
                <motion.div
                  className="w-16 h-16 border-4 border-red-500 rounded-full flex items-center justify-center"
                >
                  <motion.div
                    className="text-red-500 text-4xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    ✖
                  </motion.div>
                </motion.div>
                <button
                  onClick={() => setErrorMsg("")}
                  className="mt-6 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
                >
                  Reintentar
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* Formulario de inicio de sesión */}
          {!successMsg && !errorMsg && (
            <form className="w-full lgl:w-[450px] h-screen flex items-center justify-center" onSubmit={handleSignIn}>
              <div className="px-6 py-4 w-full h-[90%] flex flex-col justify-center overflow-y-scroll scrollbar-thin scrollbar-thumb-primeColor">
                <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-3xl mdl:text-4xl mb-4">
                  Iniciar Sesión
                </h1>
                <div className="flex flex-col gap-3">
                  {/* Campo de email */}
                  <div className="flex flex-col gap-0.5">
                    <p className="font-titleFont text-base font-semibold text-gray-600">
                      Correo Electrónico
                    </p>
                    <input
                      onChange={handleEmail}
                      value={email}
                      className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border border-gray-400 outline-none"
                      type="email"
                      placeholder="Ingrese su correo electrónico"
                    />
                    {errEmail && (
                      <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                        <span className="font-bold italic mr-1">!</span>
                        {errEmail}
                      </p>
                    )}
                  </div>

                  {/* Campo de contraseña */}
                  <div className="flex flex-col gap-0.5">
                    <p className="font-titleFont text-base font-semibold text-gray-600">
                      Contraseña
                    </p>
                    <input
                      onChange={handlePassword}
                      value={password}
                      className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border border-gray-400 outline-none"
                      type="password"
                      placeholder="Ingrese su contraseña"
                    />
                    {errPassword && (
                      <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                        <span className="font-bold italic mr-1">!</span>
                        {errPassword}
                      </p>
                    )}
                  </div>

                  {/* Botón de inicio de sesión */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`bg-primeColor hover:bg-black text-gray-200 hover:text-white cursor-pointer w-full text-base font-medium h-10 rounded-md duration-300 ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Iniciando sesión..." : "Ingresar"}
                  </button>

                  {/* Link de registro */}
                  <p className="text-sm text-center font-titleFont font-medium">
                    ¿No tienes cuenta?{" "}
                    <Link to="/signup">
                      <span className="hover:text-blue-600 duration-300">
                        Regístrate aquí
                      </span>
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
      <FooterBottom />
    </>
  );
};

export default SignIn;