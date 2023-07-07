
function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    // publicPath: '/nxdc/',

    // devServer: {
    //     port: 8888, // 默认端口号
    //     https: false, // 是否为https 请求 https:{type:Boolean}
    //     compress: true,
    //     disableHostCheck: true, // 加上这段
    //     proxy: {
    //         '/admin': {// api 表示拦截以 /api开头的请求路径
    //             target: "http://localhost:3000",//跨域的域名（不需要写路径）
    //             changeOrigin: true,             //是否开启跨域
    //         },
    //     },
    // }
}
