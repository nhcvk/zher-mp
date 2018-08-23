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
    page.showPageLoad()
    page.setData({
      bookmarked_city_array: app.globalData.bookmarked_city_array,
      bookmark_id: app.globalData.bookmark_id,
      currentUser: app.globalData.currentUser

    })

  },
  
  showPageLoad: function () {
    this.setDataPromise()
      .then(place => this.assignDistance(place))
      .then(place => this.createPlaces(place))
      .then(place => this.setPlace(place))
  },

  setDataPromise: function () {
    let that = this
    return new Promise(function (resolve, reject) {
      myRequest.get({
        path: `cities/${app.globalData.bookmarkTarget}/places/${app.globalData.showTarget}`,
        success(res) {

          console.log("res", res);
          resolve({ place: res.data })
        }
      })
    })
  },

  assignDistance: function (place) {
    let that = this
    return new Promise(function (resolve, reject) {

      let distance = []
      console.log(1212, place);
        console.log(app.globalData.userLocation);
        distance.push([that.getDistanceFromLatLonInKm(place.place.latitude, place.place.longitude, app.globalData.userLocation.latitude, app.globalData.userLocation.longitude)])
        resolve({ ...place, distance })
    })
  },

  createPlaces: function (place) {
    return new Promise(function (resolve, reject) {
      let newPlace = []
      console.log(24324, place)
        newPlace.push({ ...place, distance: place.distance})
        console.log(111, newPlace)
        resolve(newPlace)
      })
    },

  setPlace: function (places) {
    this.setData({
      place: places
    })
    console.log("DATA", this.data.place)
  },














  ChangeToIndex: function (e) {
    wx.reLaunch({
      url: '/pages/index/index'
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

  goToMap: function(e) {
    console.log(e)
    wx.authorize({
      scope: 'scope.userLocation',
      success(res) {
      wx.openLocation({
        latitude: e.currentTarget.dataset.latitude,
        longitude: e.currentTarget.dataset.longitude,
        scale: 13,
        showLocation: true
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

  toBookmark: function (e) {
    app.globalData.bookmarkTarget = parseInt(e.currentTarget.id)
    wx.reLaunch({
      url: '../bookmarks/bookmarks',
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
            let photo_url = that.data.place[0].place.photo_urls
            setTimeout(function () {
              that.data.smallImageUrl.forEach((image) => {
                photo_url.push(image)
              })
              console.log(22222, photo_url)
              console.log(that.data.place.photo_urls)
              myRequest.put({
                path: `cities/${app.globalData.currentTarget}/places/${that.data.place[0].place.id}`,
                data: {
                  place: { photo_urls: photo_url }
                }
              })
              that.setData({
                photo_urls: photo_url
              })
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

  previewImage: function (e) {
    let page = this
    console.log(3333, e)
    setTimeout(function () {
      wx.previewImage({
        current: page.data.place.photo_urls[e.currentTarget.dataset.imageIndex],
        urls: page.data.place.photo_urls
      });

    }, 50)
  },   
  goToLocal: function (e) {
    console.log(789, e)
    app.globalData.selectLocal = e.currentTarget.dataset.localId
    app.globalData.cityLocal = e.currentTarget.dataset.cityId
    wx.reLaunch({
      url: `/pages/profile/profile`
    })
  }
})
         
