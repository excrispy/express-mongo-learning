const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  author: authorSchema,
  // authors: [authorSchema], // for multiple authors
}));

async function createCourse(name, author) {
// async function createCourse(name, authors) { // for mulitple
  const course = new Course({
    name, 
    author,
    // author: {
    //   type: authorSchema,
    //   required: true,
    // }
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await Course.find();
  console.log(courses);
}

async function updateAuthor(courseId) {
  const course = await Course.findById(courseId);
  course.author.name = 'Mosh Hamedani';
  course.save();
  // course.author.save();
  // not allowed. if author is an embedded document in course,
  // then you can only update it via the course

  // can also set directly
  // can access an embedded documents properties via dot notation
  // dont need .save()
  const course = await Course.update({ _id: courseId }, {
    $set: {
      'author.name': 'John Smith',
    },
    $unset: {
      'author.propertyName': 'John Smith', // remove property name
      'author': 'John Smith', // remove entire subdoc
    }
  });
}

// if authors was array of multiple authors
async function addAuthor(courseId, author) {
  const course = await Course.findById(courseId);
  course.authors.push(author);
  course.save();
}

async function removeAuthor(courseId, authorId) {
  const course = await Course.findById(courseId);
  const author = course.authors.id(authorId);
  author.remove();
  author.save();
}

createCourse('Node Course', new Author({ name: 'Mosh' }));
// createCourse('Node Course', [
//   new Author({ name: 'Mosh' }),
//   new Author({ name: 'Mosh2' }),
// ]);

// removeAuthor('id1', 'id2');
