import Vue from 'vue'
import XEUtils from 'xe-utils'
import VXETablePluginElement from 'vxe-table-plugin-element'
import 'vxe-table-plugin-element/dist/style.css'
// ...

import {
    VXETable,
    Table,
    Icon,
    Column,
    Header,
    Footer,
    Filter,
    Edit,
    Menu,
    Export,
    Keyboard,
    Validator,

    Grid,
    Toolbar,
    Pager,
    Checkbox,
    Radio,
    Input,
    Textarea,
    Button,
    Modal,
    Tooltip,
    Form,
    Select,
    Switch,
    List
} from 'vxe-table'

// 按需加载的方式默认是不带国际化的，需要自行导入
VXETable.setup({
     size: 'medium', // 全局尺寸
     zIndex: 100, // 全局 zIndex 起始值，如果项目的的 z-index 样式值过大时就需要跟随设置更大，避免被遮挡
     version: 0, // 版本号，对于某些带数据缓存的功能有用到，上升版本号可以用于重置数据
     icon: {
    //   // table
    //   TABLE_SORT_ASC: 'vxe-icon--caret-top',
    //   TABLE_SORT_DESC: 'vxe-icon--caret-bottom',
    //   TABLE_FILTER_NONE: 'vxe-icon--funnel',
    //   TABLE_FILTER_MATCH: 'vxe-icon--funnel',
       TABLE_EDIT: 'fa fa-pencil',
    //   TABLE_TREE_LOADED: 'vxe-icon--refresh roll',
    //   TABLE_TREE_OPEN: 'vxe-icon--caret-right rotate90',
    //   TABLE_TREE_CLOSE: 'vxe-icon--caret-right',
    //   TABLE_EXPAND_LOADED: 'vxe-icon--refresh roll',
    //   TABLE_EXPAND_OPEN: 'vxe-icon--arrow-right rotate90',
    //   TABLE_EXPAND_CLOSE: 'vxe-icon--arrow-right',

    //   // button
    //   BUTTON_DROPDOWN: 'vxe-icon--arrow-bottom',
    //   BUTTON_LOADING: 'vxe-icon--refresh roll',

    //   // select
    //   SELECT_OPEN: 'vxe-icon--caret-bottom rotate180',
    //   SELECT_CLOSE: 'vxe-icon--caret-bottom',

    //   // pager
    //   PAGER_JUMP_PREV: 'vxe-icon--d-arrow-left',
    //   PAGER_JUMP_NEXT: 'vxe-icon--d-arrow-right',
    //   PAGER_PREV_PAGE: 'vxe-icon--arrow-left',
    //   PAGER_NEXT_PAGE: 'vxe-icon--arrow-right',
    //   PAGER_JUMP_MORE: 'vxe-icon--more',

    //   // input
    //   INPUT_CLEAR: 'vxe-icon--close',
    //   INPUT_PWD: 'vxe-icon--eye-slash',
    //   INPUT_SHOW_PWD: 'vxe-icon--eye',
    //   INPUT_PREV_NUM: 'vxe-icon--caret-top',
    //   INPUT_NEXT_NUM: 'vxe-icon--caret-bottom',
    //   INPUT_DATE: 'vxe-icon--calendar',
    //   INPUT_SEARCH: 'vxe-icon--search',

    //   // modal
    //   MODAL_ZOOM_IN: 'vxe-icon--square',
    //   MODAL_ZOOM_OUT: 'vxe-icon--zoomout',
    //   MODAL_CLOSE: 'vxe-icon--close',
    //   MODAL_INFO: 'vxe-icon--info',
    //   MODAL_SUCCESS: 'vxe-icon--success',
    //   MODAL_WARNING: 'vxe-icon--warning',
    //   MODAL_ERROR: 'vxe-icon--error',
    //   MODAL_QUESTION: 'vxe-icon--question',
    //   MODAL_LOADING: 'vxe-icon--refresh roll',

    //   // toolbar
    //   TOOLBAR_TOOLS_REFRESH: 'vxe-icon--refresh',
    //   TOOLBAR_TOOLS_REFRESH_LOADING: 'vxe-icon--refresh roll',
    //   TOOLBAR_TOOLS_IMPORT: 'vxe-icon--upload',
    //   TOOLBAR_TOOLS_EXPORT: 'vxe-icon--download',
    //   TOOLBAR_TOOLS_ZOOM_IN: 'vxe-icon--zoomin',
    //   TOOLBAR_TOOLS_ZOOM_OUT: 'vxe-icon--zoomout',
    //   TOOLBAR_TOOLS_CUSTOM: 'vxe-icon--menu',

    //   // form
    //   FORM_PREFIX: 'vxe-icon--info',
    //   FORM_SUFFIX: 'vxe-icon--info',
    //   FORM_FOLDING: 'vxe-icon--arrow-top rotate180',
    //   FORM_UNFOLDING: 'vxe-icon--arrow-top'
     },
     table: {
       showHeader: true,
       keepSource: false,
       delayHover: 250,
       showOverflow: true,
       showHeaderOverflow: false,
    //   showFooterOverflow: null,
       size: 'medium',
       resizable: true,
       autoResize: false,
       stripe: true,
       border: false,
       round: false,
       radioConfig: {
         trigger: 'default'
       },
       checkboxConfig: {
         strict: false,
         highlight: false,
         range: false,
         trigger: 'default'
       },
       sortConfig: {
         remote: false,
         trigger: 'default',
         orders: ['asc', 'desc', null],
         sortMethod: null
       },
       filterConfig: {
         remote: false,
         filterMethod: null
       },
       expandConfig: {
         trigger: 'default',
         showIcon: true
       },
       treeConfig: {
         children: 'children',
         hasChild: 'hasChild',
         indent: 20,
         showIcon: true
       },
       tooltipConfig: {
         theme: 'dark',
         enterable: false
       },
       contextMenu: {
         visibleMethod () {}
       },
       rowId: '_XID', // 行数据的唯一主键字段名
       editConfig: {
         mode: 'cell',
         showAsterisk: true,
       },
       importConfig: {
         modes: ['insert', 'covering']
       },
       exportConfig: {
         modes: ['current', 'selected']
       },
       customConfig: {
        storage: false
       },
       scrollX: {
         gt: 60
       },
       scrollY: {
         gt: 100
       }
     },
     grid: {
       size: null,
       zoomConfig: {
         escRestore: true
       },
       pagerConfig: {
         perfect: false
       },
       toolbarConfig: {
         perfect: false
       },
       proxyConfig: {
         autoLoad: true,
         message: true,
         props: {
           list: null, // 用于列表，读取响应数据
           result: 'result', // 用于分页，读取响应数据
           total: 'page.total' // 用于分页，读取总条数
         },
         beforeItem: null,
         beforeColumn: null,
         beforeQuery: null,
         afterQuery: null,
         beforeDelete: null,
         afterDelete: null,
         beforeSave: null,
         afterSave: null
       }
     },
     pager: {
       size: null,
       autoHidden: false,
       perfect: true,
       pageSize: 10,
       pagerCount: 7,
       pageSizes: [10, 15, 20, 50, 100],
       layouts: ['PrevJump', 'PrevPage', 'Jump', 'PageCount', 'NextPage', 'NextJump', 'Sizes', 'Total']
     },
})

VXETable.use(VXETablePluginElement)

// 先安装依赖模块
Vue.use(Icon)
Vue.use(Column)
Vue.use(Header)
Vue.use(Footer)
Vue.use(Filter)
Vue.use(Edit)
Vue.use(Menu)
Vue.use(Export)
Vue.use(Keyboard)
Vue.use(Validator)

Vue.use(Tooltip)
Vue.use(Grid)
Vue.use(Toolbar)
Vue.use(Pager)
Vue.use(Form)
Vue.use(Checkbox)
Vue.use(Radio)
Vue.use(Switch)
Vue.use(Input)
Vue.use(Select)
Vue.use(Button)
Vue.use(Modal)
Vue.use(List)

// 再安装核心库
Vue.use(Table)

// 给 vue 实例挂载内部对象，例如：
Vue.prototype.$XModal = VXETable.modal
Vue.prototype.$XPrint = VXETable.print
Vue.prototype.$XSaveFile = VXETable.saveFile
Vue.prototype.$XReadFile = VXETable.readFile
