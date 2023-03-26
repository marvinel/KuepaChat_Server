import express from 'express'
import messageController from '../controllers/message.js'
import userController from '../controllers/user.js'

var router = express.Router()

//USUARIO
router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/getuser', userController.getUser)

// MENSAJES
router.post('/save', messageController.save)
router.get('/messages', messageController.getMessage)

export default router