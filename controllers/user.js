import UserSchema from "../models/user.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'



function encryptPassword (password){
  return new Promise((resolve,reject)=>{
    bcrypt.genSalt(10, (err, salt)=>{
      if(err){
        reject(err)
      } else {
        bcrypt.hash(password,salt, (err, hash)=>{
          if(err){
            reject(err)
          }else{
            resolve(hash)
          }
        })
      }
    })
  })
}

function checkPassword(password, hash){
  return new Promise((resolve, reject)=>{
    bcrypt.compare(password, hash, (err,result)=>{
      if(err){
        reject(err)
      }else{
        resolve(result)
      }
    })
  })
}

var controller = {
  // FUNCION PARA REGISTRAR UN USUARIO
  register: async (req, res) => {
    try {
      var params = req.body;

      if(!params.name || !params.nickname|| !params.password || !params.type){
        return res.status(400).send({
          status: "error",
          message: "Todos los campos deben ser diligenciados",
        });
      }
      
      
      
      const checkUser = await UserSchema.findOne({ Nickname: params.nickname });
    
      
      if (!checkUser) {


        var user = new UserSchema();
        user.Name = params.name;
        user.Nickname = params.nickname;
        user.Password = await encryptPassword(params.password)
        user.UserType = params.type;

        const userStored = await user.save();

        if (!userStored) {
          return res.status(404).send({
            status: "error",
            message: "No ha sido posible registrarte",
          });
        }

        return res.status(200).send({
          status: "Success",
          userStored,
        });
      } else {
        return res.status(404).send({
          status: "error",
          message: "Ya existe un usuario con este nickName",
        });
      }
    } catch (error) {
      return res.status(404).send({
        status: "error",
        message: "No ha sido posible registrarte",
      });
    }
  },

  // FUNCION PARA INICIAR SESIÓN
  login: async (req, res) => {

    var params = req.body;

    await UserSchema.findOne({Nickname: params.nickname })
      .then((user) => {

        if (!user) {
          return res.status(404).send({
            status: "Error",
            message: "Usuario o Contraseña incorrecta",
          });
        }
        checkPassword(params.password,user.Password)
        .then(result =>{

          if(result){
            const payload = {
              username: user.Nickname,
              userType: user.UserType,
            }
    
            const secretKey = 'kuepa_clave'
    
            const options = {
              expiresIn: '8h'
            }
    
            const token = jwt.sign(payload,secretKey,options)
    
            return res.status(200).send({
              status: "Success",
              message: "Inicio de Sesión Exitoso",
              token,
            });
          }else{
            return res.status(404).send({
              status: "Error",
              message: "Usuario o Contraseña incorrecta",
            });
          }

        })
        .catch(err =>{
          console.log(err)
          return res.status(404).send({
            status: "Error",
            message: "Usuario o Contraseña incorrecta",
          });
        })

      })
      .catch((error) => {
        console.log(error);
        return res.status(500).send({
          status: "Error",
          message: "Error al iniciar sesión",
        });
      });
  },

  getUser: async (req,res) =>{

    const authHeader = req.headers.authorization;
    if(!authHeader){
      return res.status(401).send({
        status: "Error",
        message: "No se proporcionó el token el token de autorización",
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      
      const decoded = jwt.verify(token,'kuepa_clave')
      return res.status(200).send({
        status: "Success",
        user: decoded,
      });
    } catch (error) {
      console.log(error)
      return res.status(404).send({
        status: "Error",
        message: "Token inválido",
      });
    }
  }
};

export default controller;
