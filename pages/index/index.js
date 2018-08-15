//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  },

  goShow: function (e) {
    wx.navigateTo({
      url: '/pages/show/show'
    })
  },

})
