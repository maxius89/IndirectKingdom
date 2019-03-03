var path = require('path');
var webpack = require('webpack');
module.exports= {
  mode: 'none',
  entry: './src/script.ts',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'script.js'
  },
  module: {
    rules: [{
      test:/\.ts$/,
      include: path.resolve(__dirname, 'src'),
      loader: 'ts-loader'
    }]
  },
  resolve: {
    extensions: ["*", ".webpack.js", ".web.js", ".ts", ".js"]
  },
  plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]
}
