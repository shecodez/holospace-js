import mongoose from 'mongoose';

const { Schema } = mongoose;

const schema = new Schema({
  member_id: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  server_id: {
    type: Schema.ObjectId,
    ref: 'Server'
  },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Membership', schema);
