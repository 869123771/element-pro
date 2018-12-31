import Vue from 'vue'
export default {
    state: {
        layout: {
            sidebarWidth: {
                width: '12%'
            },
            mainWidth: {
                width: '88%',
                'margin-left': '12%'
            }
        },
        menuProps: {
            collapse: false,
            activeName: '',
            openNames: [],
            navMenus: [{
                title: '首页',
                name: 'home',
                icon: 'icon-home',
                path: '/home',
                children: []
            },
                {
                    title: 'API设计',
                    name: 'apiDesign',
                    icon: 'icon-api-design',
                    path: '/api_design',
                    children: []
                },
                {
                    title: 'API开发',
                    name: 'apiDev',
                    icon: 'icon-api-dev',
                    path: '/api_dev',
                    children: []
                },
                {
                    title: 'API测试',
                    name: 'apiTest',
                    icon: 'icon-api-test',
                    path: '/api_test',
                    children: []
                },
                {
                    title: 'API部署',
                    name: 'apiDeploy',
                    icon: 'icon-api-deploy',
                    path: '/api_deploy',
                    children: []
                },
                {
                    title: 'API分析',
                    name: 'apiAnalyze',
                    icon: 'icon-api-analyze',
                    path: '/api_analyze',
                    children: [{
                        title: '日志检索',
                        name: 'logSearch',
                        icon: 'icon-log-search',
                        path: '/log_search',
                        children: []
                    }]
                },
                {
                    title: '应用管理',
                    name: 'appMgr',
                    icon: 'icon-app-mgr',
                    path: '/app_mgr',
                    children: []
                },
                {
                    title: '资源管理',
                    name: 'resourceMgr',
                    icon: 'icon-resource-mgr',
                    path: '/resource_mgr',
                    children: [{
                        title: 'API组管理',
                        name: 'apiGroupMgr',
                        icon: 'icon-api-mgr',
                        path: '/api_group_mgr',
                        children: []
                    },
                        {
                            title: '数据源管理',
                            name: 'dataSourceMgr',
                            icon: 'icon-datasource-mgr',
                            path: '/data_source_mgr',
                            children: []
                        },
                        {
                            title: '任务管理',
                            name: 'taskMgr',
                            icon: 'icon-task-mgr',
                            path: '/task_mgr',
                            children: []
                        },
                    ]
                },
                {
                    title: '集群管理',
                    name: 'clusterMgr',
                    icon: 'icon-cluster-mgr',
                    path: '/cluster_mgr',
                    children: [{
                        title: '域管理',
                        name: 'domainMgr',
                        icon: 'icon-domain-mgr',
                        path: '/domain_mgr',
                        children: []
                    },
                        {
                            title: '集群管理',
                            name: 'clusterMgr',
                            icon: 'icon-cluster-mgr',
                            path: '/cluster_mgr',
                            children: []
                        },
                        {
                            title: '节点管理',
                            name: 'nodeMgr',
                            icon: 'icon-node-mgr',
                            path: '/mode_mgr',
                            children: []
                        },
                    ]
                },
                {
                    title: '系统管理',
                    name: 'sysMgr',
                    icon: 'icon-sys-mgr',
                    path: '/sys_mgr',
                    children: [{
                        title: '操作日志',
                        name: 'operLog',
                        icon: 'icon-operate-log',
                        path: '/oper_log',
                        children: []
                    },
                        {
                            title: '字典管理',
                            name: 'dictMgr',
                            icon: 'icon-dict-mgr',
                            path: '/dict_mgr',
                            children: []
                        },
                        {
                            title: '用户管理',
                            name: 'userMgr',
                            icon: 'icon-user-mgr',
                            path: '/user_mgr',
                            children: []
                        },
                        {
                            title: '用户组管理',
                            name: 'userGroupMgr',
                            icon: 'icon-user-group-mgr',
                            path: '/user_group_mgr',
                            children: []
                        },
                    ]
                },
                {
                    title: '多级菜单测试',
                    name: 'more',
                    icon: '',
                    path: 'more',
                    children: [
                        {
                            title: '1-1',
                            name: '1-1',
                            icon: '',
                            path: '1-1',
                            children: [
                                {
                                    title: '1-1-1',
                                    name: '1-1-1',
                                    icon: '',
                                    path: '1-1-1',
                                    children: [
                                        {
                                            title: '1-1-1-1',
                                            name: '1-1-1-1',
                                            icon: '',
                                            path: '1-1-1-1',
                                            children: []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            title: '1-2',
                            name: '1-2',
                            icon: '',
                            path: '1-2',
                            children: []
                        }
                    ]
                }
            ]
        },
        breadcrumbList: [],
        navTagList : []
    },
    getters: {},
    mutations: {
        shrinkMenu(state) {
            let {
                menuProps,
                menuProps: {
                    collapse
                },
                layout
            } = state
            if (collapse) {
                state.layout = {
                    sidebarWidth: {
                        width: '12%'
                    },
                    mainWidth: {
                        width: '88%',
                        'margin-left': '12%'
                    }
                }
            } else {
                state.layout = {
                    sidebarWidth: {
                        width: '64px'
                    },
                    mainWidth: {
                        'margin-left': '64px',
                        width: 'auto',
                    }
                }
            }
            state.menuProps = {
                ...menuProps,
                collapse: !collapse,
            }
        },
        activeMenu(state, {path}) {
            let {
                menuProps,
                menuProps: {
                    collapse
                }
            } = state
            state.menuProps = {
                ...menuProps,
                activeName: path,
            }
        },

        activeBreadcrumb(state, {matched}) {
            let breadcrumbList = []
            matched.filter(item => item.path).forEach(({path, meta}) => {
                if (path !== '/home') {
                    breadcrumbList = [
                        ...breadcrumbList,
                        {path, ...meta}
                    ]
                }
            })
            breadcrumbList.unshift({path: '/home', title: '首頁', icon: 'icon-home'})
            state.breadcrumbList = breadcrumbList
        },
        activeNavTag(state,{path,title}) {
            debugger;
            let defaultTagList = [{path: '/home', title: '首頁', closable : false}]
            let {navTagList} = state
            let addTagList = []

            if(navTagList.length){
                navTagList.forEach(item=>{
                    if(!navTagList.map(item=>item.path).includes(path) && !addTagList.map(item=>item.path).includes(path)){
                        if(navTagList.length >= 5){
                            navTagList.splice(1,1)
                        }
                        addTagList.push({path,title,current:true,closable : true})
                    }else{
                        if(item.path === path){
                            item.current= true;
                        }else{
                            item.current= false;
                        }
                    }
                })

            }else{
                defaultTagList.forEach(item=>{
                    if(item.path !== path){
                        addTagList.push({path,title,current:true,closable : true})
                    }else{
                        item.current= true;
                    }
                })
                navTagList = defaultTagList
            }
            state.navTagList = [...navTagList,...addTagList]
        },
        removeNavTag(state,tagProps){
            debugger;
            let {path,current} = tagProps
            let {navTagList} = state
            let newTagList = navTagList
            navTagList.forEach((item,index)=>{
                if(item.path === path){
                    if(current){
                        newTagList[index-1].current = true;
                        location.href = location.origin + '#' + newTagList[index-1].path
                    }
                    newTagList.splice(index,1)
                }
            })
            state.navTagList = newTagList
        }
    },
    actions: {}
}
