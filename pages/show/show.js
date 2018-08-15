// pages/show/show.js
const app = getApp()
const myRequest = require('../../lib/request');

Page({

  data: {
    showLocation: false, 
    items: [], 
    margin: "width: 0",
    markers: [{ latitude: 30.572815, longitude: 104.066803 }]
  },


  onLoad: function () {
    let page = this
    myRequest.get({
      path: 'places',
      success(res) {
        console.log(res)
        page.setData({ 
          items: res.data.places
        })
      }
    })
  },

scroll: function(e) {
  this.setData({
    filter: `filter: blur(${e.detail.scrollTop  / 60 }rpx);`
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
},

resetBlur: function(e) {
  this.setData({
    filter: "filter: blur(0px);"
  })
}

})