export const hasGetUserMedia = () => {
	return !!(
		navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia ||
		navigator.msGetUserMedia ||
		navigator.oGetUserMedia
	);
};

export const getLocalUserMedia = () => {
	return new Promise((resolve, reject) => {
		if (hasGetUserMedia()) {
			navigator.mediaDevices
				.getUserMedia({ audio: true })
				.then(stream => {
					resolve(stream);
				})
				.catch(err => {
					reject("Reeeejected! Access to audio/video denied.", err);
				});
		} else {
			reject("WebRTC is not supported by your browser.");
		}
	});
};

export const stopLocalUserMedia = stream => {
	if (stream) {
		stream.getAudioTracks().forEach(track => {
			track.stop();
		});
		stream.getVideoTracks().forEach(track => {
			track.stop();
		});
	}
	return stream;
};
