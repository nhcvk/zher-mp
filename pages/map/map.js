// pages/map/map.js
const app = getApp()

Page({
  
  data: {

  },

  onLoad: function(e) {
    this.setData({
      latitude: app.globalData.placeLatitude,
      longitude: app.globalData.placeLongitude
      })

  }
  
})