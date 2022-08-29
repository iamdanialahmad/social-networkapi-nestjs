import * as mongoose from 'mongoose';

export const PostSchema = new mongoose.Schema({
  createrId: {
    type: String,
    ref: 'User',
    required: true,
  },
  createrName: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    max: 500,
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
});
