export default {
  state: {
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
              icon: 'icon-group-mgr',
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
      ]
    }

  },
  getters: {

  },
  mutations: {

  },
  actions: {

  }
}