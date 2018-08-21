const app = getApp()
const myRequest = require('../../lib/request');
const AV = require('../../utils/av-weapp-min.js')

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
    }, 200)
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
  uploadSmallPhoto: function (e) {
    let that = this
    let myImages = []
    console.log("that >> ")
    wx.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['camera', 'album'],
      success: function (res) {
        let tempFilePaths = res.tempFilePaths;
        console.log(res.tempFilePaths)
        let tempFilePathsLength = tempFilePaths.length;
        res.tempFilePaths.map(tempFilePath => () => new AV.File('filename', {
          blob: {
            uri: tempFilePath,
          },
        }).save()).reduce(
          (m, p) => m.then(v => AV.Promise.all([...v, p()])),
          AV.Promise.resolve([])
          ).then(function (files) {
            files.map(file => {
              myImages.push(file.url())
            })
            that.setData({ smallImageUrl: myImages })
            console.log(e)
            let photo_url = that.data.place.photo_urls
            setTimeout(function () {
              that.data.smallImageUrl.forEach((image) => {
                photo_url.push(image)
              })
              console.log(22222, photo_url)
              console.log(that.data.place.photo_urls)
              myRequest.put({
                path: `cities/${app.globalData.currentTarget}/places/${that.data.place.id}`,
                data: {
                  place: { photo_urls: photo_url }
                }
              })
              that.setData({
                photo_urls: photo_url
              })
              console.log(123, that.data.places[e.currentTarget.dataset.imageId].photo_urls)
            }, 30),
              wx.showToast({
                title: '好'
              })
            setTimeout(function () {
              wx.reLaunch({
                url: '/pages/places/places',
              })
            }, 500)
          })
      }
    })
  }, 
})
         
