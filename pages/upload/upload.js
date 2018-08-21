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
    myCurrent: 1
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
    // }
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
  mySwiperChange: function(e) {
    console.log(33333333,"My Swiper Change")
  },

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

  bookmark: function (e) {
    let page = this
    console.log(e.currentTarget)
    if (page.data.bookmarked[e.currentTarget.id] == true) {
      myRequest.delete({
        path: `users/${app.globalData.userId}/bookmarks/${page.data.bookmark_id[e.currentTarget.id]}`,
        success(res) {
          console.log(res)
          let bookmarked = page.data.bookmarked
          let bookmark_id = page.data.bookmark_id
          // let city_name_array = page.data.city_name_array
          delete bookmark_id[e.currentTarget.id]
          delete bookmarked[e.currentTarget.id]

          page.setData({
            bookmarked,
            bookmark_id
          })
        }
      })
    } else {
      myRequest.post({
        path: `users/${app.globalData.userId}/bookmarks`,
        data: {
          user_id: app.globalData.userId,
          place_id: e.currentTarget.id
        }, success(res) {
          console.log(res)
          let bookmarked = page.data.bookmarked
          let bookmark_id = page.data.bookmark_id
          bookmarked[e.currentTarget.id] = true
          bookmark_id[e.currentTarget.id] = res.data.id
          page.setData({
            bookmarked,
            bookmark_id
          })
        }
      })
    }
  },
  ChangeToIndex: function (e) {
    wx.navigateTo({
      url: '/pages/index/index'
    }),
      this.setData({
        changeIcon: "/assets/icons/change-hover.png"
      })
  }, 

})