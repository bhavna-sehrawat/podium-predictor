import User from '../model/user.model.js';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken.js'


export const registerUser = async (req, res) => {
  try {
    const {username, email, password} = req.body;
    console.log(`Request for registering username ${username}`);

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
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during user registration' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation: Check if email and password are provided
    if(!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // 2. Find the user by email
    // IMPORTANT: We must explicitly select the password because our model has `select: false`
    const user = await User.findOne({ email }).select('+password');

    // 3. Check if user exists AND if the password matches
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id), // Generate and send the JWT
      });
   } else {
     return res.status(401).json({ message: 'Invalid email or password' });
   }
  } catch(error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};