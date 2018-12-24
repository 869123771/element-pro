module.exports = {
  presets: [
    '@vue/app'
  ],
  "plugins": [
    [
      "import", 
      {
        "libraryName": "iview",
        "libraryDirectory": "src/components"
      }
    ],
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
]
}
