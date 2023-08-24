const User = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { error, success }= require('../utils/responseWrapper');
// const express = require('express');
// const cookieParser = require('cookie-parser')

// const app = express();

// app.use(cookieParser())

const signupController = async(req,res) => {
    try {
       const {name,email,password} = req.body;

       if(!email || !password ||!name){
        // return res.status(400).send('All fields are requied');
        return res.send(error(400,'All fields are requied'));
       }

      const oldUser = await User.findOne({email});
       if (oldUser) {
        return res.send(error(409,'User is already registered'));  
         }


         const hashedPassword = await bcrypt.hash(password,10);
         const user = await User.create({
            name,
            email,
            password: hashedPassword,
         });
        //  return res.status(201).json({
        //     user, 
        //  })

        return res.send(
            success(201, {
                user,
            })
            
        );
    } 
    
    catch (e) {
        return res.send(error(500,e.message)); 
    }
}; 


const loginController = async(req,res) => {
    try {
      const {email,password} = req.body;

       if(!email || !password){
        // return res.status(400).send('All fields are requied');
         return res.send(error(400,'All fields are requied'));
       }

       const user = await User.findOne({email}).select('+password');
       if (!user) {
        // return res.status(404).send('User is not registerd');  
        return res.send(error(404,'User is not registered'));
         }

         const matched = await bcrypt.compare(password,user.password);
         if (!matched) {
            // return res.status(403).send("Incorrect Password")
            return res.send(error(403,'Incorrect Password'));
         }
        const accessToken = generateAccessToken({_id: user._id,email: user.email});

        const refreshToken = generateRefreshToken({_id: user._id,email: user.email});
        
        res.cookie('jwt',refreshToken, {
              httpOnly:true,
              secure:true
        })
        // return res.json({accessToken});/
        return res.send(
            success(201, {accessToken}) );

    } catch (error) {
        
    }
};

const  logoutController = async(req,res) => {
    
    try {
        res.cookie('jwt',{
            httpOnly:true,
            secure:true,
      });
    return res.send(success(200,'user logged out'))
    } catch (e) {
        return res.send(error(500,e.message)); 
    }
};

// this api will check refewsh token validity and generate new access token
const refreshAccessTokenController = async (req,res) => {
  const cookies = req.cookies;
    if (!cookies.jwt) {
    // return res.status(401).send("Refresh token in cookie is required");
    return res.send(error(401,'Refresh token in cookie is required'));
  }
  const refreshToken = cookies.jwt
  console.log("refresh",refreshToken);
  try {
    const decoded = jwt.verify(refreshToken,
        process.env.REFRESH_TOKEN_PRIVATE_KEY
        );

        const _id = decoded._id;
        const accessToken = generateAccessToken({_id});

        return res.send(success(201,{accessToken}));
  
    } catch (e) {
   console.log(e);
//    return res.status(401).send('Invalid refresh key') 
   return res.send(error(401,'Invalid refresh key'));
}

};

// internal function
const generateAccessToken = (data) => {
try {
        const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
            expiresIn:'1y'
        });
        console.log(token);
        return token;
    }
 catch (error) {   
    console.log(error);
}
};


const generateRefreshToken = (data) => {
    try {
            const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
                expiresIn:'1y'
            });
            console.log(token);
            return token;
        }
     catch (error) {
        console.log(error);
    }
    };
    

module.exports = {
    signupController,
    loginController,
    refreshAccessTokenController,
    logoutController
};