import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import verifyToken from './auth.js';
import { connect } from './dbConfiguration.js';
import morgan from 'morgan';
import { registerValidator , loginValidator } from './middlewares/validators.js';
import  validateRequest  from './middlewares/validateRequest.js'; 
import { register, login, refresh_Token } from './authRoutes.js';



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
// Used for logging the logs
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));
app.use(express.json());



app.get('/', (req, res) => {
    res.send("Server is running")
})


// register
app.use(router.post('/register',registerValidator,validateRequest, register))
app.use(router.post('/login', loginValidator,validateRequest, login))
app.use(router.post('/refresh-token', refresh_Token))
app.use(router.delete('/id', verifyToken))

app.get('/profile', verifyToken, (req, res) => {
    res.json({ message: `Welcome ${req.user.username}`, user: req.user });
});


app.listen(PORT, () => {
    console.log(`🚀 Server is running on ${PORT}`)
})




