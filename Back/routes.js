const express = require("express");
const routes = express.Router();

routes.get("/", (req, res,)=> {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)

        conn.query('SELECT * FROM Books', (err, rows) => {
            if (err) return res.send(err)

            res.json(rows)

        })
    })
})

routes.post("/", (req, res,)=> {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)

        conn.query('INSERT INTO Books SET ?', [req.body], (err, rows) => {
            if (err) return res.send(err)

            res.send('books added!')
        })
    })
})

routes.delete("/:id", (req, res,)=> {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)

        conn.query('DELETE FROM Books WHERE id = ?', [req.params.id], (err, rows) => {
            if (err) return res.send(err)

            res.send('books delete!')
        })
    })
})

routes.put("/:id", (req, res,)=> {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)

        conn.query('UPDATE Books SET ? WHERE id = ?', [req.body, req.params.id], (err, rows) => {
            if (err) return res.send(err)

            res.send('books update!')
        })
    })
})


module.exports = routes;