//app.js
const AV = require('./utils/av-weapp-min.js')
const config = require('./key')
// Initialization of the app
AV.init({
  appId: config.appId,
  appKey: config.appSecret,
});

App({
  globalData: {},

})  