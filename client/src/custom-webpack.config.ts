// import { EnvironmentPlugin } from 'webpack';
import * as DotenvWebpackPlugin from 'dotenv-webpack';
module.exports = {
  plugins: [new DotenvWebpackPlugin()],
};