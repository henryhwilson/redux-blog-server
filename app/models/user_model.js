import bcrypt from 'bcrypt-nodejs';
import mongoose, { Schema } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ silent: true });

// new schema, posts w/ field
const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
});

UserSchema.set('toJSON', {
  virtuals: true,
});

UserSchema.pre('save', (next) => {
  // this is a reference to our model
  // the function runs in some other context so DO NOT bind it
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    next();
  }

  // generate a salt then run callback
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      next(err);
    }

    // hash (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) {
        next(err);
      }
      // overwrite plain text password with encrypted password
      user.password = hash;
      next();
    });
  });
});

// note use of named function rather than arrow notation
//  this arrow notation is lexically scoped and prevents binding scope, which mongoose relies on
UserSchema.methods.comparePassword = (candidatePassword, callback) => {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      callback(err);
    }
    callback(null, isMatch);
  });
};

// create a class for the model
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
