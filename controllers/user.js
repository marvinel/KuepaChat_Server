import UserSchema from "../models/user.js";

var controller = {
  // FUNCION PARA REGISTRAR UN USUARIO
  register: async (req, res) => {
    try {
      var params = req.body;
      const checkUser = await UserSchema.findOne({ Nickname: params.nickname });
      console.log(checkUser);
      if (!checkUser) {
        var user = new UserSchema();
        user.Name = params.name;
        user.Nickname = params.nickname;
        user.Password = params.password;
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

    await UserSchema.findOne({Nickname: params.nickname, Password: params.password })
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            status: "Error",
            message: "Error al iniciar sesión",
          });
        }

        return res.status(200).send({
          status: "Success",
          message: "Inicio de Sesión Exitoso",
          user,
        });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).send({
          status: "Error",
          message: "Error al iniciar sesión",
        });
      });
  },
};

export default controller;
