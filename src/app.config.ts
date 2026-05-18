export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/media/index',
    'pages/profile/index',
    'pages/device-connect/index',
    'pages/device-add/index',
    'pages/settings/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'Smart Recliner',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#0066CC',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        text: 'HOME'
      },
      {
        pagePath: 'pages/media/index',
        text: 'MEDIA'
      },
      {
        pagePath: 'pages/profile/index',
        text: 'YOU'
      }
    ]
  }
})
