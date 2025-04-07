import { mongoose } from 'mongoose'
import dotenv from 'dotenv';
dotenv.config()

const uri = process.env.MONGODB_URL

export async function connect() {
    try {
        await mongoose.connect(uri)
        console.log("You connect to mongodb url")
    } catch (err) {
        console.error('❌ MongoDB error:', err)
    }



}
// import { MongoClient, ServerApiVersion } from "mongodb";
// import dotenv from 'dotenv';
// dotenv.config();



// const uri = process.env.MONGODB_URL
// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// })

// export async function run() {
//     try {
//       // Connect the client to the server	(optional starting in v4.7)
//       await client.connect();
//       // Send a ping to confirm a successful connection
//       await client.db("admin").command({ ping: 1 });
//       console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//       // Ensures that the client will close when you finish/error
//       await client.close();
//     }
//   }
