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
    bookmark_id: {},
    bookmarks: [], 
    city_name_array: []
  },


  onShow: function () {
    let page = this
    myRequest.get({
      path: 'cities/1/places',
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
        console.log("MyRequestGet", res.data)
        let bookmarked = page.data.bookmarked
        let bookmark_id = page.data.bookmark_id
        let city_name_array = page.data.city_name_array
        res.data.bookmarks.forEach ((bookmark) => {
          bookmark_id[bookmark.place_id] = bookmark.id
          bookmarked[bookmark.place_id] = true
          const temp_array = [bookmark.city.name]
          city_name_array = [...(new Set(temp_array))]

        })
        page.setData({
          bookmarked,
          bookmark_id,
          city_name_array
        }), 
        page.setData({
          bookmarks: res.data.bookmarks
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
