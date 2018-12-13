export default{
    install(Vue,options){
        //将全局属性注入Vue原型
        Vue.prototype.globalData = {
            // api:'http://172.16.1.41:8080',
            // imgApi:'http://172.16.1.41:8080/ayl_weshopManage/appgetmedia?fn=',
            // imgUploadApi:'http://172.16.1.41:8080/ayl_weshopManage/appupdmedia',
            api:'https://cd.csgxcf.com',
            imgApi:'https://cd.csgxcf.com/ayl_shopManage/appgetmedia?fn=',
            imgUploadApi:'https://cd.csgxcf.com/ayl_shopManage/appupdmedia',
            roleName:'',//角色名
            userName:'',//姓名
            roleId:'',    //用户角色id
            crrentPage:1,         //当前页码
            pageCount:10,         //当前页面显示条数
            provs:[
                {label:"北京市",value:"北京市"},  
                {label:"天津市",value:"天津市"},  
                {label:"河北省",value:"河北省"},  
                {label:"山西省",value:"山西省"},  
                {label:"内蒙古自治区",value:"内蒙古自治区"},  
                {label:"辽宁省",value:"辽宁省"},  
                {label:"吉林省",value:"吉林省"},  
                {label:"黑龙江省",value:"黑龙江省"},  
                {label:"上海市",value:"上海市"},  
                {label:"江苏省",value:"江苏省"},  
                {label:"浙江省",value:"浙江省"},  
                {label:"安徽省",value:"安徽省"},  
                {label:"福建省",value:"福建省"},  
                {label:"江西省",value:"江西省"},  
                {label:"山东省",value:"山东省"},  
                {label:"河南省",value:"河南省"},  
                {label:"湖北省",value:"湖北省"},  
                {label:"湖南省",value:"湖南省"},  
                {label:"广东省",value:"广东省"},  
                {label:"广西壮族自治区",value:"广西壮族自治区"},  
                {label:"海南省",value:"海南省"},  
                {label:"重庆市",value:"重庆市"},  
                {label:"四川省",value:"四川省"},  
                {label:"贵州省",value:"贵州省"},  
                {label:"云南省",value:"云南省"},  
                {label:"西藏自治区",value:"西藏自治区"},  
                {label:"陕西省",value:"陕西省"},  
                {label:"甘肃省",value:"甘肃省"},  
                {label:"青海省",value:"青海省"},  
                {label:"宁夏回族自治区",value:"宁夏回族自治区"},  
                {label:"新疆维吾尔自治区",value:"新疆维吾尔自治区"},  
                {label:"台湾省",value:"台湾省"},  
                {label:"香港特别行政区",value:"香港特别行政区"},  
                {label:"澳门特别行政区",value:"澳门特别行政区"}
            ] 
        }
        //全局方法
        Vue.prototype.globalMethods = {
            //表头颜色设置
            tabelHeaderColor(){
                return { backgroundColor:'#f5f7fa'}
            },
            //当前时期
            getCurrentDate(){
                var  d = new Date(),
                    year = d.getFullYear(),
                    month = d.getMonth() + 1,
                    day = d.getDate(),
                    h = d.getHours(),
                    minutes = d.getMinutes(),
                    secounds = d.getSeconds();
                if(month<10){
                    month = '0'+ month; 
                }
                if(day<10){
                    day = '0'+ day; 
                }
                if(minutes<10){
                    minutes = '0'+ minutes; 
                }
                if(secounds<10){
                    secounds = '0'+ secounds; 
                }
                return year + '-' + month + '-' + day + ' '+ h +':'+ minutes+':'+secounds;
            },
            //格式化开始时间，结束时间
            formatTimeArr(date){
                if(date){
                    var  d = new Date(date), 
                        year = d.getFullYear(),
                        month = d.getMonth() + 1,
                        day = d.getDate(),
                        time1 = '';    
                    if(month<10){
                        month = '0'+ month;
                    }
                    if(day<10){
                        day = '0'+ day;
                    }
                    time1 = year + '-' + month + '-' + day ;
                    return time1;
                } 
            },
             //格式化年月
            formatTimeYearMonth(date){
                if(date){
                    var  d = new Date(date), 
                        year = d.getFullYear(),
                        month = d.getMonth() + 1,
                        time1 = '';    
                    if(month<10){
                        month = '0'+ month;
                    }
                   
                    time1 = year + '-' + month;
                    return time1;
                }
            },
            //设置cookie
            setCookie(name, value, days) {
                var d = new Date;
                d.setTime(d.getTime() + 24*60*60*1000*days);
                window.document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
            },
            //获取cookie
            getCookie(name) {
                var v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
                return v ? v[2] : null;
            
            },
            //清除cookiie
            deleteCookie(name,value,days) {
                var d = new Date;
                d.setTime(d.getTime() + 24*60*60*1000*days);
                window.document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
            }      
        }      
    }
}
