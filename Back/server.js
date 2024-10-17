require('dotenv').config(); // Asegúrate de requerir dotenv

const express = require("express");
const mysql = require("mysql2");
const myconn = require("express-myconnection");

const routes = require("./routes/Rolroutes");
const usuarioRoutes = require("./routes/Usuarioroutes");

const app = express();
app.set("port", process.env.PORT || 9000);

const dbOptions = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: "",
    database: "siena",
}

// Middlewares --------------------------------------------
app.use(myconn(mysql, dbOptions, 'single'));
app.use(express.json());

// Routes --------------------------------------------------
app.get("/", (req, res, next)=> {
    res.send("Welcome to my API for MySQL");
});

app.use("/api", routes);
app.use("/api", usuarioRoutes);  // Usa la nueva ruta

// Server running -----------------------------------------
app.listen(app.get("port"), () => {
    console.log("Server running on port", app.get("port"));
});
