const path = require('path')

const WebpackConcatPlugin = require('webpack-concat-files-plugin')

module.exports = {
  mode: 'production',
  entry: [
    './src/_js/_external/_bootstrap-datepicker.js',
    './src/index.ts',
    './src/_css/_external/_bootstrap-datepicker.css',
    './src/styles-2-checkout.scss',
  ],
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'file-loader',
        options: {
          name: 'scripts-1-plain.js',
        },
      },
      {
        test: /\.css?$/,
        loader: 'file-loader',
        options: {
          name: 'styles-1-plain.css',
        },
      },
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].css',
            },
          },
          {
            loader: 'extract-loader',
          },
          {
            loader: 'css-loader?-url',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new WebpackConcatPlugin({
      bundles: [
        {
          dest: './checkout6-custom.js',
          src: './build/**/*.js',
        },
        {
          dest: './checkout6-custom.css',
          src: './build/**/*.css',
        },
      ],
    }),
  ],
  output: {
    filename: 'scripts-2-checkout.js',
    path: path.resolve(__dirname, 'build'),
  },
}
