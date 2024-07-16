import {db_conn} from "../config/db.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {body, matchedData, validationResult} from "express-validator";
import httpStatus from "http-status";
import nodemailer from "nodemailer";

export const emailValidator = () =>
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address')

function passwordValidator() {
  return body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({min: 6}).withMessage('Password must be at least 6 characters long')
      .matches(/^[a-zA-Z0-9]+$/).withMessage('Password must contain only alphanumeric characters')
      .not().matches(/\s/).withMessage('Password must not contain whitespace')
}

export const registerMiddleware = [

  body('username')
      .trim()
      .notEmpty().withMessage('Username is required')
      .custom(async username => {
        const sql = `SELECT COUNT(*) AS count
                     FROM account
                     WHERE username = ?`;
        const [rows] = await db_conn.query(sql, [username]);

        if (rows[0].count > 0) {
          throw new Error('Username already in use.');
        }
        return true;
      })
  ,
  emailValidator()
      .custom(async email => {
        const sql = `SELECT COUNT(*) AS count
                     FROM account
                     WHERE email = ?`;
        const [rows] = await db_conn.query(sql, [email]);

        if (rows[0].count > 0) {
          throw new Error('Email already in use.');
        }
        return true;
      })
  ,
  passwordValidator()
  ,
  async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(httpStatus.BAD_REQUEST).send({errors: result.array()})
    }
    const {username, email, password} = matchedData(req)
    const salt = await bcrypt.genSalt(10)
    let hashed_pwd = await bcrypt.hash(password, salt)

    let sql = `
        insert into account(username, email, password)
        values (?, ?, ?)
    `
    db_conn.query(sql, [username, email, hashed_pwd])
        .then(() => {
          res.status(httpStatus.CREATED).send('Register Successfully. ')
        })
        .catch(err => next(err))
  }
];

export const loginMiddleware = [
  body('username')
      .optional()
      .trim()
      .notEmpty()
  ,
  body('email')
      .optional()
      .trim()
      .isEmail().withMessage('Invalid email address')
  ,
  body().custom((_, {req}) => {
    const {email, username} = matchedData(req);
    if (username === undefined && email === undefined) {
      throw new Error('Username or email is required. ')
    }
    return true
  })
  ,
  body('password')
      .notEmpty().withMessage('Password is required')
  ,
  async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(httpStatus.BAD_REQUEST).send({errors: result.array()});
    }

    const {username, email, password} = req.body;

    let sql = `
        SELECT username, email, password
        FROM account
        WHERE username = ?
           OR email = ?
    `;

    try {
      const [rows] = await db_conn.query(sql, [username || '', email || '']);

      if (rows.length === 0) {
        return res.status(httpStatus.UNAUTHORIZED).send({errors: [{msg: 'Account not existing'}]});
      }

      const account = rows[0];
      const isMatch = await bcrypt.compare(password, account.password);

      if (!isMatch) {
        return res.status(httpStatus.UNAUTHORIZED).send({errors: [{msg: 'Invalid password'}]});
      }

      req.session.username = account.username;
      req.session.email = account.email;
      res.redirect('/demo')

    } catch (err) {
      next(err);
    }
  }
];

export const logoutMiddleware = async (req, res, next) => {
  try {
    console.log(req.session?.username+'try to logout')
    req.session.destroy(err => {
      if (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({errors: [{msg: 'Logout failed'}]});
      }

      res.clearCookie('connect.sid');
      res.status(httpStatus.OK).send({message: 'Logout successful'});
    });
  } catch (err) {
    next(err);
  }
};

export const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: 465,
  secure: true,
  service: 'qq',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  }
})

export const forgetPasswordMiddleWare = [
  emailValidator()
      .custom(async email => {
        let sql = `
            select 1
            from account
            where email = ?
            limit 1
        `
        const [rows] = await db_conn.query(sql, [email])
        if (rows.length === 0) {
          throw new Error('Email does not exist. ')
        }
        return true;
      })
  ,
  async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(httpStatus.BAD_REQUEST).send({errors: result.array()})
    }

    const {email} = matchedData(req);

    let sql = `
        select username, email
        from account
        where email = ?
    `
    const [rows] = await db_conn.query(sql, [email])
    const user = rows[0]
    const token = jwt.sign(
        {username: user.username, email: user.email},
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    )

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: user.email,
      subject: 'Prism Password Reset',
      text:
          `You requested a password reset. click the link to reset your password
           http://localhost:5000/auth/reset-password?token=${token} .`
    }
    await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return next(err);
      }
      res.status(httpStatus.OK).send({message: 'Password reset mail sent'})
    })
  }
]



export const resetPasswordMiddleware = [
  body('token').notEmpty().withMessage('Token is required')
  ,
  passwordValidator()
  ,
  async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(httpStatus.BAD_REQUEST).send({errors: result.array()})
    }

    const {token, password} = matchedData(req);
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(httpStatus.UNAUTHORIZED).send({errors: [{msg: 'Invalid or expired token.'}]})
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let sql = `
        update account
        set password = ?
        where username = ?
    `
    try {
      await db_conn.query(sql, [hashedPassword, decoded.username]);
      res.status(httpStatus.OK).send({message: 'Password reset successful. '})
    } catch (err) {
      next(err)
    }
  }
]
