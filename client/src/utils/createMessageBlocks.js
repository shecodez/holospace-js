import moment from "moment";

export const createMessageBlocks = messages => {
	const msgBlocks = [];

	for (let i = 0; i < messages.length; i += 1) {
		const prevMsg = messages[i - 1];
		const message = messages[i];

		// first message
		if (i === 0) {
			const msg = {
				_id: message._id,
				author_id: message.author_id,
				createdAt: message.createdAt,
				blocks: []
			};
			msg.blocks.push(message);
			msgBlocks.push(msg);
		}

		// if the message date is NOT equal to prev prev messsage date
		if (
			i !== 0 &&
			moment(prevMsg.createdAt).calendar() !==
				moment(message.createdAt).calendar()
		) {
			const msg = {
				_id: message._id,
				author_id: message.author_id,
				createdAt: message.createdAt,
				blocks: []
			};
			msg.blocks.push(message);
			msgBlocks.push(msg);
			continue;
		}

		// not first and message author IS prev message author
		if (
			i !== 0 &&
			prevMsg.author_id.username === message.author_id.username
		) {
			const current = msgBlocks.length;
			msgBlocks[current - 1].blocks.push(message);
		}

		// not first and message author is NOT prev message author
		if (
			i !== 0 &&
			prevMsg.author_id.username !== message.author_id.username
		) {
			const msg = {
				_id: message._id,
				author_id: message.author_id,
				createdAt: message.createdAt,
				blocks: []
			};
			msg.blocks.push(message);
			msgBlocks.push(msg);
		}
	}
	return msgBlocks;
};
