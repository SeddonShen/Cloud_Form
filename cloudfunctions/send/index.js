const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  try {

    const result = await cloud.openapi.subscribeMessage.send({
        touser: event.touser,
        page: event.page,
        lang: 'zh_CN',
        data: {
          thing14: {
            value: event.name1
          },
          // number11: {
          //   // value: event.name
          //   value: event.number
          // },
          thing1: {
            // value: event.time
            value: event.activeName?event.activeName:'无'
          },
          date5: {
            value: event.time
          },
          // dl
          thing3: {
            value: event.place?event.place:'无'
          },
          thing6:{
            value:event.notice
          }
        },
        // templateId: '_Vs_yfS8lXCqxQgmtggpFbYTVJtMO2m1bxIyFqBoaro',
        templateId: 'l3D7T-LTfRoxXvjjBZ3afLvc6GnhcVwecG_9fZ5oZyE',
        miniprogramState: 'formal'
      })

    return result
  } catch (err) {
    return err
  }
}