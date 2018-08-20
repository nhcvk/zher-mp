const app = getApp()
const myRequest = require('../../lib/request');

Page({

  data: {
    user_id: app.globalData.userId,
    distance: [],
    margin: "width: 0",
  },

  onLoad: function () {
    let page = this
    myRequest.get({
      path: `cities/${app.globalData.bookmarkTarget}/places/${app.globalData.showTarget}`,
      success(res) {
        console.log("RES", res)
        page.setData({
          place: res.data
        })
      }
    })
    myRequest.get({
      path: `users/${app.globalData.userId}`,
      success(res) {
        page.setData({
          currentUser: res.data
        })
      }
    }),
    setTimeout(function () {
      page.setData({ user_id: app.globalData.userId })
      let distance = page.data.distance
      console.log()
        distance.push([page.getDistanceFromLatLonInKm(page.data.place.latitude, page.data.place.longitude, app.globalData.userLocation.latitude, app.globalData.userLocation.longitude)])
        page.setData({
          distance,
          bookmarked: [app.globalData.bookmarked],
          bookmarked_city_array: app.globalData.bookmarked_city_array,
          bookmark_id: app.globalData.bookmark_id
        })
    }, 100)
  },
  

  ChangeToIndex: function (e) {
    wx.navigateTo({
      url: '/pages/index/index'
    }),
      this.setData({
        changeIcon: "/assets/icons/change-hover.png"
      })
  },
  ChangeToUpload: function (e) {
    wx.navigateTo({
      url: '/pages/upload/upload'
    })
  }, 


    goMenu: function (e) {
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

  backToHome: function (e) {
    wx.redirectTo({
      url: '../index/index',
    })
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

  toBookmark: function (e) {
    app.globalData.bookmarkTarget = parseInt(e.currentTarget.id)
    wx.navigateTo({
      url: '../bookmarks/bookmarks',
    })
  },

  toShow: function (e) {
    app.globalData.showTarget = parseInt(e.currentTarget.id)
    wx.navigateTo({
      url: '../places/places',
    })
  }, 

  scroll: function (e) {
    this.setData({
      filter: `filter: blur(${e.detail.scrollTop / 60}rpx);`
    })
  }, 

})
         