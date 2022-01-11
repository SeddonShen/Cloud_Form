// pages/info/info.js
var app = getApp();
Page({
    data: {
        name: '',
        college: 0,
        dormitory: 0,
        phone: '',
        stuid: '',
        sfid: '',
        flag: false,
        show: false,
        colleges: [
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
        ],
        dormitories: [
            '未选择宿舍',
            '海天苑1号楼A座',
            '海天苑1号楼B座',
            '海天苑1号楼C座',
            '海天苑2号楼A座',
            '海天苑2号楼B座',
            '海天苑2号楼C座',
            '海天苑2号楼D座',
            '海天苑2号楼E座',
            '海天苑2号楼F座',
            '海天苑2号楼G座',
            '海天苑3号楼A座',
            '海天苑3号楼B座',
            '星天苑A座',
            '星天苑B座',
            '星天苑C座',
            '星天苑D座',
            '星天苑E座',
            '星天苑F座',
            '星天苑G座',
            '星天苑H座A',
            '星天苑H座A女',
            '星天苑H座B',
            '星天苑H座C',
            '云天苑A座',
            '云天苑B座',
            '云天苑C座',
            '云天苑D座',
            '云天苑E座',
            '云天苑F座',
            '1号楼A座',
            '1号楼B座',
            '1号楼C座',
            '2号楼',
            '3号楼A座',
            '3号楼B座',
            '3号楼C座',
            '4号楼',
            '5号楼',
            '6号楼',
            '11舍',
            '12舍',
            '北村三号楼',
            '7号楼',
            '其他',
        ],
        food: 0,
        foods: ['普通餐','清真餐']
    },
    onLoad: function (options) {
        this.getUserInfo()
        this.getShowFlag()
    },

    getShowFlag() {
        let that = this
        let db = wx.cloud.database()
        let table = db.collection('show')
        table.get().then(res => {
            let show = res.data[0].show
            if (show) {
                that.setData({
                    show: true
                })
            } else {
                that.setData({
                    college: 1,
                    phone: '15945678900',
                    stuid: '2019300000',
                    sfid: '430421200011100091',
                    dormitory: 1,
                    food: 0
                })
            }
        })
    },

    toIndex() {
        wx.navigateTo({
            url: '/pages/onDutyindex/onDutyindex',
        })
    },

    /**
     * 更新用户信息 更新后会保存到storage
     */
    updateUserInfo() {
        if (!this.check()) {
            return
        } else {
            let that = this
            wx.showLoading({
                title: '更新中',
            })
            wx.cloud.callFunction({
                name: 'updateUserInfo',
                data: {
                    name: this.data.name,
                    college: this.data.college,
                    dormitory: this.data.dormitory,
                    food: this.data.food,
                    phone: this.data.phone,
                    stuid: this.data.stuid,
                    sfid: this.data.sfid
                },
            }).then(function (res) {
                wx.showToast({
                    title: '信息上传成功',
                    icon: 'none'
                })
                that.setData({
                    flag: true
                })
                // that.storeUserInfo(res.result.result)
                wx.redirectTo({
                    url: '/pages/onDutyindex/onDutyindex',
                    success: (res) => {
                        console.log('跳转成功')
                    },
                    fail: (res) => {
                        console.log('跳转成功1')
                    },
                    complete: (res) => {
                        console.log('跳转成功2')
                    },
                })
            }).catch(e => {
                console.log(e)
                wx.showToast({
                    title: '信息上传错误',
                    icon: 'none'
                })
            })
        }
    },

    storeUserInfo(userInfo) {
        console.log('更新缓存')
        wx.setStorageSync('user', userInfo)
    },
    getUserInfoFromStorage() {
        return wx.getStorageSync('user')
    },
    /**
     * 获取用户信息，若缓存有 则不执行
     * 获取后，会用保存新数据
     */
    getUserInfo() {
        let that = this
        wx.cloud.callFunction({
                name: 'getUserInfo',
            }).then(function (res) {
                let result = res.result
                if (result.flag) {
                    if (result.data.food == undefined) {
                        wx.showToast({
                            title: '请完善用餐信息',
                            icon: 'none'
                        })
                    }
                    console.log(result)
                    result.data['openid'] = result.data['_id']
                    // that.storeUserInfo(result.data)
                    app.globalData = result.data
                    that.setData({
                        name: result.data.name,
                        college: result.data.college,
                        dormitory: result.data.dormitory,
                        food: result.data.food,
                        phone: result.data.phone,
                        stuid: result.data.stuid,
                        sfid: result.data.sfid,
                        flag: true
                    })
                } else {
                    wx.showToast({
                        title: '未注册',
                        icon: 'none'
                    })
                    that.setData({
                        flag: false
                    })
                }
            })
            .catch(e => {
                console.log(e)
            })
    },

    /**
     * 检查需要输入的字段
     */
    check() {
        if (this.data.name == '' || this.data.college == 0 || this.data.dormitory == 0 || this.data.stuid == '') {
            wx.showToast({
                title: '请完善信息',
                icon: 'none'
            })
            return false
        } else if (!this.checkMobile(this.data.phone)) {
            wx.showToast({
                title: '手机号格式不正确',
                icon: 'none'
            })
            return false
        } else if (!this.checkId(this.data.sfid) && !this.checkPasspoort(this.data.sfid)) {
            wx.showToast({
                title: '身份证/护照格式不正确',
                icon: 'none'
            })
            return false
        } else {
            return true
        }
    },

    /**
     * 检查护照号
     * 
     * @param {护照号} str 
     */
    checkPasspoort(str) {
        let re = /^1[45][0-9]{7}$|([P|p|S|s]\d{7}$)|([S|s|G|g|E|e]\d{8}$)|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8}$)|([H|h|M|m]\d{8,10})$/
        return re.test(str)
    },

    /**
     * 身份证检查
     * @param {*} id 
     */
    checkId(id) {
        // 1 "验证通过!", 0 //校验不通过 // id为身份证号码
        var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
        //号码规则校验
        if (!format.test(id)) {
            return false
        }
        //区位码校验
        //出生年月日校验  前正则限制起始年份为1900;
        var year = id.substr(6, 4), //身份证年
            month = id.substr(10, 2), //身份证月
            date = id.substr(12, 2), //身份证日
            time = Date.parse(month + '-' + date + '-' + year), //身份证日期时间戳date
            now_time = Date.parse(new Date()), //当前时间戳
            dates = (new Date(year, month, 0)).getDate(); //身份证当月天数
        if (time > now_time || date > dates) {
            return false
        }
        //校验码判断
        var c = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //系数
        var b = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'); //校验码对照表
        var id_array = id.split("");
        var sum = 0;
        for (var k = 0; k < 17; k++) {
            sum += parseInt(id_array[k]) * parseInt(c[k]);
        }
        if (id_array[17].toUpperCase() != b[sum % 11].toUpperCase()) {
            return false
        }
        return true
    },

    /**
     * 检查手机号码格式
     * 
     * @param {*} str 
     */
    checkMobile(str) {
        var re = /^1\d{10}$/
        return re.test(str)
    },

    /**
     * 学院选择框
     * 
     * @param {*} e 
     */
    bindPickerChange: function (e) {
        this.setData({
            college: e.detail.value
        })
    },
    /**
     * 宿舍选择框
     * 
     * @param {*} e 
     */
    dormitoryChange: function (e) {
        this.setData({
            dormitory: e.detail.value
        })
    },
    bindFoodChange(e){
        this.setData({
            food: e.detail.value
        })
    }

})