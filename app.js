const Debug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:DataBase');
const express = require('express');
const logger = require('./logger');

const morgan = require('morgan');
const config = require('config');
const usuarios = require('./routes/usuarios');
const app = express();

app.use(express.json()); // Resive el body
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use('/api/usuarios',usuarios);

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

app.get('/',(req, res)=>{
    res.send('<h1>Hola Mundo</h1>');
});  //peticion
const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`escuchando en el puerto ${port}....`);
});