const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = asyncHandler(async(req,res,next)=>{
    if(req.headers.authorization)
    {
        let token = req.headers.authorization;
        try
        {
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        }
        catch(error)
        {
            res.status(401).send("Not Authorized, token failed!");
        }
    }
    else{
        res.status(401).send("Not Authorized");
    }
})

module.exports = {protect};