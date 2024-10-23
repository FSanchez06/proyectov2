import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; 
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import axios from "axios";

const Contact = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [prevLocation, setPrevLocation] = useState("");
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [completed, setCompleted] = useState(false);

  const [errClientName, setErrClientName] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    setPrevLocation(location.state?.data || "Inicio");
  }, [location]);

  const handleName = (e) => {
    setClientName(e.target.value);
    setErrClientName("");
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail("");
  };

  const handleMessage = (e) => {
    setMessage(e.target.value);
    setErrMessage("");
  };

  const EmailValidation = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrClientName("");
    setErrEmail("");
    setErrMessage("");
    setSuccessMsg(false);

    if (!clientName) {
      setErrClientName("Ingrese su nombre");
      return;
    }
    if (!email) {
      setErrEmail("Ingrese su email");
      return;
    } else if (!EmailValidation(email)) {
      setErrEmail("Email no válido");
      return;
    }
    if (!message) {
      setErrMessage("Ingrese un mensaje");
      return;
    }

    try {
      const response = await axios.post("http://localhost:9000/api/mensajes", {
        NombreUsuario: clientName,
        EmailUsuario: email,
        Mensaje: message,
        ID_Usuario: 3, // Aquí debes cambiar el ID si es dinámico
      });

      if (response.status === 200 || response.status === 201) {
        setCompleted(true);
        setSuccessMsg(true);
        setClientName("");
        setEmail("");
        setMessage("");
      }
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };

  const handleNavigateBack = () => {
    navigate(-0);
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Contacto" prevLocation={prevLocation} />
      {successMsg ? (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white p-10 rounded-lg shadow-lg text-center w-[400px] h-[300px] flex flex-col items-center justify-center"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {completed && (
              <>
                <p className="text-lg font-semibold mb-6">
                  Mensaje enviado correctamente
                </p>
                <motion.div
                  className="w-16 h-16 border-4 border-green-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="text-green-500 text-4xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    ✔
                  </motion.div>
                </motion.div>
                <button
                  onClick={handleNavigateBack}
                  className="mt-6 bg-primeColor text-white px-4 py-2 rounded-md hover:bg-black transition duration-300"
                >
                  Seguir navegando
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      ) : (
        <form className="pb-20 ml-5" onSubmit={handleSubmit}>
          <h1 className="font-titleFont font-semibold text-3xl">
            Llene el Formulario
          </h1>
          <div className="w-[500px] h-auto py-6 flex flex-col gap-6">
            <div>
              <p className="text-base font-titleFont font-semibold px-2">Nombre</p>
              <input
                onChange={handleName}
                value={clientName}
                className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                type="text"
                placeholder="Ingrese su Nombre"
              />
              {errClientName && (
                <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2">
                  {errClientName}
                </p>
              )}
            </div>
            <div>
              <p className="text-base font-titleFont font-semibold px-2">Email</p>
              <input
                onChange={handleEmail}
                value={email}
                className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                type="email"
                placeholder="Ingrese su Email"
              />
              {errEmail && (
                <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2">
                  {errEmail}
                </p>
              )}
            </div>
            <div>
              <p className="text-base font-titleFont font-semibold px-2">Mensaje</p>
              <textarea
                onChange={handleMessage}
                value={message}
                cols="30"
                rows="3"
                className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor resize-none"
                placeholder="Ingrese el Mensaje"
              />
              {errMessage && (
                <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2">
                  {errMessage}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-44 bg-primeColor text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:bg-black hover:text-white duration-200"
            >
              Enviar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Contact;
