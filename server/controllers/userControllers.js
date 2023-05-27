const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400).send("Please enter all Fields");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400).send("User already exists");
    }

    const user = await User.create({ name, email, password, pic });
    if (user) {
        const { _id, name, email, pic } = user;
        res.status(201).json({
            name,token: generateToken(user._id),email,pic,_id
        });
    }
    else {
        res.status(400).send("Failed to create the User");
    }
})

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && await user.matchPassword(password)){
        res.status(201).json({
            name:user.name,
            token: generateToken(user._id),
            email:user.email,
            pic:user.pic,
            _id:user._id
        })
    }
    else {
        res.status(401).send("Invalid User Credentials");
    }
})

const updateUser = asyncHandler(async (req, res) => {

    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (user) {
            const { name, pic } = req.body;
            if (name) {
                await user.updateOne({ name });
            }
            if (pic) {
                await user.updateOne({ pic });
            }
            res.send({name, pic});
        }
        else {
            res.status(400).send("Cannot find User!");
        }
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }

})

const allUsers = asyncHandler(async(req,res)=>{
    const keyword = (req.query.search ? {
        $or:[
            {name:{$regex:req.query.search,$options:"i"}},
            {email:{$regex:req.query.search,$options:"i"}}
        ]
    }:{});
    const users = await User.find(keyword).find({_id:{$ne:req.user._id}});
    res.send(users);
})

module.exports = { registerUser, authUser, updateUser,allUsers };