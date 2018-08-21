// pages/show/show.js
const app = getApp()
const myRequest = require('../../lib/request');
const AV = require('../../utils/av-weapp-min.js')



Page({
  data: {
    showLocation: true, 
    margin: "width: 0",
    bookmarked: {},
    bookmark_id: {},
    bookmarks: [],
    distance: [],
    bookmarked_city_array: []
  },


  onLoad: function () {
    let page = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        let userLocation = {
          latitude: res.latitude,
          longitude: res.longitude,
        }
        page.setData({ 
          userLocation,
          user_id: app.globalData.userId
        });
        console.log(page.data)
        let distance = page.data.distance
        setTimeout(function () {
          page.data.items.forEach((item) => {
            distance.push([page.getDistanceFromLatLonInKm(item.latitude, item.longitude, page.data.userLocation.latitude, page.data.userLocation.longitude)])
            page.setData({
              distance
            })
          });
          console.log(page.data.items)
          let places = []
          page.data.items.forEach((place, index) => {
            places.push(Object.assign({}, place, distance[index]))
            page.setData({ places })
            page.data
          })
          const propComparator = (propName) =>
            (a, b) => a[propName] == b[propName] ? 0 : a[propName] < b[propName] ? -1 : 1
          page.setData({
            places: page.data.places.sort(propComparator('0'))
          })}, 600)

      }
    })
    myRequest.get({
      path: `cities/${app.globalData.currentTarget}/places`,
      success(res) {
          page.setData({ 
          items: res.data.places,
        }) 
      } 
    }), 
      myRequest.get({
      path: `users/${app.globalData.userId}`,
      success(res) {
          page.setData({
            currentUser: res.data
          })
        }
      }),
    myRequest.get({
      path:`users/${app.globalData.userId}/bookmarks`,
      success(res) {
        let bookmarked = page.data.bookmarked
        let bookmark_id = page.data.bookmark_id
        res.data.bookmarks.forEach ((bookmark) => {
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
        let bookmarks = page.data.bookmarks
        bookmarks.splice(bookmarks.indexOf(e.currentTarget.id), 1)
        delete bookmark_id[e.currentTarget.id]
        delete bookmarked[e.currentTarget.id]
        page.setData({
          bookmarked, 
          bookmark_id ,
          bookmarks     
        })
        page.addBookmarksToGlobalData()
        page.removeDups()
      }
    })
   } else {
    myRequest.post({
      path: `users/${app.globalData.userId}/bookmarks`,
      data: {
        user_id: app.globalData.userId,
        place_id: e.currentTarget.id
      }, 
        success(res) {
        let bookmarked = page.data.bookmarked
        let bookmark_id = page.data.bookmark_id
        let bookmarks = page.data.bookmarks
        bookmarks.splice(e.currentTarget.id, 0, res.data)
        bookmarked[e.currentTarget.id] = true
        bookmark_id[e.currentTarget.id] = res.data.id
        page.setData({
          bookmarked,
          bookmark_id,
          bookmarks,
        })
        page.addBookmarksToGlobalData()
        page.removeDups()
      }
    })
}
}, 
  ChangeToIndex: function (e) {
      wx.navigateTo({
        url: '/pages/index/index'
      })
  }, 
  ChangeToUpload: function(e) {
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

  addBookmarksToGlobalData: function () {
    let page = this
    app.globalData.bookmarks = page.data.bookmarks
    app.globalData.bookmarked = page.data.bookmarked
    app.globalData.bookmark_id = page.data.bookmark_id
    console.log("GLOBAL DATA", app.globalData)
  }, 

  removeDups: function () {
    let page = this
    setTimeout(function () {
      let bookmarked_city_array = page.data.bookmarked_city_array
      if (page.data.bookmarks.length > 0)  {
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
    
  previewImage: function (e) {
    let page = this
    console.log(3333,e)
    setTimeout(function () {
      wx.previewImage({
        current: page.data.places[e.currentTarget.dataset.placeIndex].photo_urls[e.currentTarget.dataset.imageIndex],
        urls: page.data.places[e.currentTarget.dataset.placeIndex].photo_urls
      });

    }, 50)
  },   
  toBookmark: function (e) {
    console.log(e)
    app.globalData.bookmarkTarget = parseInt(e.currentTarget.id)
    wx.navigateTo({
      url: '../bookmarks/bookmarks',
    })
  }, 

  backToHome: function (e) {
    wx.redirectTo({
      url: '../index/index',
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
              let photo_url = that.data.places[e.currentTarget.dataset.imageId].photo_urls
              console.log("Hello I am here", e.currentTarget)
              setTimeout(function () {
                that.data.smallImageUrl.forEach((image) => {
                  photo_url.push(image)
                })
                console.log(22222, photo_url)
                myRequest.put({
                  path: `cities/${app.globalData.currentTarget}/places/${e.currentTarget.dataset.placeId}`,
                  data: {
                    place: { photo_urls: photo_url }
                  } 
                })
                setTimeout(function () {
                    that.setData ({
                      photo_urls: photo_url
                })
                }, 3000)
                console.log(123, that.data.places[e.currentTarget.dataset.imageId].photo_urls)
                
              }, 30)
            })
        }
      })
  }, 
})

