//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hasUserID: false,
    visibility: "visibility: hidden"
  },

  onLoad: function () {

    console.log(111, this.data.hasUserID)
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
            console.log(888, this.data.hasUserID)
            this.setData ({
              hasUserID: true
            })
            console.log(999, this.data.hasUserID)
          },
        })
        let page = this
        console.log(page.data.currentPage)
        page.setData ({
          visibility: "visibility:show"
        })
      }
    })
  },

  globalData: {},

  goShow: function (e) {
    if (this.data.hasUserID = true) {
      console.log(789, this.hasUserID)
      wx.navigateTo({
        url: '/pages/show/show'
      })
    } else {
      wx.showToast({
        title: 'Loading data',
      })
    }
  },

})
