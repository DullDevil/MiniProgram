//index.js
//获取应用实例
Page({
  data: {
    result : "计算结果"
  },
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
 FloatMul: function (arg1,arg2)   {   
      var m=0,s1=arg1.toString(),s2=arg2.toString();   
      try{m+=s1.split(".")[1].length}catch(e){}   
      try{m+=s2.split(".")[1].length}catch(e){}   
      return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);   
  },
 cal : function() {
   var price = wx.getStorageSync("price");
    var warterPrice = price.warterPrice;
    var electricPrice = price.electricPrice;
    var rentPrice = price.rentPrice;

    var record = wx.getStorageSync('record');
    
    var warterRecord = record.warterRecord;
    if (!warterRecord) {
      warterRecord = 0;
    }
    var electricRecord = record.electricRecord
    if (!electricRecord) {
      electricRecord = 0;
    }
    if (!this.data.warterNum) {
      wx.showToast({
        title: '水表数不能为空'
      })
      return;
    }
    if (!this.data.electricNum) {
      wx.showToast({
        title: '电表数不能为空',
        icon: 'success',
        duration: 2000
      })
      return;
    }
    if (!this.data.rentNum) {
      wx.showToast({
        title: '房租月数不能为空'
      })
      return;
    }
    var warterNum = parseFloat(this.data.warterNum) - parseFloat(warterRecord);
    var electricNum = parseFloat(this.data.electricNum) - parseFloat(electricRecord);
    if (warterNum < 0) {
       wx.showToast({
        title: '当前用水量小于历史数据'
      })
      return;
    }

    if (electricNum < 0) {
       wx.showToast({
         title: '当前电量小于历史数据'
      })
      return;
    }
    if (!warterPrice) {
      wx.showToast({
        title: '未设置水价'
      })
      return;
    }
    if (!electricPrice) {
      wx.showToast({
        title: '未设置电价'
      })
      return;
    }
    if (!rentPrice) {
      wx.showToast({
        title: '未设置房租'
      })
      return;
    }
    var warterFee = this.FloatMul(warterNum,warterPrice);
    var electricFee = this.FloatMul(electricNum,electricPrice);
    var rentFee = this.FloatMul(rentPrice ,this.data.rentNum);

    var total = warterFee + electricFee + rentFee;

    var calResult = "水表读数："+ this.data.warterNum + "，用了" + warterNum + "吨，费用" + warterFee + "元； \n"  +
                    "电表读数："+ this.data.electricNum + "， 用了" + electricNum + "度，费用" + electricFee + "元； \n" +
                    "房租" + this.data.rentNum + "个月" +  rentFee + "元； \n" +
                    "共计 " + total + "元";
    var date= this.currentMonth();
    console.log(date);             
     this.setData({
        fileData : {"warterRecord":this.data.warterNum,"electricRecord":this.data.electricNum,"warterFee":warterFee,"electricFee":electricFee,"date":date}
     })            
    this.setData({
      result : calResult
    })
 },
 currentMonth : function () {
    var date=new Date;
    var year=date.getFullYear(); 
    var month=date.getMonth()+1;
    month =(month<10 ? "0"+month : month); 
    var mydate = (year.toString()+month.toString());
    return mydate;
 },
 setClipboard : function(e) {
   var that = this;
    wx.setClipboardData({
      data: this.data.result,
      success: function(res){
       wx.showToast({
        title: '复制成功'
      })
      }
    })
 },
 saveRecord : function () {
    var that = this;
    if (!that.data.fileData) {
      return;      
    }
    var recordList = wx.getStorageSync('recordList');
    if (!recordList) {
      recordList = new Array();
    }
    recordList.push(that.data.fileData);
    var saveResult = "";
    
    wx.setStorage({
      key: 'recordList',
      data: recordList,
      success: function(res){
        saveResult = "保存成功";
      },
      fail: function(res) {
        saveResult = "保存失败";
      },
      complete: function(res) {
        wx.showToast({
          title: saveResult,
          icon: 'success',
          duration: 2000
        })
      }
    })
 },
 setting : function () {
  wx.navigateTo({url: "../logs/logs"})
 },
 showRecold : function() {
   wx.navigateTo({url: "../record/record"})
},
  onLoad:function(options){
    this.initData();
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
        rentNum : "2"
      })

  },
    onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: '测试小程序', // 分享标题
      desc: '测试小程序', // 分享描述
      path: '' // 分享路径
    }
  }
})
