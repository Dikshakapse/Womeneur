import express, { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';

// Create router instance
const router: Router = express.Router();

// Define a custom interface for your request body
interface RegisterRequest extends Request {
    body: {
        name: string;
        email: string;
        password: string;
        businessType: string;
    }
}

interface LoginRequest extends Request {
    body: {
        email: string;
        password: string;
    }
}

// Register route with proper typing
router.post('/register', async (req: RegisterRequest, res: Response): Promise<void> => {
    try {
        const { name, email, password, businessType } = req.body;
        
        // Hash the password before saving the user
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create a new user with hashed password
        const user = new User({
            name,
            email,
            password: hashedPassword,
            businessType
        });
        
        await user.save();
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );
        
        res.json({
            token,
            user: { name: user.name, email: user.email }
        });
    } catch (error: any) {
        console.error('Error in registration:', error);
        res.status(500).json({
            error: 'Registration failed',
            details: error.message
        });
    }
});

// Login route with proper typing
router.post('/login', async (req: LoginRequest, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Check if the email and password are provided
        if (!email || !password) {
            console.log("Missing email or password");
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }

        // Find user by email
        const user = await User.findOne({ email });

        // If user doesn't exist or password doesn't match
        if (!user) {
            console.log("User not found:", email);
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Compare password with stored hash
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Password mismatch for user:", email);
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Ensure JWT_SECRET is defined and is a string
        const jwtSecret = process.env.JWT_SECRET;
        if (typeof jwtSecret !== 'string') {
            res.status(500).json({
                error: "JWT_SECRET is not defined in the environment or is not a string"
            });
            return;
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id.toString() },
            jwtSecret,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: { name: user.name, email: user.email }
        });
    } catch (error: unknown) {
        console.error('Error in login:', error);
        if (error instanceof Error) {
            res.status(500).json({
                error: 'Login failed',
                details: error.message
            });
        } else {
            res.status(500).json({
                error: 'Login failed',
                details: 'Unknown error occurred'
            });
        }
    }
});

export default router;