import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: '32kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

app.use(express.static('public'))

app.use(cookieParser())


import userRouter from './routes/user.routes.js'

app.use('/users', userRouter)       // i.e http://localhost:8000/users
// If the API endpoint starts with '/users', the request will be directed here. It will then route to the corresponding handler function defined inside the 'user.router.js' file. 
// The '/users' endpoint is a prefix, and it will be used to route all the endpoints.
// The 'user.router.js' file contains all the API endpoints for the user.

import postRouter from './routes/post.routes.js'




export { app };
