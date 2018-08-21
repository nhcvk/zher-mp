// pages/upload/upload.js
const app = getApp()
const myRequest = require('../../lib/request');
const AV = require('../../utils/av-weapp-min.js');

Page({

  data: {
    showLocation: true,
    margin: "width: 0",
    bookmark: "../../assets/icons/bookmark.png",
    smallImageUrl: [],
    bookmarked: {},
    bookmark_id: {},
    bookmarks: [],
    city_name_array: [],
    imageUrl: [],
    changeIcon: "/assets/icons/change.png",
    myCurrent: 1,
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
          })
        }, 600)

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
            bookmarks: res.data.bookmarks
          })
          page.addBookmarksToGlobalData()
          page.removeDups()
        }
      })
  },

  uploadPhoto: function () {
    var that = this
    console.log("that >> ")
    console.log(that)
    console.log(that.data.is_take_photo)
    // if (!that.data.is_take_photo) {
    //   // Mark as already take picture
    //   that.data.is_take_photo = true

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera', 'album'],
      success: function (res) {
        var tempFilePath = res.tempFilePaths[0]

        console.log("Temp file path >>")
        console.log(tempFilePath)
        that.setData({
          is_sending: true,
          imageSrc: tempFilePath
        })
        console.log("Have Image >>")
        console.log(that.data.haveImage)
        // console.log(that.data.imgSrc)

        // #####LEANCLOUD PART --- SEND IMG
        console.log("Processing send img to LeanCloud >>")
        new AV.File('file-name', {
          blob: {
            uri: tempFilePath,
          },
        }).save().then(
          file => {
            console.log("Yeah..This is img url in LeanCloud >>")
            console.log(that)
            console.log(file.url())
            that.setData({
              is_sending: false,
              haveImage: true,
              imageUrl: file.url()
            })
          }
        ).catch(console.error);
        // ######LEANCLOUD PART --- SEND IMG
      }
    }) 
  },

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

  pinLocation: function (e) {
    let that = this

    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          value_location: res.name,
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
      fail: function (e) {
        console.log(e)
      },
      cencel: function (e) {
        console.log(e)
      }
    })
  }, 

  // mySwiperChange: function(e) {
  //   console.log(33333333,"My Swiper Change")
  // },

  uploadSmallPhoto: function () {
    var that = this
    let myImages = []
    console.log("that >> ")
    console.log(that)
    console.log(that.data.is_take_photo)
    // if (!that.data.is_take_photo) {
    //   // Mark as already take picture
    //   that.data.is_take_photo = true

    wx.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['camera', 'album'],
      success: function (res) {
        
        let tempFilePaths = res.tempFilePaths;
        console.log(55, res.tempFilePaths)

        let tempFilePathsLength = tempFilePaths.length;
        console.log(66, tempFilePathsLength)

        // let tempFilePathsFirst = tempFilePaths[0] 
        // let tempFilePathsSecond = tempFilePaths[1] 
        // let tempFilePathsThird = tempFilePaths[2] 

        // app.globalData.pictures = tempFilePaths
        // console.log(3443434, app.globalData.pictures)
        console.log(3443434, that.data.smallImageUrl)

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
            that.setData({
              smallImageUrl : myImages})
            console.log(3333, that.data.smallImageUrl)
            that.setData({
            myCurrent: 0
          })
        })
      }
    })
  }, 
  
  bindFormSubmit: function (e) {
    let page = this
    console.log(4444444,this.data)
    console.log("hello", e)
    console.log("result", app.globalData)
    myRequest.post({
      path: `cities/${app.globalData.currentUser.city_id}/places`,
      // path: `cities/1/places`,
      data: { 
        place: {
          city_id: app.globalData.currentUser.city_id,
          user_id: app.globalData.userId, 
          main_photo_url: page.data.imageUrl, 
          name: e.detail.value.name,
          description: e.detail.value.description,
          photo_urls: page.data.smallImageUrl,
          // photo_urls: e.detail.value.photo_urls,
          longitude: page.data.longitude,
          latitude: page.data.latitude
        }
      },
      success(res) {
        console.log(res)
      }
    }),
    wx.redirectTo({
      url: '/pages/show/show'
    })
  },

  ChangeToIndex: function (e) {
    wx.navigateTo({
      url: '/pages/index/index'
    })
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

  addBookmarksToGlobalData: function () {
    let page = this
    app.globalData.bookmarks = page.data.bookmarks
    app.globalData.bookmarked = page.data.bookmarked
    app.globalData.bookmark_id = page.data.bookmark_id
    console.log("GLOBAL DATA", app.globalData)
  },

  bookmark: function (e) {
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
            bookmark_id,
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

})