require('dotenv').config(); // Carga las variables de entorno desde el archivo .env
const express = require("express");
const mysql = require("mysql2");
const myconn = require("express-myconnection");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const path = require('path');
const cors = require('cors'); // Importa el paquete cors


// Importa las rutas
const rolRoutes = require("./routes/Rolroutes");
const usuarioRoutes = require("./routes/Usuarioroutes");
const bannersRoutes = require("./routes/BannersRoutes");
const imagesRoutes = require("./routes/ImagesRoutes");
const productosRoutes = require("./routes/ProductsRoutes");
const mensajeRoutes = require("./routes/MensajeRoutes");

const app = express();
app.set("port", process.env.PORT || 9000);

// Configuración de la base de datos
const dbOptions = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: "", // Cambia esto si tu base de datos tiene contraseña
    database: "siena", // Tu base de datos
}

// Configuración de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Middlewares
app.use(myconn(mysql, dbOptions, 'single')); // Conexión a la base de datos
app.use(express.json()); // Permite recibir datos en formato JSON
app.use(fileUpload({ useTempFiles: true, tempFileDir: path.join(__dirname, 'tmp/') })); // Manejo de archivos subidos
app.use(cors());

// Rutas
app.get("/api", (req, res) => {
    res.send("Bienvenido a la API de Siena");
});

app.use("/api", rolRoutes); // Rutas para roles
app.use("/api", usuarioRoutes); // Rutas para usuarios
app.use("/api", bannersRoutes); //Rutas para banners
app.use("/api", imagesRoutes); //Rutas para imagenes home
app.use("/api", productosRoutes); //Rutas para productos
app.use("/api", mensajeRoutes); //Rutas para mensajes

// Iniciar el servidor
app.listen(app.get("port"), () => {
    console.log(`Servidor corriendo en el puerto ${app.get("port")}`);
});
