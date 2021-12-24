const cloud = require('wx-server-sdk')
//这里最好也初始化一下你的云开发环境
cloud.init({
  env: "cloud1-0gex1p2d827cce36"
})
//操作excel用的类库
const xlsx = require('node-xlsx');

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let data = await cloud.database().collection('onDuty').doc(event._id).get();
    let userdata = data.data

    //1,定义excel表格名
    let dataCVS = 'test.xlsx'
    //2，定义存储数据的
    let alldata = [];
    // let row = ['岗位', '姓名']; //表属性
    let row = ['序号','姓名','手机号','学号','后台提交时间(UTC)']; //表属性
    alldata.push(row);
    let arr0 = [];
    // arr0.push('岗位1');
    let member0 = userdata.information_desk.member
    for (let i in member0) {
      var stu_no = parseInt(i) + parseInt(1)
      alldata.push([stu_no,member0[i].nickname,member0[i].phone,member0[i].stuid,member0[i].submit_time])

      // arr0.push(member0[i])
      // if (i == member0.length - 1) {
      //   alldata.push(arr0)
      // }
    }
    if (member0.length == 0) alldata.push(arr0)
    console.log(alldata)


    //3，把数据保存到excel里
    let buffer = await xlsx.build([{
      name: "Sheet1",
      data: alldata
    }]);
    //4，把excel文件保存到云存储里
    return await cloud.uploadFile({
      cloudPath: dataCVS,
      fileContent: buffer, //excel二进制文件
    })


  } catch (e) {
    console.error(e)
    return e
  }
}

