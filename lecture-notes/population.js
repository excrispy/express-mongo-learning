const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const Author = mongoose.model('Author', new mongoose.Schema({
  name: String,
  bio: String,
  website: String
}));

// if property is not defined in model, it does not persist in db
const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author', // not a real relationship, can pass in invalid id
  }
}));

async function createAuthor(name, bio, website) { 
  const author = new Author({
    name, 
    bio, 
    website 
  });

  const result = await author.save();
  console.log(result);
}

async function createCourse(name, author) {
  const course = new Course({
    name, 
    author,
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await Course
    .find()
    // author is defined in the Course model as a ref to Author
    // it will automatically query the Course with the id value
    // corresponding to author, and populate that property with
    // the actual instance of the author
    // if id is not valid, will return null
    // the second param is which property to include/exclude
    // can call mulitple populate methods
    .populate('author', 'name -_id')
    .select('name');
  console.log(courses);
}

createAuthor('Mosh', 'My bio', 'My Website');

// createCourse('Node Course', 'authorId')

// listCourses();