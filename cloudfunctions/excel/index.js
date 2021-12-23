const cloud = require('wx-server-sdk')
//这里最好也初始化一下你的云开发环境
cloud.init({
  env: "museummuseum-exjwq"
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
    let row = ['岗位', '姓名']; //表属性
    alldata.push(row);

    let arr0 = [];
    arr0.push('岗位1');
    let member0 = userdata.information_desk.member
    for (let i in member0) {
      arr0.push(member0[i])
      if (i == member0.length - 1) {
        alldata.push(arr0)
      }
    }
    if (member0.length == 0) alldata.push(arr0)
    let arr1 = [];
    arr1.push('岗位2');
    let member1 = userdata.expostor_desk.member
    for (let i in member1) {
      arr1.push(member1[i])
      if (i == member1.length - 1) {
        alldata.push(arr1)
      }
    }
    if (member1.length == 0) alldata.push(arr1)
    let arr2 = [];
    arr2.push('岗位3');
    let member2 = userdata.expose_robot.member
    for (let i in member2) {
      arr2.push(member2[i])
      if (i == member2.length - 1) {
        alldata.push(arr2)
      }
    }
    if (member2.length == 0) alldata.push(arr2)
    let arr3 = [];
    arr3.push('岗位4');
    let member3 = userdata.teenager_learn.member
    for (let i in member3) {
      arr3.push(member3[i])
      if (i == member3.length - 1) {
        alldata.push(arr3)
      }
    }
    if (member3.length == 0) alldata.push(arr3)
    let arr4 = [];
    arr4.push('岗位5');
    let member4 = userdata.hall_desk.member
    for (let i in member4) {
      arr4.push(member4[i])
      if (i == member4.length - 1) {
        alldata.push(arr4)
      }
    }
    if (member4.length == 0) alldata.push(arr4)
    let arr5 = [];
    arr5.push('岗位6');
    let member5 = userdata.expostor.member
    for (let i in member5) {
      arr5.push(member5[i])
      if (i == member5.length - 1) {
        alldata.push(arr5)
      }
    }
    if (member5.length == 0) alldata.push(arr5)

    console.log(alldata)


    //3，把数据保存到excel里
    let buffer = await xlsx.build([{
      name: "mySheetName",
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

