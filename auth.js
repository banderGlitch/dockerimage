import jwt from 'jsonwebtoken';

const JWT_SECRET = "supersecretkey123"


const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Token missing" })

    jwt.verify(token,JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user;
        next();
    });
    return
}


export default verifyToken


