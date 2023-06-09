const express = require('express');
const app = express();
const data = require('./data');
const dotenv = require('dotenv');
const cors = require('cors');
const connectToMongo = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleWare');
const PORT = process.env.PORT || 5000;

dotenv.config();
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Welcome to Talk-A-Tive Backend.");
})

app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);

app.use(notFound);
app.use(errorHandler);

try{
    connectToMongo();
    app.listen(PORT,()=>{
        console.log(`Server running on: http://localhost:${PORT}....`);
    })
}catch(error)
{
    console.log("Internal Server Error : ",error);
}