import express, {Request, Response} from 'express'
import { Test, TestRepository } from '../models/test'

const testRepository = new TestRepository()

const findAll = async (_req : Request, res : Response) => {
  try {
    const allTests = await testRepository.findAll()
    res.status(200).json(allTests)
  } catch (error) {
    res.status(500).send(error)
  }
}

const findById = async (req : Request, res : Response) => {
  try {
    const {id} = req.params
    if (!id) return res.status(400).send('id is required')
    const test = await testRepository.findById(Number(id))
    if (!test) return res.status(404).send('test not found')
    res.status(200).json(test)
  } catch (error : unknown) {
    res.status(500).send(error)
  }
}

const create = async (req : Request, res : Response) => {
  try {
    const {name, age} = req.body
    if (!name) return res.status(400).send('name is required')
    if (!age) return res.status(400).send('age is required')
    const newTest : Test = {id: null, name, age}
    const test = await testRepository.create(newTest)
    res.status(200).json(test)
  } catch (error) {
    res.status(500).send(error)
  }
}

const update = async (req : Request, res : Response) => {
  try {
    const {id} = req.params
    const {name, age} = req.body
    if (!id) return res.status(400).send('id is required')
    if (!name) return res.status(400).send('name is required')
    if (!age) return res.status(400).send('age is required')
    const newTest : Test = {id: Number(id), name, age}
    const test = await testRepository.update(newTest)
    if (!test) return res.status(404).send('test not found')
    res.status(200).json(test)
  } catch (error) {
    res.status(500).send(error)
  }
}

const deleteById = async (req : Request, res : Response) => {
  try {
    const {id} = req.params
    if (!id) return res.status(400).send('id is required')
    await testRepository.delete(Number(id))
    res.status(204).send()
  } catch (error) {
    res.status(400).send(error)
  }
}

const testRoutes = (app : express.Application) => {
  app.get('/tests', findAll)
  app.get('/tests/:id', findById)
  app.post('/tests', create)
  app.put('/tests/:id', update)
  app.delete('/tests/:id', deleteById)
}

export default testRoutes
