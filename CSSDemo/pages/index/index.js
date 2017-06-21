//index.js
//获取应用实例
var imageUtil = require("../../utils/util.js")
Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    iconUrl : [ 
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    bannerHeight : 200,
    marginLeft : 10
  },
 bannerClick : function (e) {
   console.log(e);
 },
 imageLoad : function(e) {
    var imageSize = imageUtil.imageUtil(e)  
    console.log(imageSize.height);
    this.setData({
      bannerHeight : imageSize.imageHeight
    })
 },

  onLoad : function () {
    console.log("on load");
    var res = wx.getSystemInfoSync()
    var itemWidth = (res.screenWidth -  4 * 44)/ 5;
    this.setData({
      marginLeft : itemWidth
    })
    console.log(res.screenWidth);
  }
})