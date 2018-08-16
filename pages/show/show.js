// pages/show/show.js
const app = getApp()
const myRequest = require('../../lib/request');
Page({
  data: {
    showLocation: false, 
    items: [], 
    margin: "width: 0",
    user_id: app.globalData.userId,
    bookmarked: {},
    bookmark_id: {}
  },


  onShow: function () {
    let page = this
    myRequest.get({
      path: 'places',
      success(res) {
        console.log(res)
        page.setData({ 
          items: res.data.places,
        })
      }
    }), 
    myRequest.get({
      path:`users/${app.globalData.userId}/bookmarks`,
      success(res) {
        console.log(res.data)
        let bookmarked = page.data.bookmarked
        let bookmark_id = page.data.bookmark_id
        res.data.bookmarks.forEach ((bookmark) => {
        console.log(bookmark.id)
        bookmark_id[bookmark.place_id] = bookmark.id
        bookmarked[bookmark.place_id] = true
        })
        page.setData({
          bookmarked,
          bookmark_id
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
  this.setData({
    filter: "filter: blur(0px);", 
  })
},

bookmark: function(e) {
  let page = this
  if (page.data.bookmarked[e.currentTarget.id] == true) {
    myRequest.delete({
      path: `users/${app.globalData.userId}/bookmarks/${page.data.bookmark_id[e.currentTarget.id]}`, 
      success(res) {
        let bookmarked = page.data.bookmarked
        let bookmark_id = page.data.bookmark_id
        delete bookmark_id[e.currentTarget.id]
        delete bookmarked[e.currentTarget.id]
        
        page.setData({
          bookmarked, 
          bookmark_id       
        })
      }
    })
   } else {
    myRequest.post({
      path: `users/${app.globalData.userId}/bookmarks`,
      data: {
        user_id: app.globalData.userId,
        place_id: e.currentTarget.id
      }, success(res) {
        let bookmarked = page.data.bookmarked
        let bookmark_id = page.data.bookmark_id
        bookmarked[e.currentTarget.id] = true
        bookmark_id[e.currentTarget.id] = res.data.id
        page.setData({
          bookmarked,
          bookmark_id
        }) 
      }
    })
}
}
})
