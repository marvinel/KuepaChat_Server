

import express from 'express'
import dbConexion from './database.js'
import {Server as Sockertserver} from 'socket.io'
import http from 'http'
import cors from 'cors'
import bodyParser from 'body-parser'
import router from './routes/message.js'



const app = express()

const PORT = 4000

//Servidor con modulo http

const server = http.createServer(app)
const io = new Sockertserver(server,{
    cors: {
        origin: '*'
    }
})

//Middlewares
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use('/api',router)


io.on('connection', (socket)=>{
    console.log('cliente conectado: ',socket.id)
    
    socket.on('message', (message, nickname)=>{

        socket.broadcast.emit('message',{
            body: message,
            from: nickname
        })
    })
})

// Conexion con base de datos (MONGODB)
dbConexion;

server.listen(PORT, () =>{
    console.log('Servidor ejecutandose en http://localhost:', PORT)
})

