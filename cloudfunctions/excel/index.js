const cloud = require('wx-server-sdk')
//这里最好也初始化一下你的云开发环境
cloud.init({
  // env: "cloud1-0gex1p2d827cce36"
  env: "cloud1-4gwn1922b02a77df"
})
//操作excel用的类库
const xlsx = require('node-xlsx');

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let data = await cloud.database().collection('onDuty').doc(event._id).get();
    let userdata = data.data

    //1,定义excel表格名
    let dataCVS = new Date().getTime() + '.xlsx'
    //2，定义存储数据的
    let alldata = [];
    // let row = ['岗位', '姓名']; //表属性
    let row = ['序号', '姓名', '手机号', '学号', '学院', '宿舍楼', '身份证号', '后台提交时间']; //表属性
    alldata.push(row);
    let arr0 = [];
    // arr0.push('岗位1');
    let member0 = userdata.information_desk.member
    for (let i in member0) {
      var stu_no = parseInt(i) + parseInt(1)
      let detailTime = formatDate(member0[i].submit_time);
      console.log(detailTime)
      alldata.push([stu_no, member0[i].nickname, member0[i].phone, member0[i].stuid, colleges[member0[i].college], dormitories[member0[i].dormitory], member0[i].sfid, detailTime])

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
const colleges = [
  '未选择学院',
  '航空学院',
  '航天学院',
  '航海学院',
  '材料学院',
  '机电学院',
  '力学与土木建筑学院',
  '动力与能源学院',
  '电子信息学院',
  '自动化学院',
  '计算机学院',
  '数学与统计学院',
  '物理科学与技术学院',
  '化学与化工学院',
  '管理学院',
  '公共政策与管理学院',
  '软件学院',
  '生命学院',
  '外国语学院',
  '教育实验学院',
  '国际教育学院',
  '国家保密学院',
  '马克思主义学院',
  '西北工业大学伦敦玛丽女王大学工程学院',
  '微电子学院',
  '网络空间安全学院',
  '民航学院',
  '生态环境学院',
  '体育部',
  '无人系统技术研究院',
  '文化遗产研究院',
  '柔性电子研究院',
  '医学研究院',
  '光电与智能研究院',
  '其他'
]

const dormitories = [
  '未选择宿舍',
  '南区1号楼',
  '南区2号楼',
  '南区3号楼',
  '南区4号楼',
  '南区5号楼',
  '南区6号楼',
  '南区7号楼',
  '南区8号楼',
  '南区9号楼',
  '南区10号楼',
  '南区11号楼',
  '南区12号楼',
  '南区13号楼',
  '南区14号楼',
  '南区15号楼',
  '南区16号楼',
  '南区17号楼',
  '南区18号楼',
  '南区19号楼',
  '南区20号楼',
  '南区21号楼',
  '南区22号楼',
  '南区23号楼',
  '南区24号楼',
  '南区25号楼',
  '南区26号楼',
  '南区27号楼',
  '南区28号楼',
  '南区29号楼',
  '南区30号楼',
  '南区31号楼',
  '南区32号楼',
  '南区33号楼',
  '南区34号楼',
  '南区35号楼',
  '南区36号楼',
  '南区37号楼',
  '紫荆1号楼',
  '紫荆2号楼',
  '紫荆3号楼',
  '紫荆4号楼',
  '紫荆5号楼',
  '紫荆6号楼',
  '紫荆7号楼',
  '紫荆8号楼',
  '紫荆9号楼',
  '紫荆10号楼',
  '紫荆11号楼',
  '紫荆12号楼',
  '紫荆13号楼',
  '紫荆14号楼',
  '紫荆15号楼',
  '紫荆16号楼',
  '紫荆17号楼',
  '紫荆18号楼',
  '紫荆19号楼',
  '紫荆20号楼',
  '紫荆21号楼',
  '紫荆22号楼',
  '紫荆23号楼',
  '双清公寓北楼',
  '双清公寓南楼',
  '其它'
]

function formatDate(temp) {
  let time = new Date(temp)
  let year = time.getFullYear()
  let month = time.getMonth() + 1
  let date = time.getDate()
  let hour = time.getHours()
  let minute = time.getMinutes()
  let second = time.getSeconds()
  let milliSecond = time.getMilliseconds()
  return year + "/" + (month < 10 ? '0' + month : month) + "/" + (date < 10 ? '0' + date : date) + " " + hour + ":" + minute + ":" + second + ":" + milliSecond
}