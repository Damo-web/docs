module.exports = {
  title: 'Damo',
  description: '达摩院文档平台',
  dest: './dist',
  base: '/docs/',
  port: 8888,
  head: [
    ['link', {
      rel: 'shortcut icon',
      type: "image/x-icon",
      href: "/favicon.ico"
    }],
    ['link', {
      rel: 'manifest',
      href: '/manifest.json'
    }]
  ],
  plugins: [
    ['@vuepress/pwa', {
      serviceWorker: true,
      updatePopup: {
        message: '发现新内容可用',
        buttonText: '刷新'
      }
    }],
    ['@vuepress/last-updated', {
      transformer: (timestamp) => {
        const moment = require('moment');
        return moment(timestamp).format('YYYY-MM-DD hh:mm:ss A');
      }
    }],
    ['@vuepress/back-to-top', true],
    //修改默认图片selector
    ['@vuepress/medium-zoom', {
      selector: '.zoomable'
    }]
  ],
  themeConfig: {
    //上次更新插槽
    lastUpdated: '上次更新',
    // 默认是 GitHub. 同时也可以是一个完整的 GitLab URL
    repo: 'Damo-web/docs',
    // 假如文档不是放在仓库的根目录下：
    docsDir: 'docs',
    // 默认是 false, 设置为 true 来启用
    editLinks: true,
    // 默认为 "Edit this page"
    editLinkText: '在 GitHub 上编辑此页！',
    nav: [{
        text: '跨端',
        link: '/platform/'
      },
      {
        text: '服务端',
        link: '/server/'
      },
      {
        text: '框架',
        link: '/framework/'
      },
      {
        text: '工程化',
        link: '/engineering/'
      },
      {
        text: '渲染',
        link: '/render/'
      },
      {
        text: '互动媒体',
        link: '/media/'
      }
    ],
    sidebar: {
      '/platform/': [{
        title: '文章列表',
        collapsable: false,
        children: [
          '',
          'vueLoader',
          'templateCompiler',
          'htmlParser',
          'postcss',
          'babel',
          'mpcli',
          'jsonParser'
        ]
      }],
      '/server/': [{
        title: '文章列表',
        collapsable: false,
        children: [
          '',
          'debugger'
        ]
      }],
      '/framework/': [{
        title: '文章列表',
        collapsable: false,
        children: [
          '',
          'redux',
          'mvvm',
          'vuex'
        ]
      }],
      '/engineering/': [{
        title: '文章列表',
        collapsable: false,
        children: [
          '',
          'eslint',
          'stylelint'
        ]
      }],
      '/render/': [{
        title: '文章列表',
        collapsable: false,
        children: [
          ''
        ]
      }],
      '/media/': [{
        title: '文章列表',
        collapsable: false,
        children: [
          ''
        ]
      }]
    }
  }
}