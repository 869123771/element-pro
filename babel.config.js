module.exports = {
    presets: [
        [
            "@vue/app",
            {
                useBuiltIns : "entry",
                polyfills : ['es6.promise','es6.array.find-index','es7.array.includes','es6.string.includes']
            }
        ]
    ],
    "plugins": [
        /*[
          "component",
          {
            "libraryName": "element-ui",
            "styleLibraryName": "theme-chalk"
          }
        ]*/
        [
          "import",
          {
            "libraryName": "vxe-table",
            "style": true // 样式是否也按需加载
          }
        ]
    ]
}
