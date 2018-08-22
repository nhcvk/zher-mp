// pages/signup/signup.js
const app = getApp()
const myRequest = require('../../lib/request');

Page({

  data: {
    items: [],
    user_id: app.globalData.userId,
    distance: [],
    margin: "width: 0",
    source: ['../../assets/icons/apply.jpeg']
  },

  onLoad: function () {
    let page = this
        page.setData({
          bookmarked_city_array: app.globalData.bookmarked_city_array,
          bookmark_id: app.globalData.bookmark_id,
          currentUser: app.globalData.currentUser
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

    ChangeToIndex: function (e) {
      wx.redirectTo({
        url: '../index/index',
      })
    },

    toBookmark: function (e) {
      app.globalData.bookmarkTarget = parseInt(e.currentTarget.id)
      wx.navigateTo({
        url: '../bookmarks/bookmarks',
      })
    },
    previewImage: function (e) {
      let page = this
      console.log(3333, e)
      setTimeout(function () {
        wx.previewImage({
          current: page.data.source[0],
          urls: page.data.source
        });

      }, 50)
    },   

})