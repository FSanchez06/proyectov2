module.exports = {
    getAllMensajes: (req, res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(500).send(err);

            conn.query('SELECT * FROM Mensajes', (err, rows) => {
                if (err) return res.status(500).send(err);
                res.json(rows);
            });
        });
    },

    getMensajeById: (req, res) => {
        const { id } = req.params;
        req.getConnection((err, conn) => {
            if (err) return res.status(500).send(err);

            conn.query('SELECT * FROM Mensajes WHERE ID_mensaje = ?', [id], (err, row) => {
                if (err) return res.status(500).send(err);
                if (row.length === 0) return res.status(404).send('Mensaje no encontrado');
                res.json(row[0]);
            });
        });
    },

    createMensaje: (req, res) => {
        const { NombreUsuario, EmailUsuario, Mensaje, ID_Usuario } = req.body;
        req.getConnection((err, conn) => {
            if (err) return res.status(500).send(err);

            const newMensaje = { NombreUsuario, EmailUsuario, Mensaje, ID_Usuario };
            conn.query('INSERT INTO Mensajes SET ?', [newMensaje], (err) => {
                if (err) return res.status(500).send(err);
                res.send('Mensaje creado correctamente');
            });
        });
    },

    deleteMensaje: (req, res) => {
        const { id } = req.params;
        req.getConnection((err, conn) => {
            if (err) return res.status(500).send(err);

            conn.query('DELETE FROM Mensajes WHERE ID_mensaje = ?', [id], (err) => {
                if (err) return res.status(500).send(err);
                res.send('Mensaje eliminado correctamente');
            });
        });
    },
};
