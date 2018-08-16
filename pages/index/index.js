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
            console.log(456, res)
            app.globalData.userId = res.data.userId
            console.log(888, app.globalData.userId)
            this.setData ({
              hasUserID: true
            })
            let page = this
            // console.log(page.data.currentPage)
            page.setData({
              visibility: "visibility:show"
            })
            // console.log(999, this.data.hasUserID)
          },
        })
      }
    })
  },

  globalData: {},

  goShow: function (e) {
    if (this.data.hasUserID = true) {
      // console.log(789, this.data.hasUserID)
      wx.navigateTo({
        url: '/pages/show/show'
      })
    } else {
      wx.showToast({
        title: 'Loading data',
      })
    }
  },

  goBookmarks: function (e) {
    wx.navigateTo({
      url: '/pages/bookmarks/bookmarks'
    })
  },

  goMenu: function (e) {
    if (this.data.margin == "width: 0") {
      this.setData({
        margin: "width: 250",
        movable: "margin-left: 250px"
      })
    }
    else {
      this.setData({
        margin: "width: 0",
        movable: "margin-left: 0px"
      })
    }
  },


})
