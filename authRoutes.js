import User from './models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

// Temporary in-memory store for refresh tokens (replace with DB in production)
let refreshTokens = [];


export const register = async (req, res) => {

    try {
        const { name,  email, username, password } = req.body

        const existing = await User.findOne({ email });

        if (existing) return res.status(400).json({ message: "User already exist" })

        const hashed = await bcrypt.hash(password, 10)

        const user = { id: Date.now(),name, username, email, password: hashed }
        await User.create(user)
        res.status(201).json({ id: user.id, username: user.username })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }

}


export const login = async (req , res) => {
 
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Invalid password" });

        // generate a accessToken
        const accessToken = jwt.sign(
           { id : user.id, email: user.email },
           JWT_SECRET,
           {expiresIn: '1h'}
        )
        // generate a refreshToken
        const refreshToken = jwt.sign(
            {id: user.id, email: user.email},
            JWT_REFRESH_SECRET,
            {expiresIn: '7d'}
        )
        refreshTokens.push(refreshToken)
        res.json({ accessToken, refreshToken });


    } catch(err) {
        res.status(500).json({message: err.message})
    }
}

// refresh token 

export const refresh_Token = (req,res) => {
    const {refreshToken} = req.body
    if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });
    if (!refreshTokens.includes(refreshToken)) return res.status(403).json({ message: "Invalid refresh token" });


}

// profile (protected)

