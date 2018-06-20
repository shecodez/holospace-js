import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import uniqueValidator from "mongoose-unique-validator";

// TODO: avatar will be a ref to the avatar model
const schema = new mongoose.Schema(
	{		
		/* avatar: {
			type: String,
			default: ""
		},*/
		email: {
			type: String,
			lowercase: true,
			index: true,
			required: true,
			unique: true
		},
		icon : {
			type: String,
			default: ""
		},
		username: {
			type: String,
			minlength: [4, "Username too short."],
			required: true
		},
		pin: Number,
		password: {
			type: String,
			minlength: [6, "Password too short."],
			required: true
		},
		online: { type: Boolean, default: true },
		status: {
			type: String,
			enum: ["Away", "Busy", "Show", "Hide"],
			default: "Show"
		},
		confirmationToken: {
			type: String,
			default: ""
		},
		passwordResetToken: {
			type: String,
			default: ""
		},
		confirmed: { type: Boolean, default: false },
		isDeleted: { type: Boolean, default: false }
	},
	{ timestamps: true }
);

schema.index({ username: 1, pin: 1 }, { unique: true });

schema.methods.isValidPassword = function isValidPassword(password) {
	return bcrypt.compareSync(password, this.password);
};

schema.methods.hashPassword = function hashPassword(password) {
	this.password = bcrypt.hashSync(password, 10);
};

schema.methods.setConfirmationToken = function setConfirmationToken() {
	// this.confirmationToken = this.generateJWT();
	this.confirmationToken = this.generateToken(); // = bcrypt.hashSync(this.generateToken(), 10);
};

schema.methods.createPasswordResetToken = function createPasswordResetToken() {
	this.passwordResetToken = this.generateToken(); // = bcrypt.hashSync(this.generateToken(), 10);
};

schema.methods.isValidToken = function isValidToken(token, type) {
	switch (type) {
		case confirm:
			return bcrypt.compareSync(token, this.confirmationToken);
			break;
		default:
			return bcrypt.compareSync(token, this.passwordResetToken);
	}
};

schema.methods.generateConfirmationUrl = function generateConfirmationUrl() {
	return `${process.env.HOST}/confirmation/${this.confirmationToken}`;
};

schema.methods.generatePasswordResetUrl = function generatePasswordResetUrl() {
	return `${process.env.HOST}/reset_password/${this.passwordResetToken}`;
	// return `${process.env.HOST}/reset_password/${this.generateToken()}`
};

schema.methods.generateJWT = function generateJWT() {
	return jwt.sign(
		{
			icon: this.icon,
			email: this.email,
			username: this.username,
			pin: this.pin,
			online: this.online,
			status: this.status,
			confirmed: this.confirmed
		},
		process.env.JWT_SECRET
	);
};

schema.methods.generateToken = function generateToken() {
	return jwt.sign(
		{
			_id: this._id,
			email: this.email
		},
		process.env.JWT_SECRET,
		{ expiresIn: "2h" }
	);
};

schema.methods.generatePin = function generatePin() {
	let pin = Math.round(Math.random() * 10000);
	if (pin < 1000) {
		pin += 1000;
	}

	this.pin = pin;
};

schema.methods.toAuthJSON = function toAuthJSON() {
	return {
		email: this.email,
		icon: this.icon,
		username: this.username,
		pin: this.pin,
		online: this.online,
		status: this.status,
		confirmed: this.confirmed,
		token: this.generateJWT()
	};
};

schema.plugin(uniqueValidator, { message: "{PATH} already in use" });

export default mongoose.model("User", schema);
