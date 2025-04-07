
import User from './models/User.js';



export const getAllUsers = async () => {
    return await User.find(); 
    
}

export const  createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({message: err.message})
    }

}

// get User by id

export const getUserById = async (req , res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({message:"User not found"})
        res.json(user)
    } catch (err) {
        res.status(500).json({ message : err.message
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        if (!user) return res.status(404).json({message: "User not found"})
        res.status(200).json({message: `user updated succefully ${user}`})

    } catch(err) {
        res.status(500).json({message : err.message})
    }

}

export const deleteUser = async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({ message: "User deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

