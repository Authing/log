const path = require('path')

const resolve = function (...args) {
  return path.resolve(__dirname, ...args)
}

module.exports = {
  mode: 'production',
  target: 'web',
  entry: resolve('./src/index.ts'),
  output: {
    path: resolve('./build/umd'),
    globalObject: 'this',
    filename: 'index.min.js',
    library: 'AuthingLog',
    libraryTarget: 'umd',
    environment: {
      arrowFunction: false,
      destructuring: false,
      const: false,
      dynamicImport: false,
      forOf: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    chrome: '49',
                    ie: '11',
                  },
                  useBuiltIns: 'usage',
                  corejs: {
                    version: 3, // 使用core-js@3
                    proposals: true,
                  },
                },
              ],
              '@babel/preset-typescript',
            ],
            plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-transform-arrow-functions'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [],
}
