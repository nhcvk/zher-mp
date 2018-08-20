//app.js
const AV = require('./utils/av-weapp-min.js')
const config = require('./key')
// Initialization of the app
AV.init({
  appId: config.leanCloudID,
  appKey: config.leanCloudSecret,
});

App({
  globalData: {
    
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
      }
    })  
  }
})