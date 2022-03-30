const express = require("express");
const router = express.Router();
const passport = require("passport");
const pool = require("../database");
const { isLoggedIn, isNotLoggedIn } = require("../lib/auth");

router.get("/signup", isNotLoggedIn, (req, res) => {
    res.render("auth/signup.hbs");
});

router.post("/signup", isNotLoggedIn, passport.authenticate("local.signup", {
        successRedirect: "/profile",
        failureRedirect: "/signup",
        failureFlash: true
}));

router.get("/signin", isNotLoggedIn, async (req, res) => {
    res.render("auth/signin");
});

router.post("/signin", isNotLoggedIn, (req, res, next) => {
    passport.authenticate("local.signin", {
        successRedirect: "/profile",
        failureRedirect: "/signin",
        failureFlash: true
    })(req, res, next);
});

router.get("/profile", isLoggedIn, async (req, res) => {
    const user = {
        user_id: req.user.id_usuario
    };
    const userQ = await pool.query("SELECT COUNT(id_pregunta) AS preguntas FROM questions WHERE fk_usuario = ?", [user.user_id]);
    const userA = await pool.query("SELECT COUNT(id_respuesta) AS respuestas FROM answers WHERE fk_usuario = ?", [user.user_id]);
    const qData = await pool.query("SELECT q.id_pregunta, q.titulo, q.descripcion, q.categorias, q.fechaP, (SELECT COUNT(id_respuesta)" +
    " FROM answers WHERE fk_pregunta = q.id_pregunta) AS nrespuestas, (SELECT nombre FROM users WHERE id_usuario = q.fk_usuario) AS " +
    " usuario FROM questions q WHERE q.fk_usuario = ? ORDER BY q.id_pregunta DESC", [user.user_id]);
    res.render("profile.hbs", {userQ: userQ[0], userA: userA[0], qData});
});

router.post("/profile", isLoggedIn, async (req, res) => {
    const user = {
        user_id: req.user.id_usuario
    };
    const { respuestas, fechaP } = req.body;
    var filtro, orden;

    if(respuestas == null && fechaP != null){
        filtro = "q.fechaP";
        orden = fechaP;
    } else if (respuestas != null && fechaP == null){
        filtro = "nrespuestas";
        orden = respuestas;
    }

    const userQ = await pool.query("SELECT COUNT(id_pregunta) AS preguntas FROM questions WHERE fk_usuario = ?", [user.user_id]);
    const userA = await pool.query("SELECT COUNT(id_respuesta) AS respuestas FROM answers WHERE fk_usuario = ?", [user.user_id]);
    const qData = await pool.query("SELECT q.id_pregunta, q.titulo, q.descripcion, q.categorias, q.fechaP, (SELECT COUNT(id_respuesta)" +
    " FROM answers WHERE fk_pregunta = q.id_pregunta) AS nrespuestas, (SELECT nombre FROM users WHERE id_usuario = q.fk_usuario) AS " +
    " usuario FROM questions q WHERE q.fk_usuario = ? ORDER BY " + filtro + " " + orden + "", [user.user_id]);
    res.render("profile.hbs", {userQ: userQ[0], userA: userA[0], qData});
});

router.get("/logout", isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect("/");
});

module.exports = router;