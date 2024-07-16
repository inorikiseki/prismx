import express from 'express'
import {
  loginMiddleware,
  registerMiddleware,
  logoutMiddleware,
  forgetPasswordMiddleWare,
  resetPasswordMiddleware,
} from '../middleware/auth_mw.js'
import pug from "pug";
import status from 'http-status'
import httpStatus from "http-status";
import jwt from "jsonwebtoken";

const authRouter = express.Router()

const errorHandler = (err, req, res, next) => {
  console.log(err)
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: 'Internal Server Error'});
};

authRouter.use(errorHandler)
authRouter.all('/', (req, res, err) => {
  res.send(pug.renderFile('views/auth/index.pug', {
    title: 'Authorization'
  }))
})

authRouter.get('/register', (req, res, err) => {
  res.status(status.OK).send(pug.renderFile('views/auth/register.pug', {title: 'Sign Up'}))
})

authRouter.get('/login', (req, res, err) => {
  res.status(status.OK).send(pug.renderFile('views/auth/login.pug', {title: 'Sign In'}))
})
authRouter.get('/reset-password', (req, res) => {
  const {token} = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(httpStatus.CONTINUE)
        .send(pug.renderFile('views/auth/reset-password.pug',
            {
              title: 'Reset Password',
              token,
            }
        ))
  } catch (error) {
    res.status(400).send('Invalid or expired token');
  }
});
authRouter.all('/logout', logoutMiddleware)

authRouter.post('/register', registerMiddleware)
authRouter.post('/login', loginMiddleware)
authRouter.post('/forget-password', forgetPasswordMiddleWare)
authRouter.post('/reset-password', resetPasswordMiddleware)

authRouter.get('/check', (req, res, next) => {
  res.status(httpStatus.OK).send(req.session)
})

export default authRouter
