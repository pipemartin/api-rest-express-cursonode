const express = require('express');
const Joi = require('@hapi/joi');
const ruta = express.Router();

const usuarios = [
    {id:1, nombre:"Juan"},
    {id:2, nombre:"Diana"},
    {id:3, nombre:"Ana"}
];


ruta.get('/',(req,res)=>{
    res.send(usuarios);
});

ruta.get('/:id',(req, res)=>{
        let usuario = existeUsuario(req.params.id);
        if(!usuario) res.status(404).send('<h1>EL usuario no fue encontrado</h1>');
        res.send(usuario);
});

ruta.post('/', (req, res)=>{
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

ruta.put('/:id',(req,res)=>{
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

ruta.delete('/:id',(req,res)=>{
    let usuario = existeUsuario(req.params.id);
    if(!usuario) {
        res.status(404).send('<h1>EL usuario no fue encontrado</h1>');
        return;
    }
    const index = usuarios.indexOf(usuario);
    usuarios.splice(index,1);
    res.send(usuarios);
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

module.exports = ruta;