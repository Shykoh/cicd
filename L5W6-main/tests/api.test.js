const request = require('supertest');
const { app, Student } = require('../index.js');

let server;
let testStudentId;

beforeAll((done) => {
  server = app.listen(0, done);
});

afterAll((done) => {
  server.close(done);
});


describe('Student API Endpoints', () => {

  // Test 1 - Get All
  test('should return an empty array for /students when no students exist', async () => {
    const res = await request(server).get('/students');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('Students List');
    expect(res.text).not.toContain('<li>');
  });

  // Test 2 - New Student
  test('should create a new student via POST /student', async () => {
    const res = await request(server)
      .post('/student')
      .send({
        name: 'John Doe',
        age: 25,
        course: 'Computer Science'
      });
    expect(res.statusCode).toEqual(302);
    expect(res.headers.location).toEqual('/students');

    const student = await Student.findOne({ name: 'John Doe' });
    expect(student).toBeDefined();
    expect(student.age).toEqual(25);
    expect(student.course).toEqual('Computer Science');
    testStudentId = student._id;
  });

  // Test 3 - Get Correct
  test('should retrieve a student by ID via GET /student/:id', async () => {
    const res = await request(server).get(`/student/${testStudentId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('Student Details');
    expect(res.text).toContain('Name: John Doe');
    expect(res.text).toContain('Age: 25');
    expect(res.text).toContain('Course: Computer Science');
  });

  // Test 4 - Get Fake
  test('should return 404 for non-existent student ID', async () => {
    const nonExistentId = '605c72a6f0f1b2c3d4e5f6a7';
    const res = await request(server).get(`/student/${nonExistentId}`);
    expect(res.statusCode).toEqual(404);
    expect(res.text).toContain('Student Not Found');
  });

  // Test 5 - Update
  test('should update an existing student via PUT /student/:id', async () => {
    const res = await request(server)
      .put(`/student/${testStudentId}?_method=PUT`)
      .send({
        name: 'Jane Doe',
        age: 26,
        course: 'Software Engineering'
      });
    expect(res.statusCode).toEqual(302);
    expect(res.headers.location).toEqual('/students');

    const updatedStudent = await Student.findById(testStudentId);
    expect(updatedStudent.name).toEqual('Jane Doe');
    expect(updatedStudent.age).toEqual(26);
    expect(updatedStudent.course).toEqual('Software Engineering');
  });

  // Test 6 - Delete Student
  test('should delete a student via DELETE /student/:id', async () => {
    const res = await request(server)
      .post(`/student/${testStudentId}?_method=DELETE`);
    expect(res.statusCode).toEqual(302);
    expect(res.headers.location).toEqual('/students');

    const deletedStudent = await Student.findById(testStudentId);
    expect(deletedStudent).toBeNull();
  });

});