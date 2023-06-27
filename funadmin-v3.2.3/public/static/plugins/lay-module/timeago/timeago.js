/**
 * 作者: wujiawei0926@yeah.net
 * 原作者: https://github.com/hustcc/timeago.js
 * Copyright (c) 2016 hustcc
 * License: MIT
 * Version: v3.0.0
 **/
layui.define([],function(exports){var $=layui.jquery;var indexMapEn="second_minute_hour_day_week_month_year".split("_"),indexMapZh="秒_分钟_小时_天_周_月_年".split("_"),locales={en:function(number,index){if(index===0)return["just now","right now"];var unit=indexMapEn[parseInt(index/2)];if(number>1)unit+="s";return[number+" "+unit+" ago","in "+number+" "+unit]},zh_CN:function(number,index){if(index===0)return["刚刚","片刻后"];var unit=indexMapZh[parseInt(index/2)];return[number+unit+"前",number+unit+"后"]}},SEC_ARRAY=[60,60,24,7,365/7/12,12],SEC_ARRAY_LEN=6,ATTR_DATETIME="datetime",ATTR_DATA_TID="data-tid",timers={};function toDate(input){if(input instanceof Date)return input;if(!isNaN(input))return new Date(toInt(input));if(/^\d+$/.test(input))return new Date(toInt(input));input=(input||"").trim().replace(/\.\d+/,"").replace(/-/,"/").replace(/-/,"/").replace(/(\d)T(\d)/,"$1 $2").replace(/Z/," UTC").replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2");return new Date(input)}function toInt(f){return parseInt(f)}function formatDiff(diff,locale,defaultLocale){locale=locales[locale]?locale:locales[defaultLocale]?defaultLocale:"zh_CN";var i=0,agoin=diff<0?1:0,total_sec=diff=Math.abs(diff);for(;diff>=SEC_ARRAY[i]&&i<SEC_ARRAY_LEN;i++){diff/=SEC_ARRAY[i]}diff=toInt(diff);i*=2;if(diff>(i===0?9:1))i+=1;return locales[locale](diff,i,total_sec)[agoin].replace("%s",diff)}function diffSec(date,nowDate){nowDate=nowDate?toDate(nowDate):new Date;return(nowDate-toDate(date))/1e3}function nextInterval(diff){var rst=1,i=0,d=Math.abs(diff);for(;diff>=SEC_ARRAY[i]&&i<SEC_ARRAY_LEN;i++){diff/=SEC_ARRAY[i];rst*=SEC_ARRAY[i]}d=d%rst;d=d?rst-d:rst;return Math.ceil(d)}function getDateAttr(node){if(node.dataset.timeago)return node.dataset.timeago;return getAttr(node,ATTR_DATETIME)}function getAttr(node,name){if(node.getAttribute)return node.getAttribute(name);if(node.attr)return node.attr(name)}function setTidAttr(node,val){if(node.setAttribute)return node.setAttribute(ATTR_DATA_TID,val);if(node.attr)return node.attr(ATTR_DATA_TID,val)}function getTidFromNode(node){return getAttr(node,ATTR_DATA_TID)}function Timeago(nowDate,defaultLocale){this.nowDate=nowDate;this.defaultLocale=defaultLocale||"zh_CN"}Timeago.prototype.doRender=function(node,date,locale){var diff=diffSec(date,this.nowDate),self=this,tid;node.innerHTML=formatDiff(diff,locale,this.defaultLocale);timers[tid=setTimeout(function(){self.doRender(node,date,locale);delete timers[tid]},Math.min(nextInterval(diff)*1e3,2147483647))]=0;setTidAttr(node,tid)};Timeago.prototype.format=function(date,locale){return formatDiff(diffSec(date,this.nowDate),locale,this.defaultLocale)};Timeago.prototype.render=function(nodes,locale){if(nodes.length===undefined)nodes=[nodes];for(var i=0,len=nodes.length;i<len;i++){this.doRender(nodes[i],getDateAttr(nodes[i]),locale)}};Timeago.prototype.setLocale=function(locale){this.defaultLocale=locale};function timeagoFactory(nowDate,defaultLocale){return new Timeago(nowDate,defaultLocale)}timeagoFactory.register=function(locale,localeFunc){locales[locale]=localeFunc};timeagoFactory.cancel=function(node){var tid;if(node){tid=getTidFromNode(node);if(tid){clearTimeout(tid);delete timers[tid]}}else{for(tid in timers)clearTimeout(tid);timers={}}};exports("timeago",timeagoFactory())});