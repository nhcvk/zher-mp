// pages/bookmarks/bookmarks.js
const app = getApp()
const myRequest = require('../../lib/request');

Page({

  data: {
    items: []
    user
  },

  onLoad: function () {
    let page = this
    myRequest.get({
      path: '${}',
      success(res) {
        console.log(res)
        page.setData({
          items: res.data.places
        })
      }
    })
  }
})