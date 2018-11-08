const axios = require('axios');
const path = require('path');

class RemoteAssetPlugin {

    constructor(options) {
        this.files = options.files || {};
		this.downloaded = [];
		this.path = options.path || "";
    }

    apply(compiler) {

		const firePromises = (compilation) => {
			for (const [file, url] of Object.entries(this.files)) {
				console.log(`\nStarting background download of ${file} from ${url}`);
				this.downloaded.push(
					axios.get(url, {timeout: 20000}).then(r => {
						const json = JSON.stringify(r.data);
						console.log(`\nBackground download of ${file} finished: ${json.substring(0,40)}...`);
						return [file, json];
					}).catch(e => {
						console.log(`\nFAILED background download of ${file}`);
						if (process.env.NODE_ENV !== "development") {
							throw e;
						} else {
							return [file, e];
						}
					})
				);
			}
		};
		
		const emit = (compilation, cb) => {
			Promise.all(this.downloaded).then(downloads => {
				for (const [file, contents] of downloads) {
					if (!(contents instanceof Error)) {
						compilation.assets[path.join(this.path, file)] = {
							source: () => {return contents},
							size: () => {return Buffer.byteLength(contents)}
						};
					}
				}
			}).then(cb);
        };

		compiler.hooks.entryOption.tap({name: 'RemoteAssetPlugin'}, firePromises);	
		compiler.hooks.emit.tapAsync({name: 'RemoteAssetPlugin'}, emit);	
    }
}

module.exports = RemoteAssetPlugin;