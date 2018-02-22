import mongoose from 'mongoose';

const CounterSchema = new mongoose.Schema({
	_id: { type: String, required: true },
	seq: { type: Number, default: 0 }
});
const counter = mongoose.model('Counter', CounterSchema);

const schema = new mongoose.Schema({
	_id: { type: Number, index: true },
	longURL: String
},{ timestamps: true });

schema.pre('save', next => {
	let doc = this;
	counter.findByIdAndUpdate(
		{ _id: 'url_count' },
		{ $inc: { seq: 1 } },
		{ new: true },
		(err, counter) => {
			if (err) return next(err);
			doc._id = counter.seq;
			next();
		}
	);
});
export default mongoose.model('URL', schema);
