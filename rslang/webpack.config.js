const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');


let mode = 'development';
if(process.env.NODE_ENV === 'production') {
	mode = 'production';
}

const esLintPlugin = (mode) => mode === 'development' ? [] : [ new ESLintPlugin({ extensions: ['ts', 'js'] }) ];

module.exports = {
	mode: mode,
  entry: {
		index: './src/index.ts',
	},
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/index.js',
		clean: true,
    assetModuleFilename: (pathData) => {
      const filepath = path
        .dirname(pathData.filename)
        .split('/')
        .slice(1)
        .join('/');
      return `${filepath}/[name][ext]`;
    },
  },
  experiments: {
    topLevelAwait: true,
  },
	devtool: 'source-map',
	module: {
		rules: [
      {
				test: /\.[tj]s$/i,
				use: 'ts-loader',
        exclude: /node_modules/
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					(mode === 'development') ? 'style-loader' : MiniCssExtractPlugin.loader, 
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									[
										'postcss-preset-env',
										{
											// Options
										},
									],
								],
							},
						},
					},
					'sass-loader'
				],
			},
			{
				test: /\.html$/i,
				loader: 'html-loader'
			},
			{
				test: /\.(png|jpg|jpeg|gif|ico|webp)$/i,
				type: 'asset/resource',
			},
			{
				test: /\.svg$/i,
				type: 'asset/resource',
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
			},
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					},
				},
			},
		]
	},
	resolve: {
		extensions: ['.js', '.ts']
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
			inject: 'body',
			// scriptLoading: 'blocking | defer'
		}),
		new MiniCssExtractPlugin({
			filename: 'css/style.css'
		}),
    new CopyPlugin({
      patterns: [
        { from: './src/assets', to: './assets'}
      ]
    }),
    // new ESLintPlugin({ extensions: ['ts', 'js'] }),
    ...esLintPlugin(mode),
	],
	devServer: {
		historyApiFallback: true,
		compress: true,
		port: 4200,
		static: {
      directory: path.join(__dirname, 'src'),
    },
		open: {
      app: {
        name: 'chrome',
      },
    },
  },
};