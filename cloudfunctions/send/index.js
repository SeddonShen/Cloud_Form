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
            value: event.name1
          },
          number11: {
            // value: event.name
            value: event.number
          },
          thing2: {
            // value: event.time
            value: '疫情防控志愿者'
          },
          date4: {
            value: event.time
          },
          thing19:{
            value:'请及时查看QQ群消息加入群聊'
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