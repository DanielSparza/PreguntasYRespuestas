const express = require("express");
const router = express.Router();
const pool = require("../database");
const { isLoggedIn } = require("../lib/auth");
const helpers = require("../lib/helpers.js");

router.post("/userask", isLoggedIn, async (req, res) => {
    const { titulo, descripcion, categorias } = req.body;
    const usr = {
        user_id: req.user.id_usuario
    }
    const newQ = {
        titulo,
        descripcion,
        categorias
    };
    await pool.query("INSERT INTO questions (titulo, descripcion, categorias, fk_usuario) VALUES ('" + newQ.titulo + "', " +
    "'" + newQ.descripcion + "', '" + newQ.categorias + "', " + usr.user_id + ")");
    res.redirect("/profile");
});

router.post("/usersedit/:id", isLoggedIn, async (req, res) => {
    const { nombre, usuario, email } = req.body;
    var imagen = req.file.originalname;
    const usr = {
        user_id: req.user.id_usuario
    }
    await pool.query("UPDATE users SET usuario = '" + usuario + "', nombre = '" + nombre + "', email = '" + email + "', imagen = '" + imagen + "' " +
    "WHERE id_usuario = " + usr.user_id + "");
    res.redirect("/profile");
});

router.get("/questiondetail/:id", async (req, res) => {
    const { id } = req.params;

    const question = await pool.query("SELECT q.id_pregunta, q.titulo, q.descripcion, q.categorias, q.fechaP, (SELECT COUNT(id_respuesta)" +
    " FROM answers WHERE fk_pregunta = q.id_pregunta) AS nrespuestas, (SELECT nombre FROM users WHERE id_usuario = q.fk_usuario) AS " +
    " usuario, (SELECT imagen FROM users WHERE id_usuario = q.fk_usuario) AS imagen FROM questions q WHERE q.id_pregunta = ?", [id]);

    const answer = await pool.query("SELECT a.id_respuesta, a.respuesta, a.fechaR, (SELECT nombre FROM users WHERE id_usuario = " +
    "a.fk_usuario) AS nombre, (SELECT imagen FROM users WHERE id_usuario = a.fk_usuario) AS imagen, (SELECT SUM(calificacion) FROM answersrate WHERE " +
    " fk_respuesta = a.id_respuesta) AS calificacionR FROM answers a WHERE a.fk_pregunta = ? ORDER BY a.fechaR DESC", [id]);
    var na = answer.length;
    res.render("questiondetail.hbs", {qtn: question[0], answer, na});
});

router.post("/questiondetail/:id", async (req, res) => {
    const { id } = req.params;
    const { fechaR, calificacion } = req.body;
    var filtro, orden;

    if(calificacion == null && fechaR != null){
        filtro = "a.fechaR";
        orden = fechaR;
    } else if (calificacion != null && fechaR == null){
        filtro = "calificacionR";
        orden = calificacion;
    }

    const question = await pool.query("SELECT q.id_pregunta, q.titulo, q.descripcion, q.categorias, q.fechaP, (SELECT COUNT(id_respuesta)" +
    " FROM answers WHERE fk_pregunta = q.id_pregunta) AS nrespuestas, (SELECT nombre FROM users WHERE id_usuario = q.fk_usuario) AS " +
    " usuario, (SELECT imagen FROM users WHERE id_usuario = q.fk_usuario) AS imagen FROM questions q WHERE q.id_pregunta = ?", [id]);

    const answer = await pool.query("SELECT a.id_respuesta, a.respuesta, a.fechaR, (SELECT nombre FROM users WHERE id_usuario = " +
    "a.fk_usuario) AS nombre, (SELECT imagen FROM users WHERE id_usuario = a.fk_usuario) AS imagen, (SELECT SUM(calificacion) FROM answersrate WHERE" +
    " fk_respuesta = a.id_respuesta) AS calificacionR FROM answers a WHERE a.fk_pregunta = ? ORDER BY " + filtro + " " + orden + "", [id]);
    
    res.render("questiondetail.hbs", {qtn: question[0], answer});
});

