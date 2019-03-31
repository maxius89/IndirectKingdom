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
      test:/\.(ts|tsx)$/,
      include: path.resolve(__dirname, 'src'),
      loader: 'ts-loader'
    }]
  },
  externals: {
      "react": "React",
      "react-dom": "ReactDOM"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
  },
  plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]
}
