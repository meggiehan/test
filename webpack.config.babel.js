const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const env = require('./src/config/development');

const autoprefixer = require('autoprefixer');

const PROD = (process.env.NODE_ENV === 'development');

const staticBase = 'build/js';
const contentBase = './src';

module.exports = {
	resolve: {
		extensions: ['', '.js']
	},
	entry: './src/app.js',
	output: {
		path: path.join(__dirname, contentBase, staticBase),
		publicPath: staticBase,
		filename: 'common.min.js'
	},
	module: {
		loaders: [{
			test: /\.js?$/,
			exclude: '/node_modules/',
			loader: 'babel',
			query: {
				compact: false
			}
		}, {
			test: /\.json$/,
			exclude: [/node_modules/],
			loaders: ['json-loader']
		}]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		}),
		new webpack.optimize.DedupePlugin()
	],
	postcss: function() {
		return [
			// precss(),
			autoprefixer({
				browsers: ['last 3 versions', 'iOS 8', 'Android 4']
			})
		]
	},
	devtool: 'eval',
	devServer: {
		contentBase,
		port: env.hot_server_port,
		hot: true,
		inline: true
	}
}