import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { isDbConnected } from '../config/db';
import { UserModel } from '../models/User';
import { inMemoryStore } from '../store/inMemoryStore';
import { generateToken } from '../middleware/auth';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isDbConnected()) {
      const existing = await UserModel.findOne({ email: cleanEmail });
      if (existing) {
        res.status(400).json({ success: false, message: 'An account with this email already exists.' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await UserModel.create({
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        addresses: [],
      });

      const token = generateToken({
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      });

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          addresses: user.addresses,
        },
      });
    } else {
      const existing = inMemoryStore.getUserByEmail(cleanEmail);
      if (existing) {
        res.status(400).json({ success: false, message: 'An account with this email already exists.' });
        return;
      }

      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);

      const user = inMemoryStore.createUser({
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role: 'customer',
        addresses: [],
      });

      const token = generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          addresses: user.addresses,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password.' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isDbConnected()) {
      const user = await UserModel.findOne({ email: cleanEmail });
      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid email or password.' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid email or password.' });
        return;
      }

      const token = generateToken({
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      });

      res.json({
        success: true,
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          addresses: user.addresses,
        },
      });
    } else {
      const user = inMemoryStore.getUserByEmail(cleanEmail);
      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid email or password.' });
        return;
      }

      const isMatch = bcrypt.compareSync(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid email or password.' });
        return;
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          addresses: user.addresses,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    if (isDbConnected()) {
      const user = await UserModel.findById(userId).select('-password');
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }
      res.json({
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          addresses: user.addresses,
        },
      });
    } else {
      const user = inMemoryStore.getUserById(userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }
      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          addresses: user.addresses,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const { name } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    if (!name || !name.trim()) {
      res.status(400).json({ success: false, message: 'Name cannot be empty.' });
      return;
    }

    if (isDbConnected()) {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { name: name.trim() },
        { new: true }
      ).select('-password');

      res.json({ success: true, message: 'Profile updated', user });
    } else {
      const user = inMemoryStore.updateUser(userId, { name: name.trim() });
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }
      res.json({
        success: true,
        message: 'Profile updated',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          addresses: user.addresses,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}
