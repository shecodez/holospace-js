// source: https://www.fullstackreact.com/articles/Declaratively_loading_JS_libraries/index.html
class ScriptCache {
	constructor(scripts) {
		this.loaded = [];
		this.failed = [];
		this.pending = [];
		this.load(scripts);
	}

	loadSrc(src) {
		if (this.loaded.indexOf(src) >= 0) {
			return Promise.resolve(src);
		}

		this.pending.push(src);
		return this.scriptTag(src)
			.then(() => {
				// handle success
			})
			.catch(() => {
				// handle cleanup
			});
	}

	scriptTag(src, cb) {
		return new Promise((resolve, reject) => {
			let resolved = false;
			let errored = false;
			const body = document.getElementsByTagName('body')[0];
			const tag = document.createElement('script');

			tag.type = 'text/javascript';
			tag.async = false; // Load in order

			const handleLoad = evt => {
				resolved = true;
				resolve(src);
			};
			const handleReject = evt => {
				errored = true;
				reject(src);
			};

			// handleCallback
			tag.onreadystatechange = function() {
				if (resolved) return handleLoad();
				if (errored) return handleReject();
				const state = tag.readyState;
				if (state === 'complete') {
					handleLoad();
				} else if (state === 'error') {
					handleReject();
				}
			};

			tag.addEventListener('load', handleLoad);
			tag.addEventListener('error', handleReject);
			tag.src = src;
			body.appendChild(tag);
			return tag;
		});
	}

	onLoad(success, reject) {}
}

const cache = new ScriptCache([
	'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-beta1/jquery.js',
	'https://code.playcanvas.com/playcanvas-latest.js'
]).onLoad(() => {
	// everything is loaded after here
});
