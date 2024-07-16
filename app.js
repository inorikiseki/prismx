import 'dotenv/config';
import express from 'express';
import session from 'express-session'
import { db_conn } from "./config/db.js";
import authRouter from "./routes/auth.js";
import * as pug from 'pug'
import demoRouter from "./routes/demo.js";

const app = express();

app.use(express.json());
app.use(express.static('public'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false}
}));

db_conn.connect()
    .catch(err =>  console.log(err))

app.all('/', (req, res, next) => {
  res.send(pug.renderFile('./views/index.pug', {
    title: 'Prism Home Page'
  }))
})

app.use('/auth', authRouter);
app.use('/demo', demoRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app
