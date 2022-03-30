const express = require("express");
const router = express.Router();
const pool = require("../database");
const { isLoggedIn } = require("../lib/auth");
const helpers = require("../lib/helpers.js");

router.get("/", (req, res) => {
    res.render("index.hbs");
});

router.post("/", async (req, res) => { //AREGLAR -- AL MOMENTO DE APLICAR EL FILTRO DE FECHA EL VALOR DE BUSQUEDA ARROJA
    const { busqueda} = req.body;
    const { fecha } = req.body;
    var fdate  = fecha; 
    var bqd = busqueda;
    console.log("fecha antes: " + fdate);
    console.log("BUSQUEDA antes: " + bqd);
    if(fdate == null){
        fdate = "DESC";
    }
    if(bqd == null){
        bqd = "";
    }
    console.log("BUSQUEDA: " + bqd);
    console.log("FECHA: " + fdate);
    const questions = await pool.query("SELECT q.id_pregunta, q.titulo, q.descripcion, q.categorias, q.fechaP, (SELECT COUNT(id_respuesta)" +
    " FROM answers WHERE fk_pregunta = q.id_pregunta) AS nrespuestas, (SELECT nombre FROM users WHERE id_usuario = q.fk_usuario) AS " +
    " usuario, (SELECT imagen FROM users WHERE id_usuario = q.fk_usuario) AS imagen FROM questions q WHERE q.titulo LIKE '%" + bqd + "%' ORDER BY q.fechaP " + fdate + "");
    
    var np = questions.length;
    res.render("questionsearch.hbs", {questions, np, bqd, fdate});
});

module.exports = router;