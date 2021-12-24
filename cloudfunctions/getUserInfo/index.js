// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

/**
 * 获取用户信息 若已注册返回flag+data 反之返回flag:false
 * 
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID
    const db = cloud.database();
    let userTable = db.collection('user')
    return userTable.doc(openid).get().then(function(res){
        return {
            flag: true,
            data: res.data
        }
    }).catch(e=>{
        return {
            flag: false
        }
    })
}