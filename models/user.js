import mongoose from "mongoose"
var Schema = mongoose.Schema

var UserSchema = new Schema({
    Name: String,
    Nickname: String,
    Password: String,
    UserType: String,
})

export default mongoose.model('User', UserSchema)