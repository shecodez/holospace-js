import mongoose from 'mongoose';

const { Schema } = mongoose;

const schema = new Schema({
  body: String,
  author_id: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  channel_id: {
    type: Schema.ObjectId,
    ref: 'Channel'
  },
  isDeleted: { type: Boolean, default: false },
},
{
  timestamps: true
});

export default mongoose.model('Message', schema);
