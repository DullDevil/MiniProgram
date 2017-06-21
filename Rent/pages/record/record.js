Page({
    data:{
        recordList : []
    },
    onLoad:function(options){
        var recordList = wx.getStorageSync('recordList');
        this.setData({
            recordList : recordList
        })
        console.log(this.data.recordList);
    },
    clearRecord : function () {
        wx.setStorageSync('recordList', [])
        this.setData({
            recordList : []
        })
    },
    itemLongTap : function (e) {
        console.log(e.currentTarget.id);
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
        wx.setStorageSync('recordList', recordList)
    }
})