router.get("/questiondetailuser/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const usr = {
        user_id: req.user.id_usuario
    }
    
    const question = await pool.query("SELECT q.id_pregunta, q.titulo, q.descripcion, q.categorias, q.fechaP, (SELECT COUNT(id_respuesta)" +
    " FROM answers WHERE fk_pregunta = q.id_pregunta) AS nrespuestas, (SELECT nombre FROM users WHERE id_usuario = q.fk_usuario) AS " +
    " usuario, (SELECT imagen FROM users WHERE id_usuario = q.fk_usuario) AS imagen FROM questions q WHERE q.id_pregunta = ?", [id]);

    const answer = await pool.query("SELECT a.id_respuesta, a.respuesta, a.fechaR, (SELECT nombre FROM users WHERE id_usuario = " +
    "a.fk_usuario) AS nombre, (SELECT calificacion FROM answersrate WHERE fk_usuario = " + usr.user_id + " AND fk_respuesta = a.id_respuesta)"+
    " AS calificacion, (SELECT imagen FROM users WHERE id_usuario = a.fk_usuario) AS imagen, (SELECT SUM(calificacion) FROM answersrate WHERE" +
    " fk_respuesta = a.id_respuesta) AS calificacionR FROM answers a WHERE a.fk_pregunta = ? ORDER BY a.fechaR DESC", [id]);
    
    res.render("questiondetail.hbs", {qtn: question[0], answer});
});

router.post("/questiondetailuser/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const usr = {
        user_id: req.user.id_usuario
    }

    const { fechaR, calificacion } = req.body;
    var filtro, orden;

    if(calificacion == null && fechaR != null){
        filtro = "a.fechaR";
        orden = fechaR;
    } else if (calificacion != null && fechaR == null){
        filtro = "calificacionR";
        orden = calificacion;
    }

    const question = await pool.query("SELECT q.id_pregunta, q.titulo, q.descripcion, q.categorias, q.fechaP, (SELECT COUNT(id_respuesta)" +
    " FROM answers WHERE fk_pregunta = q.id_pregunta) AS nrespuestas, (SELECT nombre FROM users WHERE id_usuario = q.fk_usuario) AS " +
    " usuario, (SELECT imagen FROM users WHERE id_usuario = q.fk_usuario) AS imagen FROM questions q WHERE q.id_pregunta = ?", [id]);

    const answer = await pool.query("SELECT a.id_respuesta, a.respuesta, a.fechaR, (SELECT nombre FROM users WHERE id_usuario = " +
    "a.fk_usuario) AS nombre, (SELECT calificacion FROM answersrate WHERE fk_usuario = " + usr.user_id + " AND fk_respuesta = a.id_respuesta)"+
    " AS calificacion, (SELECT imagen FROM users WHERE id_usuario = a.fk_usuario) AS imagen, (SELECT SUM(calificacion) FROM answersrate WHERE " +
    " fk_respuesta = a.id_respuesta) AS calificacionR FROM answers a WHERE a.fk_pregunta = ? ORDER BY " + filtro + " " + orden + "", [id]);

    res.render("questiondetail.hbs", {qtn: question[0], answer});
});

router.post("/questionadd/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { respuesta } = req.body;
    const usr = {
        user_id: req.user.id_usuario
    }
    await pool.query("INSERT INTO answers (respuesta, fk_usuario, fk_pregunta) VALUES ('" + respuesta + "', " + usr.user_id + ", " + id + ")");
    res.redirect("/forum/questiondetailuser/" + id);
});

router.post("/rateanswer/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { rateR } = req.body;
    const usr = {
        user_id: req.user.id_usuario
    }
    const idq = await pool.query("SELECT fk_pregunta FROM answers WHERE id_respuesta = ?", [id]);//obtiene el id de la pregunta a partir del la respuesta
    const existe = await pool.query("SELECT * FROM answersrate WHERE fk_usuario = " + usr.user_id + " AND fk_respuesta = " + id + "");
    if(existe.length < 1){
        await pool.query("INSERT INTO answersrate (fk_usuario, fk_respuesta, calificacion) VALUES (" + usr.user_id + ", " + id + ", "+
        "" + rateR + ")");
        res.redirect("/forum/questiondetailuser/" + idq[0].fk_pregunta);
    } else {
        await pool.query("UPDATE answersrate SET calificacion = " + rateR + " WHERE fk_usuario = " + usr.user_id + " AND fk_respuesta = " + id + "");
        res.redirect("/forum/questiondetailuser/" + idq[0].fk_pregunta);
    }
});

module.exports = router;