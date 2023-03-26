import message from "../models/message.js";
import MessageSchema from "../models/message.js";

var controller = {

    // FUNCION PARA GUARDAR MENSAJES
    save: async (req, res) =>{

        try {
            var params = req.body
            var message = new MessageSchema()
                message.message = params.message
                message.from = params.from
                message.userType = params.userType
            const messageStored = await message.save()
                
            if(!messageStored){
                return res.status(404).send({
                    status: 'error',
                    message: 'No ha sido posible guardar el mensaje'
                })
            }
            
            return res.status(200).send({
                status: 'Success',
                messageStored
            })
        } catch (error) {
            return res.status(404).send({
                status: 'error',
                message: 'No ha sido posible guardar el mensaje'
            })
        }
       

      /*      message.save((error, messageStored) => {
                if( error || !messageStored){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No ha sido posible guardar el mensaje'
                    })
                }

                return res.status(200).send({
                    status: 'Success',
                    messageStored
                })
            })*/
    },

    // FUNCION PARA OBTENER MENSAJES
    getMessage: async (req, res) => {
        await MessageSchema.find()
        .then((message)=>{
            if(!message){
                return res.status(404).send({
                    status: 'Error',
                    message: 'No hay mensajes que mostrar'
                })
            }

            return res.status(200).send({
                status: 'Success',
                message
            })
        })
        .catch(error =>{
            console.log(error)
            return res.status(500).send({
                status: 'Error',
                message: 'Error al extraer los datos'
            })
        })

    }

}

export default controller;