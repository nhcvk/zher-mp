//index.js
//获取应用实例
const app = getApp()
const myRequest = require('../../lib/request');

Page({
  data: {
    hasUserID: false,
    visibility: "visibility: hidden",
    cities: [],
    distance: [],
    margin: "width: 0",
    bookmarked: {},
    bookmark_id: {},
    bookmarks: [],
    logo: '',
    bookmarked_city_array: []
  },

  onLoad: function () {
    let page = this
    myRequest.get({
      path: 'cities',
      success(res) {
          page.setData({
          cities: res.data.cities,
        })
      }
    }),
        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            let userLocation = {
              latitude: res.latitude,
              longitude: res.longitude,
            }
            page.setData({
              userLocation,
            });
            app.globalData.userLocation = page.data.userLocation   
          }
        })

    
    console.log(111, this.data.hasUserID)
    const host = 'https://zher.wogengapp.cn/api/v1/'
    // const host = 'http://localhost:3000/api/v1/';
    console.log('processing to login')
    wx.login({
      success: res => {
        console.log(res)
        wx.request({
          url: host + 'login',
          method: 'POST',
          data: {
            code: res.code
          },
          success: res => {
            app.globalData.userId = res.data.userId
            this.setData ({
              hasUserID: true
            })  
              myRequest.get({
                path: `users/${app.globalData.userId}`,
                success(res) {
                  page.setData({
                    currentUser: res.data
                  })
                  app.globalData.currentUser = page.data.currentUser  
                  myRequest.get({
                    path: `users/${app.globalData.userId}/bookmarks`,
                    success(res) {
                      let bookmarked = page.data.bookmarked
                      let bookmark_id = page.data.bookmark_id
                      res.data.bookmarks.forEach((bookmark) => {
                        bookmark_id[bookmark.place_id] = bookmark.id
                        bookmarked[bookmark.place_id] = true
                      })
                      page.setData({
                        bookmarked,
                        bookmark_id,
                        bookmarks: res.data.bookmarks,
                        visibility: "visibility:show",
                        logo: 'toBookmark',
                      })
                      page.addBookmarksToGlobalData()
                      page.removeDups()                     
                    }
                  })
                }
              })
          },
        })
      }
    })
  },



  globalData: {},

  removeDups: function () {
    let page = this
    let bookmarked_city_array = page.data.bookmarked_city_array
    if (page.data.bookmarks.length > 0) {
      bookmarked_city_array = []
      page.data.bookmarks.forEach((bookmark) => {
        let temp_array = []
        let temp_object = {
          id: bookmark.place.city_id,
          name: bookmark.city.name
        }
        temp_array.push(temp_object)
        bookmarked_city_array = [...new Set(temp_array)];
      })
      page.setData({
        bookmarked_city_array
      })
    } else {
      page.setData({
        bookmarked_city_array: []
      })
    }
    app.globalData.bookmarked_city_array = page.data.bookmarked_city_array
  }, 

  goShow: function (e) {
    if (this.data.hasUserID = true) {
      app.globalData.currentTarget = this.data.cities[e.currentTarget.id].id
      app.globalData.currentUser =this.data.currentUser
      wx.navigateTo({
        url: `/pages/show/show`
      })
    } else {
      wx.showToast({
        title: 'Loading data',
      })
    }
  },
  addBookmarksToGlobalData: function () {
    let page = this
    app.globalData.bookmarks = page.data.bookmarks
    app.globalData.bookmarked = page.data.bookmarked
    app.globalData.bookmark_id = page.data.bookmark_id

  }, 
  toBookmark: function (e) {
    console.log("bindtap", e)
    app.globalData.bookmarkTarget = parseInt(e.currentTarget.id)
    wx.navigateTo({
      url: '../bookmarks/bookmarks',
    })
  },

  pageChange: function(e) {
    console.log(e)
  }
})