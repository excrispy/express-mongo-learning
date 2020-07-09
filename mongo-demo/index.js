const mongoose = require('mongoose');

// connection string, represents mongodb installed on this machine
// need different one for prod. use config file
// add database name
mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
  // name: String,
  // other db languages, can set validation on database itself
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    // match: /pattern/
  },
  category: {
    type: String,
    required: true,
    enum: ['web', 'mobile', 'network'],
    lowercase: true, // auto lowercases
    uppercase: true,
    trim: true, // remove padding around string 
  },
  author: String,
  // tags: [ String ],
  tags: {
    type: Array,
    validate: { // custom validators if mongoose options arent sufficient
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'A course should have at least one tag',
    },
  },

  // tags: {
  //   type: Array,
  //   isAsync: true,
  //   validate: { // custom validators if mongoose options arent sufficient
  //     validator: function(v, callback) {
  //       setTimeout(() => {
  //         const result = v && v.length > 0;
  //         console.log(result);
  //       }, 4000);
  //     },
  //     message: 'A course should have at least one tag',
  //   },
  // },

  // date: Date
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  // price: Number,
  price: {
    type: Number,
    required: function() { return this.isPublished; },
    min: 10,
    max: 200,
    get: v => Math.round(v), // when querying, will round
    set: v => Math.round(v), // when creating, will round
  }
});

// joi is for data that comes to us from client
// mongoose is for data that we save to server

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
  const course = new Course({
    name: 'Angular Course2',
    category: 'web',
    author: 'Me',
    tags: ['angular', 'frontend'], // unique to RDB
    isPublished: true,
    price: 15.8,
  });
  
  try {
    await course.save();
    // await course.validate();
  } catch (ex) {
    // console.log(ex.message); // concats all error messages
    for (field in ex.errors) {
      console.log(ex.errors[field]); // prints each error message with validator
    }
  }
}

createCourse();

async function getCourses() {
  /*
    eq =
    ne !=
    gt >
    gte >=
    lt <
    lte <=
    in
    nin (not in)

    or
    and
  */

  const pageNumber = 2;
  const pageSize = 10;
  // normally dont hard code values but grab from querystring params
  // /api/courses?pageNumber=2&pageSize=10

  const courses = await Course
    // .find({ author: 'Me', isPublished: true })
    // .find({ price: 10 }) // return items where price === 10
    // .find({ price: { $gt: 10, $lte: 20 } }) // $ indicates its an operator
    // .find({ price: { $in: [10, 15, 20 ] }}) //return where price === any of those
    // .find().or([{ author: 'Me' }, { isPublished: true }])
    // .find().and([{ author: 'Me' }, { isPublished: true }])
    // .find({ author: /^pattern/ }) // reg. ^ indicates starts with
    // .find({ author: /pattern$/i }) // reg. $ indicates ends with. i = case insensitive
    // .find({ author: /.*pattern.*/ }) // reg. .* indicates any number char (before or after)
    // .limit(10)
    // .find().or([
    //   { price: { $gte: 15} },
    //   { name: /.*by.*/i } ])
    .skip((pageNumber - 1) * pageSize) // gives page index. limit with page size.
    .limit(pageSize)
    .sort({ name: 1 }) // 1 = asc, -1 = desc
    // .sort('name -name author') // sort asc or desc
    .select({ name: 1, tags: 1 }) // only get these properties
    .count() // count number of items, dont use with select
  console.log(courses);
}

// getCourses();

async function updateCourse(id) {
  const course = await Course.findById(id);
  if (!course) return;
  course.isPublished = true;
  course.author = 'Another Author';

  // same as above
  // course.set({
  //   isPublished: true,
  //   author: 'Another Author',
  // });

  const result = await course.save();
  console.log(result);
}

async function updateCourse2(id) {
  const result = await Course.update({ _id: id }, {
    // $set is an update operator
    $set: {
      author: 'Me',
      isPublished: false,
    }},
    { new: true } // result will be updated course, not old course
  );

  console.log(result);
}

// updateCourse2('5e4b6dd9a8f1c62fd6d690fb');

async function removeCourse(id) {
  // Course.deleteOne({ isPublished: false }); // deletes first one it finds
  // Course.deleteMany({ isPublished: false }); // deletes all
  // Course.findByIdAndRemove(id);
  const result = await Course.deleteOne({ _id: id });
  console.log(result);
}

// removeCourse('5e4b6dd9a8f1c62fd6d690fb');
