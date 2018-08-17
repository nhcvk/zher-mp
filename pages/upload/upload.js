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
    changeIcon: "/assets/icons/change.png"
  },

  uploadPhoto: function () {
    var that = this
    console.log("that >> ")
    console.log(that)
    console.log(that.data.is_take_photo)
    if (!that.data.is_take_photo) {
      // Mark as already take picture
      that.data.is_take_photo = true

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
    }
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


  uploadSmallPhoto: function () {
    var that = this
    console.log("that >> ")
    console.log(that)
    console.log(that.data.is_take_photo)
    if (!that.data.is_take_photo) {
      // Mark as already take picture
      that.data.is_take_photo = true

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
              let image = file.url()
              that.setData({
                is_sending: false,
                haveImage: true,
                smallImageUrl: [image]
              })
            }
            ).catch(console.error);
          // ######LEANCLOUD PART --- SEND IMG
        }
      })
    }
  }, 
  
  bindFormSubmit: function (e) {
    let page = this
    console.log(4444444,this.data)
    console.log("hello", e)
    myRequest.post({
      path: 'cities/1/places',
      data: {
        place: {
          city_id: 1,
          user_id: 1, 
          main_photo_url: page.data.imageUrl, 
          name: e.detail.value.name,
          description: e.detail.value.description,
          photo_urls: e.detail.value.photo_urls,
          longitude: page.data.longitude,
          latitude: page.data.latitude
        }
      },
      success(res) {
        console.log(res)
      }
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