const express = require('express');
const path = require('path');
const dbconnect = require('./config');

const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('./user');

const app = express();
//---------------------------------------------------------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
//---------------------------------------------------------------------

//---------------------------------------------------------------------
app.post('/register', (req,res)=>{
    const {email, password} = req.body;
    const user = new User({email, password});
    user.save(err=>{
        if (err) {
            res.status(500).send('ERROR AL REGISTRAR USUARIO');
        } else {
            res.status(200).send('USUARIO REGISTRADO');
        }
    })
})

app.post('/authenticate', (req,res)=>{
    const {email, password} = req.body;

    User.findOne({email}, (err, user) =>{
        if (err) {
            res.status(500).send('ERROR AL AUTENTICAR USUARIO');
        } else if(!user){
            res.status(200).send('EL USUARIO NO EXISTE');
        } else {
            user.isCorrectPassword(password, (err,result) => {
                if (err) {
                    res.status(500).send('ERROR AL AUTENTICAR');
                } else if(result){
                    res.status(200).send('EL USUARIO AUTENTICADO CORRECTAMENTE');
                } else {
                    res.status(500).send('USUARIO Y/O CONTRASEÑA INCORRECTO');
                }
            });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log( `Server is running on port ${PORT}`);
});

dbconnect();