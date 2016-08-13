import jwt from 'jwt-simple';
import config from '../config';
import User from '../models/user_model';

export const signin = (req, res, next) => {
  res.send({ token: tokenForUser(req.user) });
};

export const signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send('You must provide email and password');
  }

  User.findOne({ email }, (error, existingUser) => {
    if (!existingUser) {
      // Save the user
      const user = new User();
      user.email = email;
      user.password = password;
      user.save()
      .then(result => {
        res.send({ token: tokenForUser(user) });
      })
      .catch(createError => {
        res.json({ createError });
      });
    } else {
      res.status(422).send('That email is already registered');
    }
  });
};

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}
