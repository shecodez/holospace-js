import mongoose from 'mongoose';

const { Schema } = mongoose;

const schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name field required']
  },
  icon: {
    type: String,
    default: ""
  },
  default_id: {
    type: Schema.ObjectId,
    ref: 'Channel'
  },
  owner_id: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  inviteCode: {
    type: String,
    default: ""
  },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true } );

schema.methods.setDefaultId = function setDefaultId(id) {
  this.default_id = id;
}

export default mongoose.model('Server', schema);
