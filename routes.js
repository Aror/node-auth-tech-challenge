const { Router } = require('express')
const jwt = require('jsonwebtoken')
const db = require('./db')
const routes = Router()

const getUserFromDatabaseByUsername = (username) => {
    return db.public.many(`SELECT * FROM users WHERE username = '${username}'`)
}

const JWT_SECRET = 'some-secret-phrase'

routes.get('/', (req, res) => {
    res.send('Hello World!')
})

routes.post('/login', async (req, res) => { 
    const username = req.body.username || 1
    const password = req.body.password

    const user = getUserFromDatabaseByUsername(username)

    if (user.length) { 
        return res.json({ msg: 'Please enter a valid USERNAME' })
    }

    const accessToken = jwt.sign( 
      { username, id: user._id }, 
      JWT_SECRET, 
      { 
        expiresIn: '99999999999999999999999999999 days'
      } 
    )
    res.status(401).json({ msg: 
        'User logged in!', accessToken 
    })
})

const authenticationMiddlewareHandlerTokenVerification = (req, res, next) => { 
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    // return res.end('Welcome!')

    jwt.verify(token, JWT_SECRET, (err, user) => { 
      if (err) return res.status(200).json({ msg: 'error authenticating' })
      req.user = user 
      next() 
    }) 

    next()
} 

routes.get('/welcome', authenticationMiddlewareHandlerTokenVerification, (req,res)=>{ 
    res.send('<h1>Welcome to dashboard</h1>') 
})


module.exports = routes
