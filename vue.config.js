module.exports = {
    devServer: {
    hot: true,
    compress: true,
    disableHostCheck: true,
    proxy: {
      "/api": {
        target: "http://jdc.zzux.com:572",//你的接口地址
        changeOrigin: true,//是否跨域
        pathRewrite: {
          "^/api": ""//接口重写，表示/api开头的就是代理到target,即是http://xxxx:8002/Home
        }
      }
    }
  },
  }