import Note from '../models/noteModel.js'
import userModel from "../models/userModel.js";
import mongoose from 'mongoose'

// search notes
const searchNotes = async (req, res) => {
  const { query } = req.query
  const user_id = req.user._id

  try {
    const notes = await Note.find({
      user_id,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 })

    res.status(200).json(notes)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// get all notes
const getNotes = async (req, res) => {
  const userId = req.user.id
  const notes = await Note.find({userId}).sort({createdAt: -1})

  res.status(200).json(notes)
}

// get a single note
const getNote = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such note'})
  }

  const note = await Note.findById(id)

  if (!note) {
    return res.status(404).json({error: 'No such note'})
  }

  res.status(200).json(note)
}

// create a new note
const createNote = async (req, res) => {
  const {title, content} = req.body
  const userId = req.user.id
  const user = await userModel.find({_id: userId});
  let emptyFields = []

  if (!title) {
    emptyFields.push('title')
  }
  if (!content) {
    emptyFields.push('content')
  }
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all fields', emptyFields })
  }

  // add to the database
  try {
    
    const note = await Note.create({ title, content , userId})
    res.status(200).json(note)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// delete a note
const deleteNote = async (req, res) => {
    const { id } = req.params
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({error: 'No such note'})
    }
  
    const note = await Note.findOneAndDelete({_id: id})
  
    if(!note) {
      return res.status(400).json({error: 'No such note'})
    }
  
    res.status(200).json(note)
  }

// update a note
const updateNote = async (req, res) => {
    const { id } = req.params
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({error: 'No such note'})
    }
  
    const note = await Note.findOneAndUpdate({_id: id}, {
      ...req.body
    })
  
    if (!note) {
      return res.status(400).json({error: 'No such note'})
    }
  
    res.status(200).json(note)
  }

export{
  getNotes,
  getNote,
  createNote,
  deleteNote,
  searchNotes,
  updateNote
}