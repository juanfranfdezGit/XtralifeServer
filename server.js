const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const localstorage = require('local-storage');

const app = express();
app.use(cors());
app.use(express.json());

// Conexion con la base de datos
const db = mysql.createConnection({
    host: "dpg-cl0fcjas1bgc73a2t7lg-a",
    user: "xtralife_user",
    password: "uCrbWdfI6KfxWJdVxfzSnWNbgL6gbHJ6",
    database: "xtralife"
});

// Mensaje de comprobacion de nuestra base de datos
db.connect((err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err);
    } else {
        console.log('Conexión exitosa a la base de datos');
    }
});

// Ruta para leer todos los productos en nuestra Home
app.get('https://xtralife.onrender.com/', (req,res) => {
    // Query para leer los datos de la tabla productos
    const sql3 = "SELECT * FROM products";

    // Recoge todos los productos de nuestra base de datos
    db.query(sql3,(err, data)=>{
        if(err){
            res.status(500).send(err.response.data);
        } else {
            res.status(200).send(data);
        }
    })
})

// Ruta de resgistro de usuarios en nuestra base de datos
app.post('https://xtralife.onrender.com/signup', (req,res) => {
     // Query para registrar tus datos en la base de datos
    const sql = "INSERT INTO users (`email`,`password`,`name`,`lastName`,`dni`,`address`) VALUES (?)";
    
    // Valores que se introduciran en la base de datos
    const values = [
        req.body.email,
        req.body.password,
        req.body.name,
        req.body.lastName,
        req.body.dni,
        req.body.address
    ]

    // Inserta nuevos usuarios en la base de datos
    db.query(sql, [values], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json(data);
    })
})

// Ruta para comprobar los datos introducidos e iniciar sesion si los encuentra en la base de datos
// registrados
app.post('https://xtralife.onrender.com/login', (req, res) => {
     // Query para encontrar tus datos en la base de datos
    const sql2 = "SELECT * FROM users WHERE email = ? AND password = ?";

    // Consulta para verificar las credenciales de inicio de sesión
    db.query(sql2, [req.body.email, req.body.password], (err,data) => {
        if (err) {
            return res.json("Error");
        } else if (data.length > 0) {
            localstorage.set('email', data[0].email );
            return res.json("Success");
        } else {
            return res.json("Datos Incorrectos");
        }
    })
})

// Ruta donde eliminaremos el usuario
app.post('https://xtralife.onrender.com/delete', (req, res) => {
    // Query para eliminar el usuario que este acualmente logueado
    const sql25 = "DELETE FROM `users` WHERE `email`=?";

    // Elimina el usuario de la base de datos
    db.query(sql25, [localstorage.get('email')], (err,data) => {
        if (err) {
            return res.json("Error");
        } else if (data.length > 0) {
            return res.json("Success");
        } else {
            return res.json("Datos Incorrectos");
        }
    })
})

// Ruta donde subiremos los datos actualizados del usuario
app.post('https://xtralife.onrender.com/edit', (req,res) => {
    // Query para actualizar los datos segun el formulario
    const sql21 = "UPDATE `users` SET `email`=?, `password`=?, `name`=?, `lastName`=?, `dni`=?, `address`=? WHERE `email`=?";
    
    // Recogida de datos desde nuestro cliente para la actualizacion de la base de datos
    const values = [
        req.body.email,
        req.body.password,
        req.body.name,
        req.body.lastName,
        req.body.dni,
        req.body.address,
        localstorage.get('email')
    ]

    // Actualiza la información del usuario en la base de datos mediante un formulario
    db.query(sql21, values, (err, data) => {
        if (err) {
            console.error(err);
            return res.json("Error");
        }
        return res.json(data);
    })
})

// Ruta userPage donde veremos todos los datos registrados previamente
app.get('https://xtralife.onrender.com/userPage', (req, res) => {
    // Query necesario para acceder al usuario
    const sql10 = "SELECT * FROM users WHERE email = ?";

        // Consulta para obtener la información del usuario que veremos en la ruta userPage
        db.query(sql10, [localstorage.get('email')] ,(err, data)=>{
            if(err){
                res.status(500).send(err.response.data);
            } else {
                res.status(200).send(data);
            }
        })
    
})

// Inicia el servidor en el puerto 3001
app.listen(3001, () => {
    console.log("Server On");
});