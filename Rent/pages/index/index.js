//index.js
//获取应用实例
var util = require('../../utils/util.js');
Page({
  data: {
    result : "计算结果"
  },
  onLoad: function (options) {
    this.initData();
  },
  //输入框内容改变
  numChange : function(e) {
    if (e.currentTarget.id == "warter") {
      this.setData ({
        warterNum : e.detail.value
      })
    } else if (e.currentTarget.id == "electric") {
      this.setData ({
        electricNum : e.detail.value
      })
    } else if (e.currentTarget.id == "rent") {
      this.setData ({
        rentNum : e.detail.value
      })
    }
  },
  // 计算
  cal : function() {
    // 获取价格
    var price = wx.getStorageSync("price");
    if (!price) {
      var that = this;
      wx.showModal({
        title: '提示',
        content: '请设置价格信息',
        success: function (res) {
          if (res.confirm) {
            that.setting();
          }
        }
      })
      return;
    }
    var warterPrice = price.warterPrice > 0 ? price.warterPrice : 0;
    var electricPrice = price.electricPrice > 0 ? price.electricPrice : 0;
    var rentPrice = price.rentPrice > 0 ? price.rentPrice : 0;
  
    // 读取历史记录
    var record = wx.getStorageSync('record');
    var warterRecord = record.warterRecord ? record.warterRecord : 0;
    var electricRecord = record.electricRecord ? record.electricRecord : 0;

    // 输入框数据处理
    var warterNum = this.data.warterNum ? this.data.warterNum  : 0;
    var electricNum = this.data.electricNum ? this.data.electricNum : 0;
    var rentNum = this.data.rentNum ? this.data.rentNum : 0;

    var useredWarterNum = warterNum - warterRecord;
    var useredElectricNum = electricNum - electricRecord;

    if (useredWarterNum < 0) {
      var that = this;
      wx.showModal({
        title: '数据异常',
        content: '当前用水量小于上次数据；前往设置上次数据',
        success: function (res) {
          if (res.confirm) {
            that.setting();
          }
        }
      })
      return;
    }

    if (useredElectricNum < 0) {
        var that = this;
        wx.showModal({
          title: '数据异常',
          content: '当前用电量小于上次数据；前往设置上次数据',
          success: function (res) {
            if (res.confirm) {
              that.setting();
            }
          }
        })
        return;
      return;
    }

    //计算
    var warterFee = util.floatMul(useredWarterNum,warterPrice);
    var electricFee = util.floatMul(useredElectricNum,electricPrice);
    var rentFee = util.floatMul(rentPrice ,rentNum);
    var total = warterFee + electricFee + rentFee;

    // 生成文案
    var calResult = "水表读数：" + warterNum + "，用了" + useredWarterNum + "吨，费用" + warterFee + "元； \n"  +
                    "电表读数：" + electricNum + "， 用了" + useredElectricNum + "度，费用" + electricFee + "元； \n" +
                    "房租" + rentNum + "个月" +  rentFee + "元； \n" +
                    "共计 " + total + "元";
    var hiddenTip = wx.getStorageSync('hiddenTip');
    if (!hiddenTip) {
      wx.showModal({
        title: '提示',
        content: '长按计算结果，可复制到粘贴板',
        cancelText : '不在提醒',
        confirmText : '确定',
        success : function (res) {
          if (res.cancel) {
            wx.setStorageSync('hiddenTip', true);
          }
        }
      })
    }

    // 保存数据
    var date = util.currentMonth();
    this.setData({
        fileData : {
                    "warterRecord":this.data.warterNum,
                    "electricRecord":this.data.electricNum,
                    "warterFee":warterFee,
                    "electricFee":electricFee,
                    "date":date
                    }
        })            
    this.setData({
      result : calResult
    })
  },

  //复制到粘贴板
  setClipboard : function(e) {
    var that = this;
    wx.setClipboardData({
      data: this.data.result,
      success: function(res){
        wx.showToast({
        title: '复制成功',
        image: '../../image/success.png'
      })
      }
    })
  },
  // 保存记录
  saveRecord : function () {
    if (!this.data.fileData) {
      var that = this;
      wx.showModal({
        title: '提示',
        content: '没有可归档数据，请计算之后再做数据归档',
        showCancel : false
      })
      return;      
    }
    util.addRecord(this.data.fileData);
  },

  //页面跳转
  setting : function () {
    wx.switchTab({url: "../logs/logs"})
  },
  showRecold : function() {
    wx.navigateTo({url: "../record/record"})
  },

  initData:function(){
      var that = this;
      that.setData({
        warter: {
          name :"水表",
          unit:"吨",
          inputId:"warter"
        },
        electric: {
          name :"电表",
          unit:"度",
          inputId:"electric"
        },
         rent: {
          name :"房租",
          unit:"月",
          inputId:"rent"
        },
        warterNum :"",
        electricNum :"",
        rentNum : ""
      })
  },

  onShareAppMessage: function() {
    return {
      title: '房租计算', 
      desc: '房租计算', 
    }
  }
})
