const jsconfig = require('./jsconfig.json');
const rootSyntax = process.env.TEST_ENV === "wallaby"
	? "<rootDir>"
	: ".";

module.exports = {
	"modulePaths": [jsconfig.compilerOptions.baseUrl],
	"setupTestFrameworkScriptFile": rootSyntax + "/jest.setup.js",
	"testPathIgnorePatterns" : ["/node_modules/", "jest.setup.js"]
};