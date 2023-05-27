const mongoose =require('mongoose');
const connectDb =()=>{
    mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }).then((conn)=>{
        console.log("Connected to MongoDb :",conn.connection.host)
    }).catch((error)=>{
        console.log("Error connecting to MongoDb : ",error);
    })
}

module.exports = connectDb;