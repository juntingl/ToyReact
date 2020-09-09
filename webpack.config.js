const Webpack = require('webpack')
const path = require('path')
const minimist = require('minimist')

const argv = minimist(process.argv.splice(2));
const _mode = argv.mode;

module.exports = {
  mode: _mode,
  entry: {
    main: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                '@babel/plugin-transform-react-jsx',
                {
                  pragma: 'createElement'
                }
              ]
            ]
          }
        }
      }
    ]
  },
  plugins: [

  ],
  optimization: {
    minimize: false // 不压缩
  }
}