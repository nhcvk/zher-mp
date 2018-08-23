// pages/profile/profile.js
const app = getApp();
const myRequest = require('../../lib/request');

Page({
  
  data: {
    showLocation: true,
    margin: "width: 0",
    changeIcon: "/assets/icons/change.png",
    distance: [],
  },

  // onLoad: function () {
  //   let page = this
  //   myRequest.get({
  //     path: `users/13`,
  //     success(res) {
  //       console.log("123123", res)
  //       page.setData({
  //         user: res.data
  //       })
  //       console.log(1232131, page.data.user)
  //     } 
  //   })
  // },


  onLoad: function () {
    let page = this
    myRequest.get({
      path: `cities/${app.globalData.cityLocal}/places`,
      success(res) {
        let placeLocal = []
            console.log(12123131, res)
            res.data.places.forEach((place) => {
            if (place.user_id === app.globalData.selectLocal) {
              placeLocal.push(place)
            }
          }),
      page.setData({
        places: placeLocal,
        bookmarked_city_array: app.globalData.bookmarked_city_array,
        bookmark_id: app.globalData.bookmark_id,
        currentUser: app.globalData.currentUser
      })
      }
    }),
      myRequest.get({
        path: `users/${app.globalData.selectLocal}`,
        success(res) {
          page.setData({
            local: res.data,
          })
        }
      })
    },

  // onLoad: function () {
  //   let page = this
  //   myRequest.get({
  //     path: `users/${app.globalData.userId}`,
  //     success(res) {
  //       console.log("123123", res)
  //       page.setData({
  //         user: res.data
  //       })
  //       console.log(1232131, page.data.user)
  //     } 
  //   })
  //   setTimeout(function () {
  //       myRequest.get({
  //         path: `users/${app.globalData.userId}/cities/${app.globalData.currentUser.city_id}`
  //       // path: `cities/${page.data.user.city_id}/places`,
  //       success(res) {
  //         let printed = []
  //         console.log("RES", res)
  //         res.data.places.forEach((result) => {
  //           if (page.data.user.id === result.user_id)
  //             printed.push(result)
  //         })
  //         page.setData({
  //           items: printed
  //         })   
  //       }
  //     })
  //   }, 500)
  // },

  scroll: function (e) {
    this.setData({
      filter: `filter: blur(${e.detail.scrollTop / 60}rpx);`
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

  pageChange: function (e) {
    this.setData({
      filter: "filter: blur(0px);",
    })
  },

  ChangeToIndex: function (e) {
    wx.reLaunch({
      url: '../index/index',
    })
  },

  toBookmark: function (e) {
    app.globalData.bookmarkTarget = parseInt(e.currentTarget.id)
    wx.navigateTo({
      url: '../bookmarks/bookmarks',
    })
  },

  ChangeToUpload: function (e) {
    wx.navigateTo({
      url: '/pages/upload/upload'
    })
  },
  becomeLocal: function (e) {
    let page = this
    wx.getUserInfo({
      success: function (res) {
        console.log(res)
        let name = res.userInfo.nickName
        let avatar_url = res.userInfo.avatarUrl
        myRequest.put({
          path: `users/${page.data.currentUser.id}`,
          data: {
            name: name,
            avatar_url: avatar_url
          }
        })
        wx.redirectTo({
          url: '../signup/signup',
        })
      }
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

  goShow: function (e) {
    console.log(e)
    app.globalData.showTarget = parseInt(e.currentTarget.id)
    wx. navigateTo({
      url: '../places/places',
    })
  }, 

})