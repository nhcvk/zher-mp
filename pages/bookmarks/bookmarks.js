// pages/bookmarks/bookmarks.js
const app = getApp()
const myRequest = require('../../lib/request');

Page({

  data: {
    items: [],
    user_id: app.globalData.userId,
  },

  onShow: function () {
    let page = this
    myRequest.get({
      path: `users/${app.globalData.userId}/bookmarks`,
      success(res) {
        console.log(res)
        page.setData({
          items: res.data.bookmarks
        })
      } 
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