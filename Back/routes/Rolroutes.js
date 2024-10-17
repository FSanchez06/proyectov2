const express = require("express");
const routes = express.Router();

// Ruta para obtener todos los roles
routes.get("/roles", (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.status(500).send(err);

        conn.query('SELECT * FROM Rol', (err, rows) => {
            if (err) return res.status(500).send(err);
            res.json(rows);
        });
    });
});

// Ruta para agregar un rol
routes.post("/roles", (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.status(500).send(err);

        const newRole = req.body;
        conn.query('INSERT INTO Rol SET ?', [newRole], (err, result) => {
            if (err) return res.status(500).send(err);
            res.status(201).send('Rol agregado correctamente.');
        });
    });
});

// Ruta para eliminar un rol
routes.delete("/roles/:id", (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.status(500).send(err);

        conn.query('DELETE FROM Rol WHERE ID_Rol = ?', [req.params.id], (err, result) => {
            if (err) return res.status(500).send(err);
            res.send('Rol eliminado correctamente.');
        });
    });
});

// Ruta para actualizar un rol
routes.put("/roles/:id", (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.status(500).send(err);

        conn.query('UPDATE Rol SET ? WHERE ID_Rol = ?', [req.body, req.params.id], (err, result) => {
            if (err) return res.status(500).send(err);
            res.send('Rol actualizado correctamente.');
        });
    });
});

module.exports = routes;
