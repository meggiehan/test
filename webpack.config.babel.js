const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const env = require('./src/config/development');

const autoprefixer = require('autoprefixer');

const PROD = process.env.npm_lifecycle_event;

const staticBase = 'js';
const contentBase = './src/build';
let initConfig = {
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
	}
}

if(PROD == 'dev' || PROD == 'build-dev'){
	initConfig.devtool = 'eval';
	initConfig.progress = false;
	initConfig.devServer = {
		contentBase,
		port: env.hot_server_port,
		hot: true,
		inline: true
	}
}

module.exports = initConfig;