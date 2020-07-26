import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String },
  password: { type: String },
});

const User = mongoose.model('user', userSchema, 'user');

export default User;
