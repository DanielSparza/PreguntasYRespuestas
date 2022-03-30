// const { text } = require("express");

//OCULTAR Y MOSTRAR EL MENU EN TAMAÑO DE PANTALLA MEDIANO Y CHICO
const navToggle = document.querySelector(".nav-toggle")
const navMenu = document.querySelector(".nav-menu")

navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("nav-menu_visible");
});

//CALIFICACION CON ESTRELLAS
var contador;
function rate(item){
    contador = item.id[0]; //captura el primer caracter del id
    let nombre  = item.id.substring(1); //captura todos los caracteres excepto el primero

    for(let i=1; i<=5; i++)
    {
        if(i <= contador) { //Añade la clase con los estilos a las estrellas en el rango seleccionado
            document.getElementById(i + nombre + "-icon").classList.add("paint-stars");

        }
        else {  //Remueve la clase con los estilos a las estrellas que no estan en el rango seleccionado
            document.getElementById(i + nombre + "-icon").classList.remove("paint-stars");
        }
    }
    document.getElementById(nombre + "-btn").click(); //da click al boton para enviar el formulario a la ruta post
}

//PONE LA CALIFICACIÓN DADA POR EL USUARIO A CADA PREGUNTA
function checkRB(calif, idr){
    for(let i=1; i<=5; i++)
    {
        if(i <= calif) { //Añade la clase con los estilos a las estrellas en el rango seleccionado
            document.getElementById(i + "star" + idr + "-icon").classList.add("paint-stars");

        }
        else {  //Remueve la clase con los estilos a las estrellas que no estan en el rango seleccionado
            document.getElementById(i + "star" + idr + "-icon").classList.remove("paint-stars");
        }
    }
}

//ACTIVA BOTON DE FORMULARIO DE BARRA DE BUSQUEDA
function activatebtn(opcion){
    document.getElementById("search-btn").click();
    document.getElementById("btn-formnav").click();
    alert("opcion recibida: " + opcion.selectedindex);
    // document.getElementById(opcion + "-item").selected = true;
}

//SELECCIONAR OPCIÓN DE SELECT OPTION
function selectoptn(opcion){
    document.getElementById(opcion + "-item").selected = true;
}

//ACTIVA LOS BOTONES DEL FORMULARIO DE FILTRO DE PREGUNTAS
function activatebtnA(idp){
    document.getElementById("search-btn-" + idp).click();
}

function activatebtnA2(idp, idu){
    document.getElementById("search-btn-" + idp + "-" + idu).click();
}

//ACTIVA EL BOTON DE FILTRO DE PERFIL DE USUARIO
function activatebtnP(){
    document.getElementById("search-btn-profile").click();
}

//EFECTO MAQUINA DE ESCRIBIR PARA NOMBRE DE USUARIO
var idtexto = document.getElementById("user-write");
const texto = idtexto.innerHTML; //OBTIENE EL TEXTO QUE ESTA DENTRO DEL ELEMENTO CON EL ID ESPECIFICADO
var speed = 250;

const escribirtexto = (textusr, speed, idtext) => {
    let arrayText = textusr.split('');
    idtext.innerHTML = "";
    let cont = 0; 
    let escribir = setInterval(function(){
        idtext.innerHTML += arrayText[cont];
        cont++;
        if(cont === arrayText.length){
            cont = 0;
            idtext.innerHTML = "";
        }
    }, speed)
}

escribirtexto(texto + "   .", speed, idtexto);