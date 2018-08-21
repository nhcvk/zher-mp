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
    bookmarked_city_array: []
  },

  onLoad: function () {
    let page = this
    myRequest.get({
      path: 'cities',
      success(res) {
        console.log("123123", res)
          page.setData({
          cities: res.data.cities
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
            app.globalData.userLocation = userLocation            
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
            console.log(456, res)
            app.globalData.userId = res.data.userId
            console.log(888, app.globalData.userId)
            this.setData ({
              hasUserID: true
            })  
              myRequest.get({
                path: `users/${app.globalData.userId}`,
                success(res) {
                  console.log(12313241321243312123443, res)
                  page.setData({
                    currentUser: res.data
                  })
      
                  myRequest.get({
                    path: `users/${app.globalData.userId}/bookmarks`,
                    success(res) {
                      let bookmarked = page.data.bookmarked
                      let bookmark_id = page.data.bookmark_id
                      res.data.bookmarks.forEach((bookmark) => {
                        console.log(1111, bookmark)
                        bookmark_id[bookmark.place_id] = bookmark.id
                        bookmarked[bookmark.place_id] = true
                      })
                      page.setData({
                        bookmarked,
                        bookmark_id,
                        bookmarks: res.data.bookmarks
                      })
                      page.addBookmarksToGlobalData()
                      page.removeDups()
                    }
                  })
                }
              })
            let page = this
            // console.log(page.data.currentPage)
            page.setData({
              visibility: "visibility:show"
            })
            // console.log(999, this.data.hasUserID)
          },
        })
      }
    })
  },



  globalData: {},

  goShow: function (e) {
    if (this.data.hasUserID = true) {
      // console.log(789, this.data.hasUserID)
      // console.log(this.data.cities)
      app.globalData.currentTarget = this.data.cities[e.currentTarget.id].id
      app.globalData.currentUser =this.data.currentUser
      console.log(1312341, app.globalData)
      wx.navigateTo({
        url: `/pages/show/show`
      })
    } else {
      wx.showToast({
        title: 'Loading data',
      })
    }
  },

  getDistanceFromLatLonInKm: function (lat1, lon1, lat2, lon2) {
    let R = 6371
    let dLat = this.deg2rad(lat2 - lat1);
    let dLon = this.deg2rad(lon2 - lon1);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return Number((d * 1).toFixed(1));
  },

  deg2rad: function (deg) {
    return deg * (Math.PI / 180)
  },

  addBookmarksToGlobalData: function () {
    let page = this
    app.globalData.bookmarks = page.data.bookmarks
    app.globalData.bookmarked = page.data.bookmarked
    app.globalData.bookmark_id = page.data.bookmark_id
    console.log("GLOBAL DATA", app.globalData)
  }, 
  toBookmark: function (e) {
    console.log(e)
    app.globalData.bookmarkTarget = parseInt(e.currentTarget.id)
    wx.navigateTo({
      url: '../bookmarks/bookmarks',
    })
  }, 
  removeDups: function () {
    let page = this
    setTimeout(function () {
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
        const index = bookmarked_city_array.indexOf(page.data.items[0].city.name)
        bookmarked_city_array.splice(index, 1)
        page.setData({
          bookmarked_city_array
        })
      }
      app.globalData.bookmarked_city_array = page.data.bookmarked_city_array
    }, 500)
  }, 
})