import express, { Request, Response } from 'express'
import { User, UserRepository } from '../models/user'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { verifyAuth } from '../middleware/verifyAuth'

dotenv.config()

const userRepository = new UserRepository()

const findAll = async (_req: Request, res: Response) => {
  try {
    const allUsers = await userRepository.findAll()
    res.status(200).json(allUsers)
  } catch (error) {
    res.status(500).json('An error occurred while fetching users.')
  }
}

const findById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    if (!id) return res.status(400).send('ID is required.')
    const user = await userRepository.findById(Number(id))
    if (!user) return res.status(404).send('User not found.')
    res.status(200).json(user)
  } catch (error: unknown) {
    res.status(500).json('An error occurred while fetching the user.')
  }
}

const create = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body
    if (!username) return res.status(400).send('Username is required.')
    if (!email) return res.status(400).send('Email is required.')
    if (!password) return res.status(400).send('Password is required.')
    const newUser: User = { id: null, username, email, password }
    const user = await userRepository.create(newUser)
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json('An error occurred while creating the user.')
  }
}

const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { username, email, password } = req.body
    if (!id) return res.status(400).send('ID is required.')
    if (!username && !email && !password) return res.status(400).send('At least one field is required to update.')
    const updatedUser: User = { id: Number(id), username, email, password }
    const user = await userRepository.update(updatedUser)
    if (!user) return res.status(404).send('User not found.')
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json('An error occurred while updating the user.')
  }
}

const deleteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    if (!id) return res.status(400).send('ID is required.')
    await userRepository.delete(Number(id))
    res.status(204).send()
  } catch (error) {
    res.status(500).json('An error occurred while deleting the user.')
  }
}

const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Check for missing credentials
    if (!username || !password) {
      return res.status(400).json({ message: 'Username or password missing' });
    }

    // Authenticate the user
    const user = await userRepository.authenticate(username, password);

    // Check for invalid credentials
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' } // Optional JWT expiration
    );

    res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
    console.error(`An error occurred while logging in the user: ${error}`);
    res.status(500).json({ message: 'An error occurred while logging in the user' });
  }
};

const userRoutes = (app: express.Application) => {
  app.get('/users', verifyAuth, findAll)
  app.get('/users/:id', verifyAuth, findById)
  app.post('/users', create)
  app.put('/users/:id', verifyAuth, update)
  app.delete('/users/:id', verifyAuth, deleteById)
  
  // Authentication route
  app.post('/users/login', login);
}

export default userRoutes
