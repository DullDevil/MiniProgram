var util = require('../../utils/util.js');

Page({
    data:{
        recordList : []
    },
    onLoad:function(options){
        var recordList = util.quearyRecord();
        this.setData({
            recordList : recordList
        })
    },
    clearRecord : function () {
        util.clearRecord();
        this.setData({
            recordList : []
        })
    },
    itemLongTap : function (e) {
        var that = this;
        wx.showActionSheet({
            "itemList":["删除"],
            success: function(res) {
                if (res.tapIndex == 0) {
                    that.deleteItem(e.currentTarget.id);
                }
                
            }
        })
    },
    deleteItem : function(itemId) {
        var recordList = this.data.recordList;
        if (recordList.length > 0) {
            recordList.splice(itemId,1);
        }
        this.setData({
            recordList : recordList
        })
        util.resetRecord(recordList);
    }
})

