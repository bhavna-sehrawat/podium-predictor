import User from '../model/user.model.js';
import bcrypt from 'bcrypt';


export const registerUser = async (req, res) => {
  try {
    const {username, email, password} = req.body;

    // 1. Validation: Check if all fields are provided or not.
    if(!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    };

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if(userExists) {
      return res.status(400).json({ message: 'User with this email already exists'});
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create new user in the databse
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // 5. Respond with the created user (excluding password)
    if(user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        totalScore: user.totalScore,

        // TODO: JWT Token
      });
    } else {
      res.statud(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during user registration' });
  }
};