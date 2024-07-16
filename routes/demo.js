import express from 'express'
import httpStatus from "http-status";

const demoRouter = express.Router()


// Route to check session and redirect
demoRouter.get('/', (req, res, next) => {
  if (req.session && req.session.username) {
    res.status(httpStatus.OK).send(`Hello, ${req.session.username}`)
  } else {
    res.status(httpStatus.UNAUTHORIZED).send('Please Login.');
  }
});

export default demoRouter;
