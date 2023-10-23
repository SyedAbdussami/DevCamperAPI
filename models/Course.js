const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add course title'],
    trim: true,
    unique: [true, 'Course with given name already exists'],
  },
  description: {
    type: String,
    required: [true, 'Please add a course description'],
  },
  weeks: {
    type: String,
    required: [true, 'Please add weeks required'],
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a course fees'],
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
});

module.exports = mongoose.model('Course', CourseSchema);
