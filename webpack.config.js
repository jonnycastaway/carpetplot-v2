const path = require('path');

module.exports = {
  target: 'web',
  mode: 'production',
  devtool: false,
  context: path.resolve(__dirname, 'src'),
  entry: './module.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'module.js',
    library: { type: 'amd' },
    publicPath: '/public/plugins/carpetplot-v2/',
    clean: false,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            compilerOptions: {
              jsx: 'react',
              esModuleInterop: true,
              module: 'esnext',
              moduleResolution: 'bundler',
              strict: false,
              skipLibCheck: true,
            },
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  externals: ['lodash', 'moment', 'react', 'react-dom', '@emotion/react', /^@grafana\/data/i, /^@grafana\/runtime/i, /^@grafana\/ui/i],
};