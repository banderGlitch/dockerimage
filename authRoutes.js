import User from './models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import { token } from 'morgan';

dotenv.config()

const JWT_SECRET = "supersecretkey123"
const JWT_REFRESH_SECRET = "refreshsecretkey456"


// Temporary in-memory store for refresh tokens (replace with DB in production)
let refreshTokens = []; // to store this in the db 


export const register = async (req, res) => {

    try {
        const { name, email, username, password } = req.body

        const existing = await User.findOne({ email });

        if (existing) return res.status(400).json({ message: "User already exist" })

        const hashed = await bcrypt.hash(password, 10)

        const user = { id: Date.now(), name, username, email, password: hashed }
        await User.create(user)
        res.status(201).json({ id: user.id, username: user.username })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }

}


export const login = async (req, res) => {
    console.log("jwt_secret----------->", JWT_SECRET)
    console.log("jwt_refresh_token", JWT_REFRESH_SECRET)

    try {
        const { email, password } = req.body
        const user = await User.findOne({email});
        if (!user) return res.status(400).json({ message: "User not found" });


        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Invalid password" });

        // generate a accessToken
        const accessToken = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '10s' }
        )
        // generate a refreshToken
        const refreshToken = jwt.sign(
            { id: user._id, email: user.email },
            JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        )
        refreshTokens.push(refreshToken)
        res.json({ accessToken, refreshToken });


    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// refresh token 

export const refresh_Token = (req, res) => {
    const { refreshToken } = req.body
    if (!refreshToken) return res.status(401).json(
        {
            message: "Refresh token required"
        }
    );
    if (!refreshTokens.includes(refreshToken)) return res.status(403).json(

        { message: "Refresh token expired or invalid" }
    );

    jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, user) => {
        // refresh 
        if (err) return res.status(403).json({ message: "Refresh token expired or invalid" });

        // Remove old refresh token from the store 
        refreshTokens = refreshTokens.filter(token => token !== refreshToken)

        const newAccessToken = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '10s' })
        const newRefreshToken = jwt.sign({ id: user._id, email: user.email}, JWT_REFRESH_SECRET, {expiresIn:'7d'})

        // Store the new refresh token 
        refreshTokens.push(newRefreshToken)
        res.json({ 
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        })
    })
  

}



  // we are able to generate refresh token , but what will happen if that refresh is expired as well?
    // if the refresh token expires
    // The user will not be able to get a new access token
    // They'll have to log in again to obtain a new pair of token
    // Your backend will send back a 403 or 401 depending on the error handling 
    // what's the right ui/ux for this
    // when a refresh token is invalid or expired
    // In production, many apps:
    // Rotate refresh tokens: every time a new access token is issued, also issue a new refresh token
    //
// on 401 error --> call /refresh-token
// Replace both tokens in local storage or cookies with the new ones

