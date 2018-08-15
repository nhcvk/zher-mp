//app.js


App({
  onLaunch: function () {
    const host = 'http://localhost:3000/api/v1/'
    console.log('processing to login')
    wx.login({
      success: res => {
        console.log(res)
        wx.request({
          url: host + 'login',
          method: 'POST',
          data: {
            code: res.code
          },
          success: res => {
            console.log(res)
            this.globalData.userId = res.data.userId
          }
        })
      }
    })
  },
  globalData: {}
})  