import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../components/home/Footer/Footer";
import FooterBottom from "../../components/home/Footer/FooterBottom";
import Header from "../../components/home/Header/Header";
import bcrypt from "bcryptjs"; // Importar bcryptjs para la encriptación

const SignUp = () => {
  // Estado Inicial
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [checked, setChecked] = useState(false);

  // Mensajes de error y éxito
  const [errClientName, setErrClientName] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPhone, setErrPhone] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [errConfirmPassword, setErrConfirmPassword] = useState("");
  const [errAddress, setErrAddress] = useState("");
  const [errCity, setErrCity] = useState("");
  const [errZip, setErrZip] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Control de la animación de carga
  const [isLoading, setIsLoading] = useState(false);

  // Validaciones para Colombia
  const EmailValidation = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  };

  const PhoneValidation = (phone) => {
    return String(phone).match(/^[0-9]{10}$/); // Validación para números de Colombia
  };

  const ZipValidation = (zip) => {
    return String(zip).match(/^[0-9]{6}$/); // Validación de códigos postales en Colombia (6 dígitos)
  };

  // Manejo del registro
  const handleSignUp = async (e) => {
    e.preventDefault();

    // Limpiar mensajes anteriores
    setErrorMsg("");
    setSuccessMsg("");
    setErrClientName("");
    setErrEmail("");
    setErrPhone("");
    setErrPassword("");
    setErrConfirmPassword("");
    setErrAddress("");
    setErrCity("");
    setErrZip("");

    if (checked) {
      // Validaciones
      if (!clientName) setErrClientName("Ingrese su nombre completo");
      if (!email) setErrEmail("Ingrese su correo electrónico");
      else if (!EmailValidation(email)) setErrEmail("Ingrese un correo electrónico válido");
      if (!phone) setErrPhone("Ingrese su número de teléfono");
      else if (!PhoneValidation(phone)) setErrPhone("El número de teléfono debe ser de 10 dígitos");
      if (!password) setErrPassword("Cree una contraseña");
      else if (password.length < 6) setErrPassword("La contraseña debe tener al menos 6 caracteres");
      if (!confirmPassword) setErrConfirmPassword("Confirme su contraseña");
      else if (password !== confirmPassword) setErrConfirmPassword("Las contraseñas no coinciden");
      if (!address) setErrAddress("Ingrese su dirección");
      if (!city) setErrCity("Ingrese el nombre de su ciudad");
      if (!zip) setErrZip("Ingrese el código postal de su área");
      else if (!ZipValidation(zip)) setErrZip("El código postal debe tener 6 dígitos");

      // Si todas las validaciones son correctas
      if (
        clientName &&
        email &&
        EmailValidation(email) &&
        phone &&
        PhoneValidation(phone) &&
        password &&
        password.length >= 6 &&
        confirmPassword &&
        password === confirmPassword &&
        address &&
        city &&
        zip &&
        ZipValidation(zip)
      ) {
        setIsLoading(true); // Mostrar icono de carga

        // Encriptar la contraseña usando bcrypt
        const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

        // Petición POST a la API, incluyendo el rol "Cliente"
        const newUser = {
          name: clientName,
          email,
          phone,
          password: hashedPassword, // Usar la contraseña encriptada
          address,
          city,
          zip,
          role: "Cliente" // Añadir el rol "Cliente"
        };

        try {
          const response = await fetch("http://localhost:3002/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
          });

          if (response.ok) {
            const data = await response.json();
            setIsLoading(false);
            setSuccessMsg(`Hola ${data.name}, se ha registrado exitosamente.`);
            
            // Limpiar campos
            setClientName("");
            setEmail("");
            setPhone("");
            setPassword("");
            setConfirmPassword("");
            setAddress("");
            setCity("");
            setZip("");
          } else {
            throw new Error("Error al registrar. Inténtelo de nuevo.");
          }
        } catch (error) {
          setIsLoading(false);
          setErrorMsg(error.message);
        }
      } else {
        setErrorMsg("Por favor, complete todos los campos correctamente.");
      }
    } else {
      setErrorMsg("Debe aceptar los términos y condiciones.");
    }
  };

  // Función para reiniciar el formulario después de un error
  const handleRetry = () => {
    setErrorMsg("");
  };

  return (
    <>
      <Header />
      <div className="w-full h-screen flex items-center justify-center">
        <div className="mt-40 w-full lgl:w-[500px] h-full flex flex-col">
        <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-2xl mdl:text-3xl mb-4">
          Crear cuenta
        </h1>
          {/* Modal de éxito */}
          {successMsg && !isLoading && (
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
                <motion.div
                  className="w-16 h-16 border-4 border-green-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="text-green-500 text-4xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    ✓
                  </motion.div>
                </motion.div>
                <p className="text-lg font-semibold mt-6">{successMsg}</p>
                <Link to="/signin">
                  <button className="mt-6 bg-primeColor text-white px-4 py-2 rounded-md hover:bg-black transition duration-300">
                    Iniciar sesión
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          )}

          {/* Modal de carga */}
          {isLoading && (
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
                <div className="w-16 h-16 border-4 border-t-transparent border-primeColor rounded-full animate-spin"></div>
                <p className="text-lg font-semibold mt-6">Registrando...</p>
              </motion.div>
            </motion.div>
          )}

          {/* Modal de error */}
          {errorMsg && (
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
                <p className="text-lg font-semibold mb-6 text-red-500">{errorMsg}</p>
                <motion.div
                  className="flex justify-center items-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-16 h-16 border-4 border-red-500 rounded-full flex items-center justify-center">
                    <motion.div
                      className="text-red-500 text-4xl font-bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      ✖
                    </motion.div>
                  </div>
                </motion.div>
                <button
                  onClick={handleRetry}
                  className="mt-6 bg-primeColor text-white px-4 py-2 rounded-md hover:bg-black transition duration-300"
                >
                  Intentar de nuevo
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* Formulario */}
          {!successMsg && !isLoading && (
            <form className="w-full mx-auto" onSubmit={handleSignUp}>
              <div className="w-full flex flex-col gap-4">
                {/* Nombre */}
                <div className="flex flex-col gap-1">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Nombre completo
                  </p>
                  <input
                    onChange={(e) => setClientName(e.target.value)}
                    value={clientName}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="text"
                    placeholder="Ej. Juan Pérez"
                  />
                  {errClientName && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errClientName}
                    </p>
                  )}
                </div>

                {/* Correo */}
                <div className="flex flex-col gap-1">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Correo electrónico
                  </p>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="text"
                    placeholder="Ej. juanperez@gmail.com"
                  />
                  {errEmail && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errEmail}
                    </p>
                  )}
                </div>

                {/* Teléfono */}
                <div className="flex flex-col gap-1">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Número de teléfono
                  </p>
                  <input
                    onChange={(e) => setPhone(e.target.value)}
                    value={phone}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="text"
                    placeholder="Ej. 300 123 4567"
                  />
                  {errPhone && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errPhone}
                    </p>
                  )}
                </div>

                {/* Contraseña */}
                <div className="flex flex-col gap-1">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Contraseña
                  </p>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="password"
                    placeholder="******"
                  />
                  {errPassword && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errPassword}
                    </p>
                  )}
                </div>

                {/* Confirmar contraseña */}
                <div className="flex flex-col gap-1">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Confirmar contraseña
                  </p>
                  <input
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="password"
                    placeholder="******"
                  />
                  {errConfirmPassword && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errConfirmPassword}
                    </p>
                  )}
                </div>

                {/* Dirección */}
                <div className="flex flex-col gap-1">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Dirección
                  </p>
                  <input
                    onChange={(e) => setAddress(e.target.value)}
                    value={address}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="text"
                    placeholder="Ej. Calle 123 #45-67"
                  />
                  {errAddress && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errAddress}
                    </p>
                  )}
                </div>

                {/* Ciudad */}
                <div className="flex flex-col gap-1">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Ciudad
                  </p>
                  <input
                    onChange={(e) => setCity(e.target.value)}
                    value={city}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="text"
                    placeholder="Ej. Bogotá"
                  />
                  {errCity && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errCity}
                    </p>
                  )}
                </div>

                {/* Código Postal */}
                <div className="flex flex-col gap-1">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Código Postal
                  </p>
                  <input
                    onChange={(e) => setZip(e.target.value)}
                    value={zip}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="text"
                    placeholder="Ej. 110111"
                  />
                  {errZip && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errZip}
                    </p>
                  )}
                </div>

                {/* Aceptar términos */}
                <div className="flex items-center gap-2 text-sm">
                  <input
                    onChange={(e) => setChecked(e.target.checked)}
                    className="w-4 h-4 accent-primeColor"
                    type="checkbox"
                    id="terms"
                  />
                  <label
                    htmlFor="terms"
                    className="font-titleFont text-base font-normal text-gray-600"
                  >
                    Acepto los términos y condiciones
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full h-10 text-base font-semibold text-white bg-primeColor rounded-md mt-4 hover:bg-black transition duration-300"
                >
                  Registrarse
                </button>
              </div>
              <p className="text-base text-gray-600 font-medium mt-4">
                ¿Ya tienes una cuenta?{" "}
                <Link to="/signin">
                  <span className="text-black hover:underline">Inicia sesión</span>
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
      <Footer />
      <FooterBottom />
    </>
  );
};

export default SignUp;
