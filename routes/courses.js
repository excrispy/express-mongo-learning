var express = require('express');
var router = express.Router();

const courses = [
  { 'id': 1, 'name': 'abc', },
  { 'id': 2, 'name': 'def', },
  { 'id': 3, 'name': 'ghi', },
];

router.get('/', (req, res) => {
  res.send(courses);
})

router.get('/:id', (req, res) => {
  // res.send(req.query);
  const course = courses.find(d => d.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send('Course not found');
  }
  res.send(course);
});

router.post('/', (req, res) => {
  // const result = validateCourse(req.body);

  // if (result.error) {
  //   res.status(404).send(result.error.details[0].message);
  //   return;
  // }

  const newCourse = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(newCourse);
  res.send(newCourse);
});

router.put('/:id', (req, res) => {
  const course = courses.find(d => d.id === parseInt(req.params.id));

  if (!course) {
    res.status(404).send('No course with that id found');
    return;
  }

  // const result = validateCourse(course);
  // if (result.error) {
  //   res.status(404).send(result.error.details[0].message);
  //   return;
  // }

  course.name = req.body.name;
  res.send(course);
});

router.delete('/:id', (req, res) => {
  const course = courses.find(d => d.id === parseInt(req.params.id));

  if (!course) {
    res.status(404).send('No course with that id found');
    return;
  }

  const index = courses.indexOf(course);

  courses.splice(index, 1);
  res.send(course);
});

module.exports = router;
