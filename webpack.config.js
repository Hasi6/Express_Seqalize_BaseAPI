const nodeExternals = require('webpack-node-externals');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = (env, argv) => {
  return {
    mode: 'development',
    entry: { app: './src/index.ts' },
    externalsPresets: { node: true },
    context: __dirname,

    externals: [nodeExternals()],
    output: {
      path: path.join(__dirname, '/dist'),
      filename: 'index.js',
    },
    plugins: [
      new CleanWebpackPlugin(),
      new Dotenv({
        path: `.env.${NODE_ENV}`,
        allowEmptyValues: true,
        systemvars: true,
      }),
    ],
    node: {
      __dirname: true,
    },
    resolve: {
      extensions: ['.ts', '.js', '.json'],
      alias: {
        '@routes': path.resolve(__dirname, 'src/routes'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@middlewares': path.resolve(__dirname, 'src/middlewares'),
        '@data': path.resolve(__dirname, 'src/data'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@controllers': path.resolve(__dirname, 'src/controllers'),
        '@mixins': path.resolve(__dirname, 'src/mixins'),
      },
    },
    module: {
      rules: [
        {
          use: [
            {
              loader: 'ts-loader',
            },
          ],
        },
      ],
    },
  };
};
