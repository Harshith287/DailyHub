import express from "express"

import {
  getNotes,
  getNote,
  createNote,
  deleteNote,
  updateNote
} from '../controllers/noteController.js'
import requireAuth from '../middleware/requireAuth.js'

const router = express.Router()

// require auth for all workout routes
router.use(requireAuth)

//Get all notes
router.get('/', getNotes)

//Get a single note
router.get('/:id', getNote)

//Post a new note
router.post('/', createNote)

//Delete a note
router.delete('/:id', deleteNote)

//Update a note
router.patch('/:id', updateNote)

export default router;