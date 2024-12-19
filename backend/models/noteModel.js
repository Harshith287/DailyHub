import mongoose from 'mongoose'

const Schema = mongoose.Schema

const noteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  bookmarked: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

const Note = mongoose.model("Note", noteSchema);
export default Note;