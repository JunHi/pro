export default {
    install(Vue, options) {
        Vue.prototype.signSecret = {
            ios: {
                appKey: '5r4b0rghvs3c9b58',
                secretKey: 'bes5p15y96fb204eaefb157328v7fd4b'
            },
            android: {
                appKey: '2bmd467b41hufjj1',
                secretKey: '56941gg9f52024fe3dr7e28hy2d2148s'
            }
        };
        Vue.prototype.secretKey = {
            encryptKey: 'eWXzfGfC4JH6CJ3b',
            encryptSecret: 'zHTosG9JttF9Ktwc'
        };
        Vue.prototype.$equipment = function () {
            let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
            return flag;
        };
        Vue.prototype.plat = function () {
            let ua = navigator.userAgent.toLowerCase();
            //android终端
            let isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;
            //ios终端
            let isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                return 'ios';
            } else if (/(Android)/i.test(navigator.userAgent)) {
                return 'android';

            }
        };
        Vue.prototype.basePamram = {

        };
        Vue.prototype.getTitle = {
            title: '',
            isBack: true,
            isAdd: false,
        };
        Vue.prototype.showFootTab = {
            isShow: false,
            active: 0,
        }
    }
}  