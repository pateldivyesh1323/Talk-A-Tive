const mongoose = require("mongoose");
const messageSchema = mongoose.Schema({
    sender:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    content:{type:String},
    chat:{type:mongoose.Schema.Types.ObjectId,ref:"Chats"}
},
{
    timeStamps:true
});
const Message = mongoose.model('Message',messageSchema);
module.exports = Message;
