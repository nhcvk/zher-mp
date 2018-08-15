// pages/show/show.js
const app = getApp()
const myRequest = require('../../lib/request');

Page({

  data: {
    showLocation: false, 
    items: [], 
    margin: "width: 0",
    bookmark:  "../../assets/icons/bookmark.png",
    currentPage: 0
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

pageChange: function(e) {
  console.log(e)
  this.setData({
    filter: "filter: blur(0px);", 
    currentPage: e.detail.current
  })
  console.log(this.data.currentPage)
},

bookmark: function(e) {
  let page = this
  console.log(page.data.currentPage)
  myRequest.post({
    path: `users/1/bookmarks`,
    data: {
     user_id: 1,
     place_id: page.data.currentPage + 1, 
    }
  }),
  page.setData({
    bookmark: "../../assets/icons/bookmarked.png"
  }), 
   wx.showToast({
    title: 'SAVED'
  }) 
}

})