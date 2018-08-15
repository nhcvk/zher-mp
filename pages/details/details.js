// pages/details/details.js
const app = getApp()
const myRequest = require('../../lib/request');

Page({

  data: {
    items: []
  },

  onLoad: function () {
    let page = this
    myRequest.get({
      path: 'places',
      success(res) {
        console.log(res)
        page.setData({ items: res.data.places })
      }
    })
  },


})