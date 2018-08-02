const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: ['babel-polyfill', './assets/js/main.js'],
	output: {
		path: path.resolve(__dirname, './docs'),
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{
				loader: 'babel-loader',
				test: /\.js$/,
				exclude: /node-modules/,
				query: {
					presets: ['env'],
					plugins: ["angularjs-annotate"]
				}
			}
		]
	},
	devServer: {
		port: 3000,
		contentBase: "./docs",
		inline: true
	},
	devtool: 'cheap-eval-source-map',
	plugins: [
		new webpack.ProvidePlugin({
			"window.jQuery": "jquery-slim"
		}),
	]
}
