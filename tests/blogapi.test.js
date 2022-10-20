import mongoose from 'mongoose';
import supertest from 'supertest';
import App from '..';

const api = supertest(App);
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3IiOiI2MzRmZWIzZTIyM2U3OWI2M2UzMzRlYTQiLCJpYXQiOjE2NjYyNDk0ODg0NTYsImV4cCI6MTY5Nzc4NTQ4ODQ1Nn0.4L-sYqT1c8f4avdVd8jXqBAd85skKbU_y-4T_VXrv3Q';

// test('blogs are returned as json', async () => {
//   const response = await api.get('/api/blogs');
//   expect(response._body.data).toHaveLength(3); // creation test below changes the test result!
// }, 100000);

test('blogs have id property', async () => {
  const response = await api.get('/api/blogs');
  response._body.data.forEach((item) => expect(item._id).toBeDefined());
}, 100000);

test('blog can be created', async () => {
  const preCreate = await api.get(`/api/blogs?token=${testToken}`);
  const prevCount = preCreate._body.data.length;

  await api.post(`/api/blogs?token=${testToken}`).send({
    title: `Some title with random number ${Math.random()}`,
    author: 'Secret Tester',
    likes: 0,
    url: 'https://example.com',
  });

  const postCreate = await api.get(`/api/blogs?token=${testToken}`);
  const nextCount = postCreate._body.data.length;

  expect(nextCount - prevCount).toBe(1);
}, 100000);

test('blog can be set with default likes value', async () => {
  const response = await api.post(`/api/blogs?token=${testToken}`).send({
    title: `Some title with random number${Math.random()}`,
    author: 'Secret Tester',
    url: 'https://example.com',
  });

  expect(response._body.data.likes).toBe(0);
}, 100000);

describe('blog creation requires title and url', () => {
  test('require title', async () => {
    await api.post(`/api/blogs?token=${testToken}`).send({
      author: 'Secret Tester',
      url: 'https://example.com',
    }).expect(400);
  }, 100000);

  test('require url', async () => {
    await api.post(`/api/blogs?token=${testToken}`).send({
      title: `A title with unique id ${Math.random}`,
      author: 'Secret Tester',
    }).expect(400);
  }, 100000);
});

test('a blog can be deleted', async () => {
  const response = await api.del(`/api/blogs/634fd170b7220a23d977f3a8?token=${testToken}`);
  expect(response.status).toBe(200);
}, 100000);

test('a blog can be updated', async () => {
  const response = await api.put(`/api/blogs/634fd0962dfff5255e4a8772?token=${testToken}`).send({
    likes: Math.floor(Math.random() * 10),
  });
  expect(response.status).toBe(200);
}, 100000);

afterAll(() => {
  mongoose.connection.close();
});
