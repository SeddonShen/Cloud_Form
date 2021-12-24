const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  try {

    const result = await cloud.openapi.subscribeMessage.send({
        touser: event.touser,
        page: event.page,
        lang: 'zh_CN',
        data: {
          name1: {
            value: '测试姓名'
          },
          number11: {
            // value: event.name
            value: 2019300656
          },
          thing2: {
            // value: event.time
            value: '活动名称测试'
          },
          date4: {
            value: '2019年10⽉20⽇ 20:00'
          },
          thing19:{
            value:'备注测试信息'
          }
        },
        templateId: '_Vs_yfS8lXCqxQgmtggpFbYTVJtMO2m1bxIyFqBoaro',
        miniprogramState: 'formal'
      })

    return result
  } catch (err) {
    return err
  }
}