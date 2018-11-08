const glob = require('glob');
const fs = require('fs');
const path = require("path");
const tinify = require('tinify');
const key = fs.readFileSync(path.resolve(__dirname, './tinify.key'), 'utf-8');
tinify.key = key;
const suffix = 'min';

glob(path.resolve(__dirname, '../dist/**/*.{png,jpg,jpeg}'), function(err, files) {
	if (err)
		throw err;

	files.forEach(file =>
		fs.readFile(file, function(err, sourceData) {
			if (err)
				throw err;

			const fileParts = file.split('.');
			const destinationName = fileParts[0] + '.' + suffix + '.' + fileParts[fileParts.length-1];

			if (fileParts[fileParts.length-2] === suffix) {
				return;
			}
			if (fs.existsSync(destinationName)) {
				console.log("MINIFIED EXISTS:  " + file);
				return;
			}
			
			tinify.fromBuffer(sourceData).toFile(destinationName)
				.then(() => console.log("MINIFIED!!!:      " + file));
		})
	);
});