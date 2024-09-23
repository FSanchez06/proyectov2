import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";

const Profile = () => {
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.orebiReducer.userInfo);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    photo: "",
    role: "",
  });

  const [originalData, setOriginalData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPhoto, setNewPhoto] = useState("");
  const [modalType, setModalType] = useState("");
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (userInfo && userInfo.length > 0) {
      const user = userInfo[0];
      setUserData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        zip: user.zip,
        photo: user.photo,
        role: user.role,
      });
      setOriginalData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        zip: user.zip,
        photo: user.photo,
      });
    }
  }, [userInfo]);

  const areDataEqual = () => {
    return JSON.stringify(userData) === JSON.stringify(originalData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(userData).some((field) => !field)) {
      setModalType("emptyFields");
      setIsModalOpen(true);
      return;
    }

    if (areDataEqual()) {
      setModalType("noDataChange");
      setIsModalOpen(true);
    } else {
      setModalType("confirmUpdate");
      setIsModalOpen(true);
    }
  };

  const confirmUpdate = async () => {
    setModalType("updating");
    try {
      await axios.patch(`http://localhost:3002/users/${userInfo[0].id}`, userData);
      setModalType("successUpdate");
    } catch (error) {
      setModalType("error");
    }
  };

  const openPhotoModal = () => {
    setModalType("changePhoto");
    setIsModalOpen(true);
  };

  const handlePhotoSubmit = async () => {
    if (!newPhoto) {
      alert("Introduce un link de imagen válido.");
      return;
    }

    setModalType("updating");
    try {
      const response = await axios.patch(`http://localhost:3002/users/${userInfo[0].id}`, { photo: newPhoto });

      if (response.status === 200 || response.status === 204) {
        setUserData((prevData) => ({ ...prevData, photo: newPhoto }));
        setOriginalData((prevData) => ({ ...prevData, photo: newPhoto }));
        setModalType("successPhotoUpdate");
      } else {
        throw new Error("Error inesperado al actualizar la foto.");
      }
    } catch (error) {
      setModalType("error");
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePasswordSubmit = () => {
    setModalType("changePassword");
    setIsModalOpen(true);
  };

  const confirmPasswordChange = async () => {
    if (Object.values(passwordData).some((field) => !field)) {
      setModalType("emptyPasswordFields");
      setTimeout(() => setIsModalOpen(false), 3000); // Cerrar modal después de 3 segundos
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setModalType("passwordTooShort");
      setTimeout(() => setIsModalOpen(false), 3000); // Cerrar modal después de 3 segundos
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setModalType("passwordMismatch");
      setTimeout(() => setIsModalOpen(false), 3000); // Cerrar modal después de 3 segundos
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3002/users/${userInfo[0].id}`);
      const user = response.data;

      const isOldPasswordCorrect = await bcrypt.compare(passwordData.oldPassword, user.password);
      if (!isOldPasswordCorrect) {
        setModalType("incorrectOldPassword");
        setTimeout(() => setIsModalOpen(false), 3000); // Cerrar modal después de 3 segundos
        return;
      }

      const hashedPassword = await bcrypt.hash(passwordData.newPassword, 10);

      setModalType("changingPassword");
      await axios.patch(`http://localhost:3002/users/${userInfo[0].id}`, { password: hashedPassword });
      setModalType("successPasswordChange");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setModalType("error");
      setTimeout(() => setIsModalOpen(false), 3000); // Cerrar modal después de 3 segundos en caso de error
    }
  };

  const handleBackToProfile = () => {
    navigate("/profile");
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Perfil" prevLocation="Home" />
      <div className="container mx-auto p-4 flex flex-col items-center">
        <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg" onSubmit={handleSubmit}>
          <h1 className="font-titleFont font-semibold text-3xl mb-8 text-center">Perfil</h1>
          <div className="flex flex-col items-center mb-6">
            <img
              src={userData.photo || "https://via.placeholder.com/150"}
              alt="Perfil del usuario"
              className="rounded-full w-32 h-32 mb-4"
              onClick={openPhotoModal}
              style={{ cursor: "pointer" }}
            />
            <p className="text-sm text-gray-600">Haz clic en la imagen para cambiarla</p>
          </div>

          <div className="flex flex-col gap-4">
            {["name", "email", "phone", "address", "city", "zip"].map((field) => (
              <div key={field}>
                <p className="text-base font-titleFont font-semibold">{field.charAt(0).toUpperCase() + field.slice(1)}</p>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={userData[field]}
                  onChange={handleChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm text-base font-medium placeholder:text-gray-400 focus:outline-none focus:border-primeColor focus:ring-1 focus:ring-primeColor"
                  placeholder={`Ingrese su ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                />
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="submit"
              className="w-48 bg-primeColor text-white h-10 font-semibold rounded-lg shadow-md hover:bg-black hover:text-white transition duration-200"
            >
              Actualizar Datos
            </button>
            <button
              type="button"
              onClick={handlePasswordSubmit}
              className="w-48 bg-blue-500 text-white h-10 font-semibold rounded-lg shadow-md hover:bg-black hover:text-white transition duration-200"
            >
              Cambiar Contraseña
            </button>
          </div>
        </form>
        <div className="mt-8 flex justify-center">
          <button
            className="bg-primeColor text-white py-2 px-6 rounded-lg font-semibold text-1xl hover:bg-black transition duration-200"
            onClick={() => navigate(`/dashboard/${userData.role.toLowerCase()}`)}
          >
            Ir al Dashboard de {userData.role}
          </button>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          modalType={modalType}
          setIsModalOpen={setIsModalOpen}
          confirmUpdate={confirmUpdate}
          confirmPasswordChange={confirmPasswordChange}
          handleBackToProfile={handleBackToProfile}
          handlePhotoSubmit={handlePhotoSubmit}
          newPhoto={newPhoto}
          setNewPhoto={setNewPhoto}
          passwordData={passwordData}
          handlePasswordChange={handlePasswordChange}
        />
      )}
    </div>
  );
};

const Modal = ({
  modalType,
  setIsModalOpen,
  confirmUpdate,
  confirmPasswordChange,
  handleBackToProfile,
  handlePhotoSubmit,
  newPhoto,
  setNewPhoto,
  passwordData,
  handlePasswordChange,
}) => {
  const modalContent = {
    emptyFields: {
      title: "Campos vacíos",
      message: "Por favor, completa todos los campos antes de continuar.",
      action: () => setIsModalOpen(false),
    },
    noDataChange: {
      title: "No hay cambios",
      message: "No se han realizado cambios en los datos del perfil.",
      action: () => setIsModalOpen(false),
    },
    confirmUpdate: {
      title: "¿Está seguro que quiere actualizar los datos?",
      message: null,
      action: confirmUpdate,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    },
    changePhoto: {
      title: "Cambiar foto de perfil",
      message: (
        <>
          <input
            type="text"
            placeholder="Introduce el link de la nueva imagen"
            value={newPhoto}
            onChange={(e) => setNewPhoto(e.target.value)}
            className="w-full py-2 px-3 border border-gray-300 rounded-md mb-4"
          />
        </>
      ),
      action: handlePhotoSubmit,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    },
    successPhotoUpdate: {
      title: "Foto actualizada correctamente",
      message: (
        <motion.div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
          <span className="text-white text-2xl">✓</span>
        </motion.div>
      ),
      action: handleBackToProfile,
      confirmButtonText: "Ver perfil",
    },
    changePassword: {
      title: "Cambiar contraseña",
      message: (
        <div>
          <input
            type="password"
            name="oldPassword"
            placeholder="Contraseña antigua"
            value={passwordData.oldPassword}
            onChange={handlePasswordChange}
            className="w-full py-2 px-3 border border-gray-300 rounded-md mb-2"
          />
          <input
            type="password"
            name="newPassword"
            placeholder="Nueva contraseña"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            className="w-full py-2 px-3 border border-gray-300 rounded-md mb-2"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar nueva contraseña"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            className="w-full py-2 px-3 border border-gray-300 rounded-md"
          />
        </div>
      ),
      action: confirmPasswordChange,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    },
    successUpdate: {
      title: "Datos actualizados correctamente",
      message: (
        <motion.div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
          <span className="text-white text-2xl">✓</span>
        </motion.div>
      ),
      action: handleBackToProfile,
      confirmButtonText: "Ver perfil",
    },
    successPasswordChange: {
      title: "Contraseña cambiada exitosamente",
      message: "Tu contraseña ha sido actualizada.",
      action: handleBackToProfile,
      confirmButtonText: "Ver perfil",
    },
    error: {
      title: "Ocurrió un error",
      message: "Inténtalo de nuevo más tarde.",
      action: handleBackToProfile,
      confirmButtonText: "Regresar",
    },
    emptyPasswordFields: {
      title: "Campos vacíos",
      message: "Por favor, completa todos los campos de la contraseña.",
      action: () => setIsModalOpen(false),
    },
    passwordTooShort: {
      title: "Contraseña muy corta",
      message: "La nueva contraseña debe tener al menos 6 caracteres.",
      action: () => setIsModalOpen(false),
    },
    passwordMismatch: {
      title: "Contraseñas no coinciden",
      message: "La nueva contraseña y la confirmación no coinciden.",
      action: () => setIsModalOpen(false),
    },
    incorrectOldPassword: {
      title: "Contraseña antigua incorrecta",
      message: "La contraseña antigua introducida es incorrecta.",
      action: () => setIsModalOpen(false),
    },
  };

  const content = modalContent[modalType] || modalContent.error;
  const { title, message, action, confirmButtonText, cancelButtonText } = content;

  return (
    <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <motion.div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {message && <div className="mb-4">{message}</div>}
        <div className="flex justify-end gap-2">
          {confirmButtonText && (
            <button
              onClick={action}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              {confirmButtonText}
            </button>
          )}
          {cancelButtonText && (
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-300 px-4 py-2 rounded-md"
            >
              {cancelButtonText}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
