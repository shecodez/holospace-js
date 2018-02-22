import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

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

schema.methods.createInvitation = function createInvitation() {
  this.inviteCode = this.generateToken(); // = bcrypt.hashSync(this.generateToken(), 10);
};

// generateInvitationURL
schema.methods.generateInvitationURL = function generateInvitationURL() {
  return `${process.env.HOST}/invite/${this.inviteCode}`
};

schema.methods.generateToken = function generateToken() {
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.JWT_SECRET,
    // { expiresIn: "24h" }
  );
};

export default mongoose.model('Server', schema);
