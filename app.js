const Debug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:DataBase');
const express = require('express');
const logger = require('./logger');
const Joi = require('@hapi/joi');
const morgan = require('morgan');
const config = require('config');
const app = express();

app.use(express.json()); // Resive el body
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.use(logger);  // middlware

// USO DE middlware de tercero "Morgan"
if (app.get('env')=='development'){
    app.use(morgan('tiny'));
    //console.log('Morgan habilitado');
    Debug('Morgan esta Habilitado');
}

//Trabajos con las base de datos
Debug('conectando con la base de datos')

//Configuracion De Entornos 
console.log("Aplicacion: "+config.get('nombre'));
console.log('Base de Datos Server:'+config.get('configDB.host'));

const usuarios = [
    {id:1, nombre:"Juan"},
    {id:2, nombre:"Diana"},
    {id:3, nombre:"Ana"}
];

app.get('/',(req, res)=>{
    res.send('<h1>Hola Mundo</h1>');
});  //peticion

app.get('/api/usuarios',(req,res)=>{
    res.send(usuarios);
});

app.get('/api/usuarios/:id',(req, res)=>{
        let usuario = existeUsuario(req.params.id);
        if(!usuario) res.status(404).send('<h1>EL usuario no fue encontrado</h1>');
        res.send(usuario);
});

app.post('/api/usuarios/', (req, res)=>{
    const {error, value} = validarUsuario(req.body.nombre);
    if(!error) {
        const usuario = { 
            id: usuarios.length + 1 ,
            nombre: value.nombre
        };
        usuarios.push(usuario);
        res.send(usuario);
    }
    else {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
    }
});

app.put('/api/usuarios/:id',(req,res)=>{
    //Encontrar si existe el objeto Usuario
    let usuario = existeUsuario(req.params.id);
    if(!usuario) {
        res.status(404).send('<h1>EL usuario no fue encontrado</h1>');
        return;
    }
    const {error, value} = validarUsuario(req.body.nombre);
    if(error) {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }

    usuario.nombre = value.nombre;
    res.send(usuario);
});

app.delete('/api/usuarios/:id',(req,res)=>{
    let usuario = existeUsuario(req.params.id);
    if(!usuario) {
        res.status(404).send('<h1>EL usuario no fue encontrado</h1>');
        return;
    }
    const index = usuarios.indexOf(usuario);
    usuarios.splice(index,1);
    res.send(usuarios);
});

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`escuchando en el puerto ${port}....`);
});

function existeUsuario(id){
    return(usuarios.find(u=>u.id===parseInt(id)));
}

function validarUsuario(nom){
    const schema = Joi.object({
        nombre: Joi.string().min(3).max(10).required()
    });
    return schema.validate({nombre:nom});
}