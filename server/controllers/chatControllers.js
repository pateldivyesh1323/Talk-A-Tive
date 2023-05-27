const asyncHandler = require("express-async-handler");
const Chat = require('../models/chatModel');
const User = require("../models/userModel");

const accessChat = asyncHandler(async(req,res)=>{
    const {userId} = req.body;
    if(!userId)
    {
        return res.status(400).send("UserId param not sent with the request");
    }
    let isChat = await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.userId}}},
            {users:{$elemMatch:{$eq:req.user._id}}}
        ]
    }).populate('users','-password').populate('latestMessage');
    isChat = await User.populate(isChat,{
        path:'latestMessage.Sender',
        select:'name pic email'
    });

    if(isChat.length > 0)
    {
        res.send(isChat[0])
    }
    else
    {
        let chatData = {
            chatName:'sender',
            isGroupChat:false,
            users:[req.user._id,userId],
        }
        try{
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({_id:createdChat._id}).populate('users','-password');
            res.status(200).send(fullChat);
        }
        catch(error)
        {
            res.status(400).send(error.message);
        }
    }
})

const fetchChats = asyncHandler(async(req,res)=>{
    try{
        await Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
        .populate('users','-password')
        .populate('groupAdmin','-password')
        .populate('latestMessage')
        .sort({updatedAt:-1})
        .then(async(results)=>{
            results = await User.populate(results,{
                path:'latestMessage.sender',
                select:'name pic email'
            })
            res.status(200).send(results);
        })
        .catch((err)=>
        {
            res.status(400).send(err);
        })
    }
    catch(error)
    {
        res.status(400).send;
        throw new Error(error.message);
    }
})

const createGroupChat=asyncHandler(async(req,res)=>{
    if(!req.body.users || !req.body.name)
    {
        return res.status(400).send("Please fill all the fields");
    }
    let users = JSON.parse(req.body.users);
    if(users.length<2)
    {
        return res.status(400).send("More than 2 users are required to from a group chat!");
    }
    users.push(req.user._id);
    try {
        const groupChat = await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user
        })
        const fullGroupChat = await Chat.findOne({_id:groupChat._id})
        .populate('users','-password')
        .populate('groupAdmin','-password');
        res.status(200).json(fullGroupChat);
    }catch (error) {
        console.log(error);
    }
})

const renameGroup=asyncHandler(async(req,res)=>{
    const {chatId,chatName} = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(chatId,{chatName},{new:true})
    .populate('users','-password')
    .populate('groupAdmin','-password');

    if(!updatedChat)
    {
        res.status(404).send("Chat not Found");
    }
    else
    {
        res.json(updatedChat);
    }
})

const addToGroup = asyncHandler(async(req,res)=>{
    const {chatId,userId} = req.body;
    const added = await Chat.findByIdAndUpdate(chatId,
        {$push:{users:userId}},
        {new:true}
    )

    if(!added)
    {
        res.status(400).send("Chat not Found");
    }
    else{
        res.status(200).send(added);
    }
});

const removeFromGroup = asyncHandler(async(req,res)=>{
    const {chatId,userId} = req.body;
    const removed = await Chat.findByIdAndUpdate(chatId,
        {$pull:{users:userId}},
        {new:true}
    )

    if(!removed)
    {
        res.status(400).send("Chat not Found");
    }
    else{
        res.status(200).send(removed);
    }
});

module.exports = {accessChat,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup};