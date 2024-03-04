// import { EnvironmentPlugin } from 'webpack';
import * as DotenvWebpackPlugin from 'dotenv-webpack';

const plugins = [];

if (process.env['NODE_ENV'] !== 'production') {
  plugins.push(new DotenvWebpackPlugin());
}

module.exports = {
  plugins: plugins,
};