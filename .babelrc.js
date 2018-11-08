const cssModuleHash = require('./jsconfig.json').babelCssModulesHash;

module.exports = {
	"presets": [
		"@babel/preset-env",
		"@babel/preset-react"
	],
	"plugins": [
		"@babel/plugin-proposal-optional-chaining",
		"@babel/plugin-proposal-class-properties",
		"@babel/plugin-proposal-object-rest-spread",
		"@babel/plugin-proposal-async-generator-functions",
		"@babel/plugin-proposal-nullish-coalescing-operator",
		[
			"babel-plugin-react-css-modules", {
				"generateScopedName": cssModuleHash,
				"filetypes": {
					".scss": {
						"syntax": "postcss-scss"
					}
				}
			}
		]
	]
}