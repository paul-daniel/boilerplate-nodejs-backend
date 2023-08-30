import express, { Request, Response } from 'express';
import { User, UserRepository } from '../models/user';

const userRepository = new UserRepository();

const findAll = async (_req: Request, res: Response) => {
  try {
    const allUsers = await userRepository.findAll();
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).send('An error occurred while fetching users.');
  }
};

const findById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).send('ID is required.');
    const user = await userRepository.findById(Number(id));
    if (!user) return res.status(404).send('User not found.');
    res.status(200).json(user);
  } catch (error: unknown) {
    res.status(500).send('An error occurred while fetching the user.');
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username) return res.status(400).send('Username is required.');
    if (!email) return res.status(400).send('Email is required.');
    if (!password) return res.status(400).send('Password is required.');
    const newUser: User = { id: null, username, email, password };
    const user = await userRepository.create(newUser);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).send('An error occurred while creating the user.');
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;
    if (!id) return res.status(400).send('ID is required.');
    if (!username && !email && !password) return res.status(400).send('At least one field is required to update.');
    const updatedUser: User = { id: Number(id), username, email, password };
    const user = await userRepository.update(updatedUser);
    if (!user) return res.status(404).send('User not found.');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send('An error occurred while updating the user.');
  }
};

const deleteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).send('ID is required.');
    await userRepository.delete(Number(id));
    res.status(204).send();
  } catch (error) {
    res.status(500).send('An error occurred while deleting the user.');
  }
};

const userRoutes = (app: express.Application) => {
  app.get('/users', findAll);
  app.get('/users/:id', findById);
  app.post('/users', create);
  app.put('/users/:id', update);
  app.delete('/users/:id', deleteById);
};

export default userRoutes;
