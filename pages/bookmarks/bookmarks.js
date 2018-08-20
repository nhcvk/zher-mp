// pages/bookmarks/bookmarks.js
const app = getApp()
const myRequest = require('../../lib/request');

Page({

  data: {
    items: [],
    user_id: app.globalData.userId,
    distance: [],
    margin: "width: 0",
  },

  onLoad: function () {
    let page = this
    myRequest.get({
      path: `users/${app.globalData.userId}/bookmarks`,
      success(res) {
        let printed = []
        res.data.bookmarks.forEach ((result) => {
            if (app.globalData.bookmarkTarget === result.place.city_id) {
              printed.push(result)
            } 
        })
        page.setData({
          items: printed
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
    setTimeout(function (){
    page.setData({ user_id: app.globalData.userId })
    let distance = page.data.distance
    page.data.items.forEach((item) => {
      console.log(123123, item)
      distance.push([page.getDistanceFromLatLonInKm(item.place.latitude, item.place.longitude, app.globalData.userLocation.latitude, app.globalData.userLocation.longitude)])
      page.setData({
        distance,
        bookmarked: [app.globalData.bookmarked],
        bookmarked_city_array: app.globalData.bookmarked_city_array,
        bookmark_id: app.globalData.bookmark_id
      })
    });
    console.log(page.data.items)
    let places = []
    page.data.items.forEach((place, index) => {
      places.push(Object.assign({}, place, distance[index]))
      page.setData({ places })
    }) 
    }, 100)
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
    console.log(e)
    app.globalData.bookmarkTarget = parseInt(e.currentTarget.id)
    wx.navigateTo({
      url: '../bookmarks/bookmarks',
    })
  }

})