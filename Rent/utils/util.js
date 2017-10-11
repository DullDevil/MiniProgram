function floatMul (arg1, arg2) {
	if (!arg1) {
		arg1 = 0;
	}
	if (!arg2) {
		arg2 = 0;
	}
  var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
  try { m += s1.split(".")[1].length } catch (e) { }
  try { m += s2.split(".")[1].length } catch (e) { }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

function currentMonth () {
  var date = new Date;
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" + month : month);
  var mydate = (year.toString() + month.toString());
  return mydate;
}


// 增加记录
function addRecord(fileData) {
  if (!fileData) {
    return;
  }
  var recordList = wx.getStorageSync('recordList');
  if (!recordList) {
      recordList = new Array();
  }
  recordList.unshift(fileData);
  var saveResult = "";
  wx.setStorage({
    key: 'recordList',
    data: recordList,
    success: function (res) {
      saveResult = "保存成功";
    },
    fail: function (res) {
      saveResult = "保存失败";
    },
    complete: function (res) {
      wx.showToast({
        title: saveResult,
        image: '../../image/success.png'
      })
    }
  })
}

// 读取历史记录
function quearyRecord() {
  var recordList = wx.getStorageSync('recordList');
  return recordList;
}

function clearRecord () {
  wx.setStorageSync('recordList', [])
}

function resetRecord (data){
  wx.setStorageSync('recordList', data)
}
module.exports.quearyRecord = quearyRecord
module.exports.addRecord = addRecord
module.exports.clearRecord = clearRecord
module.exports.resetRecord = resetRecord
module.exports.floatMul = floatMul
module.exports.currentMonth = currentMonth