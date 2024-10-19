module.exports = {
    getAllRoles: (req, res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(500).send(err);

            conn.query('SELECT * FROM Rol', (err, rows) => {
                if (err) return res.status(500).send(err);
                res.json(rows);
            });
        });
    },

    
};
