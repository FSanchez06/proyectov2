const express = require("express");
const mysql = require("mysql2");
const myconn = require("express-myconnection");

const routes = require("./routes");

const app = express();
app.set("port", process.env.PORT || 9000);
const dbOptions = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: "",
    database: "library",
}

//middlewares --------------------------------------------
app.use(myconn(mysql, dbOptions, 'single'))
app.use(express.json());

//routes --------------------------------------------------
app.get("/", (req, res, next)=> {
    res.send("Welcome to mi API for mysql");
})

app.use("/api", routes)

//server running -----------------------------------------
app.listen(app.get("port"), () => {
    console.log("Server runnin on port", 9000);
})