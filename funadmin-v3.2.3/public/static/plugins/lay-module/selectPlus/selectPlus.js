layui.define("form",function(a){var b=layui.$,c=layui.form,d=layui.hint(),e="selectPlus",f="layui-form-select",g="layui-form-selected",h={index:layui.selectPlus?layui.selectPlus.index:0,set:function(a){var c=this;return c.config=b.extend({},c.config,a),c},on:function(a,b){return layui.onevent.call(this,e,a,b)}},i=function(){var a=this,b=a.config;return{getChecked:function(){return a.getChecked.call(a)},config:b}},j=function(a){var c=this;c.index=++h.index,1===a.field.length&&delete a.field,c.config=b.extend({},c.config,h.config,a),c.render()};j.prototype.config={type:"checkbox",delimiter:",",fielddelimiter:"  ---  ",placeholder:"请选择",data:[],name:"name",field:["id","title"],values:[],titles:[],url:"",method:"get",where:"",contentType:"",headers:"",response:"data",parseData:null,config:{checkedName:"SELECTPLUS_CHECKED",indexName:"SELECTPLUS_INDEX"},error:"",verify:"",tips:"tips"},j.prototype.render=function(){var a=this,c=a.config;"string"==typeof c.el?c.el=b(c.el):c.el,c.reElem=b('<div class="layui-unselect layui-form-select"><div class="layui-select-title"><input type="hidden"  lay-verify="'+c.verify+'" name="'+c.name+'"><input type="text" placeholder="'+c.placeholder+'" value="" readonly="" class="layui-input layui-unselect">'+'<i class="layui-edge"></i>'+"</div>"+'<dl class="layui-anim layui-anim-upbit">'+'<dd lay-value="" class="layui-select-tips layui-hide">'+c.placeholder+"</dd>"+"</dl>"+"</div>"),c.reElem.find(".layui-select-title").on("click",function(){b(this).parent().hasClass(g)?"":b(document).find("."+f).removeClass(g),b(this).parent().toggleClass(g)}),b(document).on("click",function(a){b(a.target).parents("."+f).length<=0&&c.reElem.hasClass(g)?c.reElem.removeClass(g):""}),Array.isArray(c.values)?"":c.values=[c.values],c.filter=c.el.parents(".layui-form").attr("lay-filter"),c.el.html(c.reElem),c.url?this.pullData():a.renderData(),c.el.on("click",".layui-select-title",function(){var a=b(this),d=a.next().find("dd").eq(0);d.hasClass("layui-hide")||d.addClass("layui-hide"),a.find('input[name="+options.name+"]').val(c.values.join(c.delimiter)),a.find('input[type="text"]').val(c.titles.join(c.delimiter))})},j.prototype.pullData=function(){var a=this,c=a.config;b.ajax({type:c.method||"get",url:c.url,contentType:c.contentType,data:c.where||{},dataType:"json",async:!0,headers:c.headers||{},success:function(b){"function"==typeof c.parseData&&(b=c.parseData(b)||b[c.response]),b.code>0&&("object"==typeof b.data||Array.isArray(b.data))?(a.config.data=c.data=a.formatData(b.data),c.error="",a.renderData()):c.error="数据格式不对"},error:function(a,b){c.error="数据接口请求异常："+b}})},j.prototype.formatData=function(a){var b=this,c=b.config,d=c.field,e=c.values,f=c.config.checkedName,g=c.config.indexName,h=0,i=[];return layui.each(a,function(b,c){i[h]="object"!=typeof c?{title:__(c),id:b}:c,i[h][g]=h,a[b][f]||(i[h][f]=!1),layui.each(e,function(a,b){i[h][d[0]]==b&&(i[h][f]=!0)}),h++}),e.splice(0),b.config.data=i,i},j.prototype.renderData=function(a){var h=this,i=h.config,j=i.type,k=h.index,a=a?h.formatData(a):h.formatData(i.data);items={checkbox:function(a,d,i){var u,v,w,j="layui-form-checkbox",k="layui-form-checked",l=a.reElem.find("dl"),m=a.config.checkedName,n=a.config.indexName,o=a.values,p=a.field,q=a.filter,r=a.fielddelimiter,s=a.delimiter,t=0;l.append(b('<dd lay-value="全选"></dd>')),layui.each(d,function(a,c){l.append(b('<dd lay-value="'+c[p[0]]+'"></dd>'))}),u=l.find("dd").eq(1),v=[],u.nextAll().each(function(a){var j,c=b(this),f=d[a],g=titletemp=f[p[1]],h=f[p[0]];p.length>0&&(g="",layui.each(p,function(a,b){g+=f[b],a<p.length-1?g+=r:""})),j=b('<input  type="checkbox" name="'+e+"checkbox"+i+'"  ff-index="'+f[n]+'" lay-skin="primary" title="'+g+'" layui-value="'+h+'">'),f[m]&&(j.prop("checked",!0),o.push(h),v.push(titletemp),t++),c.html(j)}),w=b('<input  type="checkbox"  selectplus-all  lay-skin="primary" title="全选" layui-value="全选">'),t===d.length?w.prop("checked",!0):"",u.html(w),u.parent().prev().find('input[name="'+a.name+'"]').val(o.join(s)),u.parent().prev().find('input[type="text"]').val(v.join(s)),u.on("click",function(a){var c=b(this),d="DD"===a.target.nodeName?c.find("."+j).toggleClass(k).hasClass(k):c.find("input").prop("checked");return c.parents("."+f).addClass(g),c.find("input").prop("checked",d),c.nextAll().each(function(){var a=b(this);d?a.find("."+j).addClass(k):a.find("."+j).removeClass(k),a.find("input").prop("checked",d)}),layui.event.call(c,e,"checkbox("+e+")"+h.index,{type:"checkbox",ele:c,eleChecked:d,isAll:d}),!1}),u.nextAll().on("click",function(a){var i,l,m,c=b(this),d="DD"===a.target.nodeName?c.find("."+j).toggleClass(k).hasClass(k):c.find("input").prop("checked");return c.parents("."+f).addClass(g),c.find("input").prop("checked",d),i=c.parents("dl").find("dd").eq(1),l=i.nextAll(),m=0,l.each(function(){b(this).find("input").prop("checked")?m++:""}),m===l.length?(i.find("input").prop("checked",!0),i.find("."+j).addClass(k)):(i.find("input").prop("checked",!1),i.find("."+j).removeClass(k)),layui.event.call(i,e,"checkbox("+e+")"+h.index,{type:"checkbox",ele:c,eleChecked:d,isAll:m===l.length}),!1}),c.render("checkbox",q)},radio:function(a,d,f){var w,g="layui-form-radio",j="layui-form-radioed",k=["&#xe643;","&#xe63f;"],l="layui-anim-scaleSpring",n=(a.el,a.reElem.find("dl")),o=a.config.checkedName,p=a.config.indexName,q=d.filter(function(a){return a[o]===!0}),r=a.values,s=a.field,t=a.filter,u=a.fielddelimiter,v=a.delimiter;layui.each(d,function(a,b){n.append('<dd lay-value="'+b[s[0]]+'"></dd>')}),c.render("select",i.filter),w=[],n.find("dd").eq(0).nextAll().each(function(c){var k,g=b(this),h=d[c],i=titletemp=h[s[1]],j=h[s[0]];s.length>0&&(i="",layui.each(s,function(a,b){i+=h[b],a<s.length-1?i+=u:""})),k=b('<input type="radio" name="'+e+"radio"+f+'"  ff-index="'+h[p]+'" lay-skin="primary" title="'+i+'" layui-value="'+j+'">'),q.length>0&&q[0][p]===h[p]&&(k.prop("checked",!0),r.push(j),w.push(titletemp),g.parent().prev().find('input[name="'+a.name+'"]').val(r.join(v)),g.parent().prev().find('input[type="text"]').val(w.join(v))),g.html(k)}),n.next().find("dl").addClass("ff-selectPlus"),c.render("radio",t),n.find("dd").on("click",function(){var c=b(this);c.find("."+g).addClass(j).find("i").addClass(l).html(k[0]),c.find("input").prop("checked",!0),c.siblings().find("."+g).removeClass(j).find("i").removeClass(l).html(k[1]),c.siblings().find("input").prop("checked",!1),layui.event.call(c,e,"radio("+e+")"+h.index,{type:"radio",ele:c,eleChecked:!0,isAll:!1})})}},layui.onevent.call(h,e,j+"("+e+")"+h.index,h.checked.bind(h)),items[j]?items[j](i,a,k):d.error("不支持的"+j+"表单渲染")},j.prototype.checked=function(a){var m,n,c=this,d=c.config,f=d.data,g=d.config.checkedName,h=a.type,i=a.isAll,j=a.ele,k=a.eleChecked,l=d.el.attr("lay-filter");"checkbox"===h?(d.values=[],d.titles=[],j.parents("dl").find('[type="checkbox"]').each(function(){var c=b(this),e=c.attr("ff-index"),h=c.prop("checked");e?f[e][g]=h:"",h&&e?d.values.push(c.attr("layui-value")):"",h&&e?d.titles.push(f[e][d.field[1]]):""}),j.parent().prev().find('input[type="hidden"]').val(d.values.join(d.delimiter)),j.parent().prev().find('input[type="text"]').val(d.titles.join(d.delimiter)),layui.event.call(j,e,e+"("+l+")",{checked:k,isAll:i,values:d.values,titles:d.titles,checkedData:f.filter(function(a){return a[g]===!0}),ele:j})):"radio"===h&&(m=j.find("input").attr("ff-index"),n=j.find("input").attr("layui-value"),title=f[m]["title"],d.values=[n],d.titles=[title.split(d.delimiter)[0]],j.parent().prev().find('input[type="hidden"]').val(n),j.parent().prev().find('input[type="hidden"]').attr("lay-verify",d.verify),j.parent().prev().find('input[type="hidden"]').attr("lay-verType","tips"),j.parent().prev().find('input[type="text"]').val(title),layui.each(f,function(a,b){b[g]=!1}),f[m][g]=!0,layui.event.call(j,e,e+"("+l+")",{value:n,title:title,checkedData:f[m],ele:j}))},j.prototype.getChecked=function(){var a=this,b=a.config,c=b.data,d=b.config.checkedName;return{values:b.values,data:c.filter(function(a){return a[d]===!0})}},h.render=function(a){var b=new j(a);return i.call(b)},a("selectPlus",h)});