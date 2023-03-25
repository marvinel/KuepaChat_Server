import mongoose from 'mongoose'

const user = /*"mhuser" |¨*/ "KuepaUser"
const pass = /*"WYxe4L4wZMkmfLil" |*/ "Ly6s4e1SREhjqygY"
const dbname = "instagrem_fv"

var url =`mongodb+srv://${user}:${pass}@cluster0.c2n65o7.mongodb.net/?retryWrites=true&w=majority`

mongoose.Promise = global.Promise
mongoose.connect(url,
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{
  console.log("Connected successfully");
})

const db = mongoose.connection;
/*db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});*/

export default db;