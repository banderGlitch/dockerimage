import User from './models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';


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


    jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, user) => {
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
