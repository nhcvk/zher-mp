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
    page.setData({
      bookmarked_city_array: app.globalData.bookmarked_city_array,
      bookmark_id: app.globalData.bookmark_id,
      currentUser: app.globalData.currentUser

    })
    page.showPageLoad()


  },


  showPageLoad: function () {
    this.setDataPromise()
      .then(selectedCity => this.assignDistance(selectedCity))
      .then(selectedCity => this.createPlaces(selectedCity))
      .then(selectedCity => this.sortPlaces(selectedCity))
  },

  setDataPromise: function () {
    let that = this
    return new Promise(function (resolve, reject) {
      myRequest.get({
        path: `users/${app.globalData.currentUser.id}/bookmarks`,
        success(res) {
          let selectedCity = []
          res.data.bookmarks.forEach((result) => {
            console.log('app.globalData.bookmarkTarget', app.globalData.bookmarkTarget)
            console.log("result.place.city_id", result.place.city_id  )
            console.log("app.globalData.currentTarget", app.globalData.currentTarget)
            if (app.globalData.bookmarkTarget === result.place.city_id) {
              selectedCity.push(result)
              console.log("result", result)
            }
          })        
          resolve({ selectedCity })
        }
      })
    })
  },

  assignDistance: function (selectedCity) {
    let that = this
    return new Promise(function (resolve, reject) {
      let distance = []
      selectedCity.selectedCity.forEach((item) => {
        distance.push([that.getDistanceFromLatLonInKm(item.place.latitude, item.place.longitude, app.globalData.userLocation.latitude, app.globalData.userLocation.longitude)])
        resolve({ ...selectedCity, distance })
      })
    })
  },

  createPlaces: function (selectedCity) {
    return new Promise(function (resolve, reject) {
      let newPlaces = []
      console.log(selectedCity)
      selectedCity.selectedCity.forEach((city, index) => {
        console.log(selectedCity.distance[index])
        newPlaces.push({ ...city, distance: selectedCity.distance[index][0] })
        resolve(newPlaces)
      })
    })
  },

  sortPlaces: function (selectedCity) {
    const propComparator = (propName) =>
      (a, b) => a[propName] == b[propName] ? 0 : a[propName] < b[propName] ? -1 : 1
    this.setData({
      places: selectedCity.sort(propComparator('distance'))
    })
    console.log("DATA", this.data.places)
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

  ChangeToIndex: function (e) {
    wx.reLaunch({
      url: '../index/index',
    })
  },

  ChangeToUpload: function (e) {
    wx.navigateTo({
      url: '/pages/upload/upload'
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

  toShow: function(e) {
  app.globalData.showTarget = parseInt(e.currentTarget.id)
  wx.navigateTo({
    url: '../places/places',
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
          path: `users/${app.globalData.currentUser.id}`,
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

  toIndex: function(e) {
    console.log(23232232, e)
    app.globalData.currentTarget = e.currentTarget.dataset.set
    wx.reLaunch({
      url: '../show/show',
    })
  },

      // myRequest.get({
    //   path: `users/${app.globalData.userId}/bookmarks`,
    //   success(res) {
    //     let selectedCity = []
    //     res.data.bookmarks.forEach ((result) => {
    //         if (app.globalData.bookmarkTarget === result.place.city_id || app.globalData.currentTarget === result.place.city_id ) {
    //           selectedCity.push(result)
    //           console.log("result", result)
    //         } 
    //     }), 
    //     page.setData({
    //       items: selectedCity

    //     })
    //     console.log("GLOBAL", page.data)
    //   } 
    // }) 

    // setTimeout(function (){
    // page.setData({ user_id: app.globalData.userId })
    // let distance = page.data.distance
    // page.data.items.forEach((item) => {
    //   console.log(123123, item)
    //   distance.push([page.getDistanceFromLatLonInKm(item.place.latitude, item.place.longitude, app.globalData.userLocation.latitude, app.globalData.userLocation.longitude)])
    //   page.setData({
    //     distance,
    //   })
    // })
    // console.log(page.data.items)
    // let places = []
    // page.data.items.forEach((place, index) => {
    //   places.push(Object.assign({}, place, distance[index]))
    //   page.setData({ places })
    //   const propComparator = (propName) =>
    //     (a, b) => a[propName] == b[propName] ? 0 : a[propName] < b[propName] ? -1 : 1
    //   page.setData({
    //     places: page.data.places.sort(propComparator('0'))

    //   })
    // }) 
    // }, 800)
})