// pages/show/show.js
const app = getApp()
const myRequest = require('../../lib/request');
Page({
  data: {
    showLocation: true, 
    items: [], 
    margin: "width: 0",
    bookmarked: {},
    bookmark_id: {},
    bookmarks: [],
    city_name_array: [],
    changeIcon: "/assets/icons/change.png",
    distance: [],
  },

  onLoad: function() {
      this.setData({user_id: app.globalData.userId})
  },

  


  onLoad: function () {
    let page = this
    //GET THE USER LOCATION
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        let userLocation = {
          latitude: res.latitude,
          longitude: res.longitude,
        }
        page.setData({ 
          userLocation,
        });
        let distance = page.data.distance
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
          }) 
          // console.log(page.data) CHANGING HERE H H H H
          const propComparator = (propName) =>
            (a, b) => a[propName] == b[propName] ? 0 : a[propName] < b[propName]? -1 : 1
           page.setData ({
             places: page.data.places.sort(propComparator('0'))
           })
      }
    })
    myRequest.get({
      path: 'cities/1/places',
      success(res) {
          page.setData({ 
          items: res.data.places,
        }) 
      } 
    }), 
    myRequest.get({
      path:`users/${app.globalData.userId}/bookmarks`,
      success(res) {
        let bookmarked = page.data.bookmarked
        let bookmark_id = page.data.bookmark_id
        let city_name_array = page.data.city_name_array
        res.data.bookmarks.forEach ((bookmark) => {
          bookmark_id[bookmark.place_id] = bookmark.id
          bookmarked[bookmark.place_id] = true
          const temp_array = [bookmark.city.name]
          city_name_array = [...(new Set(temp_array))]
        })
        page.setData({
          bookmarked,
          bookmark_id,
          city_name_array
        }), 
        page.setData({
          bookmarks: res.data.bookmarks
        })
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
  }
})