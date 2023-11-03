const request = require('supertest')
const express = require('express')
const routes = require('./routes')
const app = express()

app.use(express.json())
app.use('', routes)

describe('Login Route', () => {
  it('should return an access token for a valid user', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: `'TonyStark2005'`, password: 'pass' })

    expect(response.body.msg).toBe('User logged in!')
  })

  it('should return an error message for an invalid user', async () => {
    const response = await request(app)
      .post('/login')
      .send({ userId: 12346, password: 'invalidpassword' })

    expect(response.body.msg).toBe('Please enter a valid username')
  })

  it('should deny access to the /welcome endpoint with an incorrect token', async () => {
    const token = 'invalid-token'

    const response = await request(app)
      .get('/welcome')
      .set('Authorization', `Bearer ${token}`)

    expect(response.body.msg).toBe('invalid signature')
  })
})