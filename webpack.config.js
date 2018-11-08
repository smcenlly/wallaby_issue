/* eslint global-require: 0 */

// node module imports
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// custom modules
const RemoteAssetPlugin = require('./build_config/remote_asset_plugin');

// configuration
const remoteFiles = require('./build_config/remote_files.json');
const cssModuleHash = require('./jsconfig.json').babelCssModulesHash;
const baseUrl = require('./jsconfig.json').compilerOptions.baseUrl;

// environment variables
const production = process.env.NODE_ENV.split("+").includes("production");
const analyze = process.env.NODE_ENV.split("+").includes("analyze");

module.exports = {
	mode: production ? "production" : "development",
	devtool: production ? "" : "source-map",
	entry: [
		path.resolve(__dirname, baseUrl, 'entry/entry.js'),
		path.resolve(__dirname, baseUrl, 'entry/entry.scss')
	],
	module: {
		rules: [
			{
				test: /.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.(css|scss|sass)$/,
				exclude: [
					/node_modules/
				],
				use: ExtractTextPlugin.extract({
					use: [
						{
							loader: 'css-loader',
							options: {
								minimize: production,
								sourceMap: !production,
								url: false,
								modules: true,
								localIdentName: cssModuleHash
							}
						},
						{
							loader: 'postcss-loader',
							options: {
								plugins: [
									require('postcss-import')({ path: baseUrl }), // makes dev server recompile on changes
									require('postcss-global-import'),
									require('postcss-node-sass')
								]
							}
						}
					]
				})
			},
			{
				test: /\.(gif|svg|json|xml|webmanifest)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'static/[path][name].[ext]',
							context: baseUrl
						}
					}
				]
			},
			{
				test: /\.(jpe?g|png)$/i,
				loader: 'responsive-loader',
				options: {
					adapter: require('responsive-loader/sharp'),
					name: 'static/[name]-[hash:base64:10]-[width].[ext]',
					context: baseUrl,
					sizes: production ? [240, 360, 480, 720, 1080, 1440, 1920, 2560, 3840] : [1280, 1920],
					quality: 85
				}
			},
		]
	},
	plugins: Array().concat(
		new HTMLWebpackPlugin({
			template: path.resolve(__dirname, baseUrl, 'entry/index.html'),
			filename: 'index.html',
			inject: 'body',
			minify: true
		}),
		new ExtractTextPlugin({
			filename: 'static/bundle-[hash].css',
			allChunks: true
		}),
		new RemoteAssetPlugin({
			files: remoteFiles
		}),
		production
			? new (require('copy-webpack-plugin'))([
				{ from: baseUrl + '/entry/root_assets/*', to: '.', flatten: true, force: true }
			])
			: [],
		analyze
			? new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)()
			: []
	),
	output: {
		filename: 'static/bundle-[hash].js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/'
	},
	devServer: {
		host: process.env.HOST,
		port: 8000,
		contentBase: './' + baseUrl,
		https: true,
		compress: true,
		watchContentBase: true,
		watchOptions: {
			poll: true
		},
		historyApiFallback: {
			rewrites: [
				{
					from: /^\/static\/img\//,
					to: (context) => context.parsedUrl.pathname.split('/').slice(2).join('/')
				}
			]
		},
		headers: { "Access-Control-Allow-Origin": "*" },
	},
	resolve: {
		modules: [
			path.resolve(__dirname, baseUrl),
			"node_modules"
		]
	},
};