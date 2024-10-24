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
    idRol: 0, // Role ID
  });

  const [originalData, setOriginalData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPhoto, setNewPhoto] = useState(null); // Handle file input for profile photo
  const [modalType, setModalType] = useState("");
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      if (userInfo && userInfo.length > 0) {
        try {
          const response = await axios.get(`http://localhost:9000/api/usuarios/${userInfo[0].id}`);
          const user = response.data;

          setUserData({
            name: user.Nombre,
            email: user.Email,
            phone: user.Telefono,
            address: user.Direccion,
            city: user.Ciudad,
            zip: user.CodPostal,
            photo: user.FotoPerfil,
            role: user.ID_Rol === 1 ? "Administrador" : user.ID_Rol === 2 ? "Empleado" : "Cliente",
            idRol: user.ID_Rol,
          });

          setOriginalData({
            name: user.Nombre,
            email: user.Email,
            phone: user.Telefono,
            address: user.Direccion,
            city: user.Ciudad,
            zip: user.CodPostal,
            photo: user.FotoPerfil,
          });
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      }
    };
    fetchUserData();
  }, [userInfo]);

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Handle password data change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  // Handle profile data update
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:9000/api/usuarios/${userInfo[0].id}`, userData);
      setModalType("successUpdate");
      setIsModalOpen(true);
    } catch (error) {
      setModalType("error");
      setIsModalOpen(true);
    }
  };

  // Handle password update
  const handlePasswordSubmit = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setModalType("passwordMismatch");
      setIsModalOpen(true);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setModalType("passwordTooShort");
      setIsModalOpen(true);
      return;
    }

    try {
      // Verify old password
      const response = await axios.get(`http://localhost:9000/api/usuarios/${userInfo[0].id}`);
      const user = response.data;

      const isOldPasswordCorrect = await bcrypt.compare(passwordData.oldPassword, user.Contraseña);
      if (!isOldPasswordCorrect) {
        setModalType("incorrectOldPassword");
        setIsModalOpen(true);
        return;
      }

      // Hash the new password and update
      const hashedPassword = await bcrypt.hash(passwordData.newPassword, 10);
      await axios.patch(`http://localhost:9000/api/usuarios/${userInfo[0].id}`, { Contraseña: hashedPassword });
      setModalType("successPasswordChange");
      setIsModalOpen(true);
    } catch (error) {
      setModalType("error");
      setIsModalOpen(true);
    }
  };

  // Handle profile picture change with file upload
  const handlePhotoSubmit = async () => {
    if (!newPhoto) {
      alert("Seleccione una imagen válida.");
      return;
    }

    const formData = new FormData();
    formData.append("FotoPerfil", newPhoto);

    try {
      await axios.put(`http://localhost:9000/api/usuarios/updateProfilePic/${userInfo[0].id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setModalType("successPhotoUpdate");
      setIsModalOpen(true);
    } catch (error) {
      setModalType("error");
      setIsModalOpen(true);
    }
  };

  // Redirect to dashboard based on role
  const goToDashboard = () => {
    const roleDashboardMap = {
      1: "admin",
      2: "employee",
      3: "client",
    };
    navigate(`/dashboard/${roleDashboardMap[userData.idRol]}`);
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Perfil" prevLocation="Home" />
      <div className="container mx-auto p-4 flex flex-col items-center">
        <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h1 className="font-titleFont font-semibold text-3xl mb-8 text-center">Perfil</h1>
          <div className="flex flex-col items-center mb-6">
            <img
              src={userData.photo || "https://via.placeholder.com/150"}
              alt="Perfil del usuario"
              className="rounded-full w-32 h-32 mb-4"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewPhoto(e.target.files[0])}
              className="mt-4"
            />
            <button onClick={handlePhotoSubmit} className="mt-2 bg-primeColor text-white py-2 px-4 rounded-lg">
              Cambiar foto de perfil
            </button>
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
                  className="w-full py-2 px-3 border border-gray-300 rounded-md"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              className="w-48 bg-primeColor text-white h-10 font-semibold rounded-lg"
              onClick={handleUpdate}
            >
              Actualizar Datos
            </button>
          </div>

          <div className="mt-4">
            <h2 className="font-titleFont text-xl">Cambiar contraseña</h2>
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
              className="w-full py-2 px-3 border border-gray-300 rounded-md mb-2"
            />
            <button onClick={handlePasswordSubmit} className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg">
              Cambiar contraseña
            </button>
          </div>
        </form>

        <div className="mt-8 flex justify-center">
          <button
            className="bg-primeColor text-white py-2 px-6 rounded-lg font-semibold"
            onClick={goToDashboard}
          >
            Ir al Dashboard
          </button>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          modalType={modalType}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

// Modal component with framer-motion
const Modal = ({ modalType, setIsModalOpen }) => {
  const modalContent = {
    successUpdate: {
      title: "Actualización Exitosa",
      message: "Los datos del perfil se han actualizado correctamente.",
    },
    successPasswordChange: {
      title: "Contraseña Cambiada",
      message: "Tu contraseña ha sido actualizada exitosamente.",
    },
    successPhotoUpdate: {
      title: "Foto de Perfil Actualizada",
      message: "Tu foto de perfil se ha actualizado correctamente.",
    },
    error: {
      title: "Error",
      message: "Ocurrió un error. Inténtalo de nuevo más tarde.",
    },
    passwordMismatch: {
      title: "Error de Contraseña",
      message: "Las contraseñas no coinciden.",
    },
    passwordTooShort: {
      title: "Contraseña Muy Corta",
      message: "La contraseña debe tener al menos 6 caracteres.",
    },
    incorrectOldPassword: {
      title: "Contraseña Antigua Incorrecta",
      message: "La contraseña antigua es incorrecta.",
    },
  };

  const content = modalContent[modalType] || modalContent.error;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-xl font-semibold mb-4">{content.title}</h2>
        <div className="mb-4">{content.message}</div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
