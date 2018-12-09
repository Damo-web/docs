module.exports = {
  title: 'Damo',
  description: '达摩院文档平台',
  dest: './dist',
  base: '/docs/',
  port: 8888,
  head: [
    ['link', { rel: 'shortcut icon', type: "image/x-icon", href: "/favicon.ico" }]
  ],
  themeConfig: {
    nav:[
      {text: '跨端',link: '/platform/'},
      {text: '服务端',link: '/server/'},
      {text: '框架',link: '/framework/'},
      {text: '渲染',link: '/render/'},
      {text: '交互',link: '/ux/'}
    ],
    sidebar:{
      '/platform/':[{
        title: '文章列表',
        collapsable: false,
        children:[
          ''
        ]
      }],
      '/server/':[{
        title: '文章列表',
        collapsable: false,
        children:[
          ''
        ]
      }],
      '/framework/':[{
        title: '文章列表',
        collapsable: false,
        children:[
          ''
        ]
      }],
      '/render/':[{
        title: '文章列表',
        collapsable: false,
        children:[
          ''
        ]
      }],
      '/ux/':[{
        title: '文章列表',
        collapsable: false,
        children:[
          ''
        ]
      }]
    }
  }
}