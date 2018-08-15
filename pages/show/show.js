// pages/show/show.js
const app = getApp()
const myRequest = require('../../lib/request');

Page({

  data: {
    items: [], 
    filter: ""
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

fuck: function(e) {

  this.setData({
    filter: `filter: blur(${e.detail.scrollTop / 100 }px)`
  })
 } 

})