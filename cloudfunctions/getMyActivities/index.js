// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let openid = wxContext.OPENID
  db.collection('onDuty')
  .where({
    openid: "ojYwy4zvZYQKtmDjDATXYykMMzIA"
  })
  .get()
  .then(res=>{
    return res
  })
}