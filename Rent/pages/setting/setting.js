//logs.js

var util = require('../../utils/util.js');
Page({
 data : {},
 //  app 事件
 onLoad: function (options) {
   this.initData();
 },
 // 监听输入框内容
 priceChange : function(e) {
   if (e.currentTarget.id == "warter") {
     var newWarter = this.data.warter;
     newWarter.storageVaule = e.detail.value;
     this.setData ({
       warter : newWarter
     })
   } else if (e.currentTarget.id == "electric") {
     var newElectric = this.data.electric;
     newElectric.storageVaule = e.detail.value;
      this.setData ({
       electric : newElectric
     })
   } else if (e.currentTarget.id == "rent") {
     var newRent = this.data.rent;
     newRent.storageVaule =e.detail.value;
      this.setData ({
       rent : newRent
     })
   } else if (e.currentTarget.id == "warterRecord") {
     var newWarterRecord = this.data.warterRecord;
     newWarterRecord.storageVaule =e.detail.value;
      this.setData ({
         warterRecord : newWarterRecord
      })
   } else if (e.currentTarget.id == "electricRecord") {
     var newElectricRecord = this.data.electricRecord;
     newElectricRecord.storageVaule =e.detail.value;
      this.setData ({
         electricRecord : newElectricRecord
      })
   }
  },
  // 保存设置
  save:function() {
    var warterPrice = this.data.warter.storageVaule;
    if (!warterPrice) {
      wx.showToast({
        title: '请设置水价',
        image: '../../image/error.png'
      })
      return;
    }

    var electricPrice = this.data.electric.storageVaule;
    if (!electricPrice) {
      wx.showToast({
        title: '请设置电价',
        image: '../../image/error.png'
      })
      return;
    }

    var rentPrice = this.data.rent.storageVaule;
    if (!rentPrice) {
      wx.showToast({
        title: '请设置房租',
        image : '../../image/error.png'
      })
      return;
    }
    var price = { 
      "warterPrice": warterPrice,
      "electricPrice": electricPrice,
      "rentPrice": rentPrice
      }
    var record = {
      "warterRecord":this.data.warterRecord.storageVaule,
      "electricRecord":this.data.electricRecord.storageVaule
      };
   
    wx.setStorageSync('price',price);
    wx.setStorageSync('record',record );
    wx.showToast({
      title: '保存成功',
      image: '../../image/success.png'
    })
  },

  //加载历史数据
  loadRecord : function() {
    var newWarterRecord = this.data.warterRecord;
    var newElectricRecord = this.data.electricRecord;
    var recordList = util.quearyRecord();
    
    if (recordList && recordList.length > 0) {  
      var lastRecord = recordList[0];
      newWarterRecord.storageVaule = lastRecord.warterRecord;
      newElectricRecord.storageVaule = lastRecord.electricRecord;
      this.setData({
        warterRecord : newWarterRecord,
        electricRecord : newElectricRecord,
      })
      var record = {
        "warterRecord": this.data.warterRecord.storageVaule,
        "electricRecord": this.data.electricRecord.storageVaule
      };
      wx.setStorageSync('record', record);
      wx.showToast({
        title: '读取成功',
        image : '../../image/success.png'
      })
    } else {
      wx.showToast({
        title: '无历史数据',
        image: '../../image/error.png'
      })
    }
  },


  //初始化数据
  initData:function(){
      var that = this;
      var price = wx.getStorageSync("price")
      var record = wx.getStorageSync('record');
      that.setData({
        warter: {
          name :"水价",
          unit:"元/吨",
          inputId:"warter",
          storageVaule : price.warterPrice
        },
        electric: {
          name :"电价",
          unit:"元/度",
          inputId:"electric",
          storageVaule : price.electricPrice
        },
         rent: {
          name :"房租",
          unit:"元/月",
          inputId:"rent",
          storageVaule : price.rentPrice
        },
        warterRecord :{
          name :"上次水表读数",
          unit:"吨",
          inputId:"warterRecord",
          storageVaule : record.warterRecord
        },
        electricRecord : {
          name :"上次电表读数",
          unit:"度",
          inputId:"electricRecord",
          storageVaule : record.electricRecord
        }

      })
  }
})

