const path = require('path');

module.exports = {
	entry: ['babel-polyfill', './assets/js/main.js'],
	output: {
		path: path.resolve(__dirname, './build'),
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
		contentBase: "./build",
		inline: true
	},
	devtool: 'cheap-eval-source-map'
}
