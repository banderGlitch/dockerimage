import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import verifyToken from './auth.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { connect } from './dbConfiguration.js';
import morgan from 'morgan';
import {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} from './userService.js'
const JWT_SECRET = "supersecretkey123"




const accessLogStream = fs.createWriteStream(
    path.join(process.cwd(), 'access.log'),
    { flags: 'a' } // append mode
  );



// Docker CI/CD pipeline 

// express rounter 
const router = express.Router();

const app = express()
const PORT = 9000;

// Use CORS middleware
// Dockerization and CI/CD pipleline 

app.use(cors({
    // origin: 'http://localhost:5173',
    // methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

// db connection 
connect()
//
// Add morgan middleware
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));
app.use(express.json());



app.get('/', (req, res) => {
    res.send("Server is running")
})


app.use(router.post('/create', createUser))
app.use(router.get('/getuser', getAllUsers))
app.use(router.get('/getuserbyId/:id', getUserById))
app.use(router.put('/updateuserbyId/:id', updateUser))
app.use(router.delete('/deleteuserbyId/:id', deleteUser))



// register api 
app.post('/register', async (req, res) => {
    const { username, password } = req.body
    const existing = await findUser(username);
    if (existing) return res.status(400).json({ message: 'User already exists' })
    const hashed = await bcrypt.hash(password, 10);
    const user = { id: Date.now(), username, password: hashed };
    await createUser(user);
    res.status(201).json({ id: user.id, username: user.username });

})

// login api 

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await findUser(username);
    if (!user) return res.status(400).json({ message: "User not found" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });

})


app.get('/profile', verifyToken, (req, res) => {
    res.json({ message: `Welcome ${req.user.username}`, user: req.user });
});





app.listen(PORT, () => {
    console.log(`🚀 Server is running on ${PORT}`)
})




