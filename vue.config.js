const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin')
const MonacoEditorPlugin = require('monaco-editor-webpack-plugin')
const CompressionWebpackPlugin = require("compression-webpack-plugin");
/*
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');
const dashboard = new Dashboard();*/
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

// const zopfli = require("@gfx/zopfli");
// const BrotliPlugin = require("brotli-webpack-plugin");
const AliOssPlugin = require("webpack-oss");

const path = require("path");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const glob = require("glob-all");

const resolve = dir => path.join(__dirname, dir);
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
const IS_DEV = ["development"].includes(process.env.NODE_ENV);

const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

module.exports = {
   // publicPath: IS_PROD ? process.env.VUE_APP_SRC || "/" : "./", // 默认'/'，部署应用包时的基本 URL
    publicPath: IS_PROD ? process.env.VUE_APP_PUBLIC_PATH : "./", // 默认'/'，部署应用包时的基本 URL
    outputDir: process.env.outputDir || "dist", // 'dist', 生产环境构建文件的目录
    assetsDir: "", // 相对于outputDir的静态资源(js、css、img、fonts)目录
    lintOnSave: false,
    runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
    productionSourceMap: false, // 生产环境的 source map
    //  指定对第三方依赖包进行babel-polyfill处理
    transpileDependencies: [
        'vue-echarts',
        'resize-detector'
    ],

    configureWebpack: config => {
        // cdn引用时配置externals
        // config.externals = {
        //     'vue': 'Vue',
        //     'element-ui': 'ELEMENT',
        //     'vue-router': 'VueRouter',
        //     'vuex': 'Vuex',
        //     'axios': 'axios'
        // }

        config.entry = ['./src/main.js']
        let plugins  = config.plugins

        plugins.push(
            new MonacoEditorPlugin()
        )

        if (IS_PROD) {
            /*plugins.push(
                new PurgecssPlugin({
                    paths: glob.sync([
                        path.join(__dirname, "./src/index.html"),
                        path.join(__dirname, "./!**!/!*.vue"),
                        path.join(__dirname, "./src/!**!/!*.js")
                    ])
                })
            );*/

            plugins.push(
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: true, // Must be set to true if using source-maps in production
                    terserOptions: {
                        compress: {
                            drop_console: true,
                            drop_debugger: true
                        }
                    }
                })
            );

          //  plugins.push(new DashboardPlugin(dashboard.setData))

            plugins.push(
                new HardSourceWebpackPlugin()
            );

            plugins.push(
                new CompressionWebpackPlugin({
                    filename: "[path].gz[query]",
                    algorithm: "gzip",
                    test: productionGzipExtensions,
                    threshold: 10240,
                    minRatio: 0.8
                })
            );

            // 上传文件到oss
            //if (process.env.ACCESS_KEY_ID || process.env.ACCESS_KEY_SECRET || process.env.REGION || process.env.BUCKET || process.env.PREFIX) {
            //    plugins.push(
            //        new AliOssPlugin({
            //            accessKeyId: process.env.ACCESS_KEY_ID,
            //            accessKeySecret: process.env.ACCESS_KEY_SECRET,
            //            region: process.env.REGION,
            //            bucket: process.env.BUCKET,
            //            prefix: process.env.PREFIX,
            //            exclude: /.*\.html$/,
            //            deleteAll: false
            //        })
            //    );
            //}

            // Zopfli压缩，需要响应VC库 https://webpack.js.org/plugins/compression-webpack-plugin/
            // plugins.push(
            //     new CompressionWebpackPlugin({
            //         algorithm(input, compressionOptions, callback) {
            //             return zopfli.gzip(input, compressionOptions, callback);
            //         },
            //         compressionOptions: {
            //             numiterations: 15
            //         },
            //         minRatio: 0.99,
            //         test: productionGzipExtensions
            //     })
            // );
            // plugins.push(
            //     new BrotliPlugin({
            //         test: productionGzipExtensions,
            //         minRatio: 0.99
            //     })
            // );
        }
    },
    chainWebpack: config => {

        // 修复HMR
        config.resolve.symlinks(true);

        // 修复Lazy loading routes Error： Cyclic dependency  [https://github.com/vuejs/vue-cli/issues/1669]
        config.plugin("html").tap(args => {
            args[0].chunksSortMode = "none";
            return args;
        });

        // 添加别名
        config.resolve.alias
            .set("@", resolve("src"))
            .set("assets", resolve("src/assets"))
            .set("components", resolve("src/components"))

        // set svg-sprite-loader
        config.module
            .rule('svg')
            .exclude.add(resolve('src/views/modules/online/desform/designFormList/designFormTools/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/views/modules/online/desform/designFormList/designFormTools/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()

        if (IS_PROD) {
            // 压缩图片
            config.module
                .rule("images")
                .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
                .use("image-webpack-loader")
                .loader("image-webpack-loader")
                .options({
                    mozjpeg: { progressive: true, quality: 65 },
                    optipng: { enabled: false },
                    pngquant: { enabled: false,quality: [0.65, 0.90], speed: 4 },
                    gifsicle: { interlaced: false },
                });


            // 打包分析
            if (process.env.IS_ANALYZ) {
                config.plugin("webpack-report").use(BundleAnalyzerPlugin, [
                    {
                        analyzerMode: "static"
                    }
                ]);
            }
        }

        // 多页面配置，为js添加hash
        // config.output.chunkFilename(`js/[name].[chunkhash:8].js`)

        // 修改图片输出路径
        // config.module
        //   .rule('images')
        //   .test(/\.(png|jpe?g|gif|ico)(\?.*)?$/)
        //   .use('url-loader')
        //   .loader('url-loader')
        //   .options({
        //       name: path.join('../assets/', 'img/[name].[ext]')
        //   })
    },
    css: {
        modules: false,
        extract: IS_PROD,
        // 为css后缀添加hash
        // extract: {
        //  filename: 'css/[name].[hash:8].css',
        //  chunkFilename: 'css/[name].[hash:8].css'
        //}，
        sourceMap: true,
        loaderOptions: {
            sass: {
                // 向全局sass样式传入共享的全局变量
                // data: `@import "~assets/scss/variables.scss";$src: "${process.env.VUE_APP_SRC}";`
                data: `$src: "${process.env.VUE_APP_SRC}";`
            }
            // px转换为rem
            // postcss: {
            //   plugins: [
            //     require('postcss-pxtorem')({
            //       rootValue : 1, // 换算的基数
            //       selectorBlackList  : ['weui', 'el'], // 忽略转换正则匹配项
            //       propList   : ['*']
            //     })
            //   ]
            // }
        }
    },
    pluginOptions: {
        // 安装vue-cli-plugin-style-resources-loader插件
        // 添加全局样式global.scss
        // "style-resources-loader": {
        //   preProcessor: "scss",
        //   patterns: [
        //     resolve(__dirname, "./src/scss/scss/variables.scss")
        //   ]
        // }
    },
    parallel: require("os").cpus().length > 1,
    pwa: {},
    devServer: {
        // overlay: {
        //   warnings: true,
        //   errors: true
        // },
        open: IS_PROD,
        //host: "localhost",
        port: 8088,
        https: false,
        hotOnly: true,
        disableHostCheck: true,
        proxy: {
            '/jeecg-boot': {
                //target : 'http://localhost:8080',
                target: process.env.VUE_APP_BASE_API || 'http://47.107.178.235:8080/',
                //target : 'http://boot.jeecg.org',
                ws: false,
                //secure: false,
                changeOrigin: true
            },
            /*'/': {
                target: process.env.VUE_APP_BASE_API || 'http://127.0.0.1:8098',
                ws: false,
                secure : false,
                changeOrigin: true
            },*/
        },
    }
};
