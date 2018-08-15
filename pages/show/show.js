// pages/show/show.js
const app = getApp()
const myRequest = require('../../lib/request');

Page({

  data: {
    items: [], 
    margin: "width: 0"
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

scroll: function(e) {
  this.setData({
    filter: `filter: blur(${e.detail.scrollTop / 100 }px)`
  })
 }, 

goMenu: function(e) {
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
}

})