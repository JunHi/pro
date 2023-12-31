/**
 @Name：treeGrid树状表格
 @Author：beijiyi,funadmin修改
 @version: 1.0
 */
layui.config({}).extend({}).define(["laytpl", "laypage", "layer", "form"], function (exports) {
    "use strict";
    var $ = layui.$, laytpl = layui.laytpl, laypage = layui.laypage, layer = layui.layer, form = layui.form,
        hint = layui.hint(), device = layui.device(), table = {
            config: {
                indexName: "lay_table_index",
                cols: {
                    isCheckName: "lay_is_checked",
                    isRadio: "lay_is_radio",
                    isOpen: "lay_is_open",
                    isShow: "lay_is_show",
                    level: "lay_level",
                    children: "children",
                    isRowCheck: "lay_is_row_check",
                    cheDisabled: "lay_che_disabled",
                    radDisabled: "lay_rad_disabled",
                    iconOpen: "lay_icon_open",
                    iconClose: "lay_icon_close",
                    icon: "lay_icon",
                },
                initWidth: {checkbox: 48, space: 15, numbers: 40, radio: 48}
            },
            cache: {
                tableId: {data: {list: [], map: {}, treeList: [], upIds: []}},
                cla: {claIds: {tableId: true}, claObjs: {tableId: {}}},
                selectcode: {demokey: [{key: {value: ""}}]}
            },
            index: layui.table ? layui.table.index + 1e4 : 0,
            set: function (options) {
                var that = this;
                that.config = $.extend({}, that.config, options);
                return that
            },
            on: function (events, callback) {
                return layui.onevent.call(this, MOD_NAME, events, callback)
            },
            getClass: function (tableId) {
                return table.cache.cla.claObjs[tableId]
            },
            pushClass: function (tableId, that) {
                table.cache.cla.claObjs[tableId] = that
            },
            isCalss: function (tableId) {
                var ids = this.cache.cla.claIds || {};
                return ids.hasOwnProperty(tableId) || false
            },
            isClassYes: function (tableId) {
                var ids = this.cache.cla.claIds || {};
                return ids[tableId] || false
            },
            pushClassIds: function (tableId, is) {
                this.cache.cla.claIds[tableId] = is
            },
            setObj: function (tableId, key, o) {
                if (!this.obj[tableId]) this.obj[tableId] = {};
                this.obj[tableId][key] = o
            },
            getObj: function (tableId, key) {
                return this.obj[tableId] ? this.obj[tableId][key] : null
            },
            getDataList: function (tableId) {
                if (table.cache[tableId]) {
                    return table.cache[tableId].data.list
                }
                return []
            },
            setDataList: function (tableId, list) {
                if (!table.cache[tableId]) table.cache[tableId] = {};
                if (!table.cache[tableId].data) table.cache[tableId].data = {};
                if (!table.cache[tableId].data.list) table.cache[tableId].data.list = [];
                table.cache[tableId].data.list = list
            },
            getDataMap: function (tableId) {
                if (table.cache[tableId]) {
                    return table.cache[tableId].data.map
                }
                return {}
            },
            setDataMap: function (tableId, map) {
                if (!table.cache[tableId]) table.cache[tableId] = {};
                if (!table.cache[tableId].data) table.cache[tableId].data = {};
                if (!table.cache[tableId].data.map) table.cache[tableId].data.map = {};
                table.cache[tableId].data.map = map
            },
            getDataTreeList: function (tableId) {
                if (table.cache[tableId]) {
                    return table.cache[tableId].data.treeList
                }
                return []
            },
            setDataTreeList: function (tableId, treeList) {
                if (!table.cache[tableId]) table.cache[tableId] = {};
                if (!table.cache[tableId].data) table.cache[tableId].data = {};
                if (!table.cache[tableId].data.treeList) table.cache[tableId].data.treeList = {};
                table.cache[tableId].data.treeList = treeList
            },
            getDataRootList: function (tableId) {
                if (table.cache[tableId]) {
                    return table.cache[tableId].data.upIds || []
                }
                return []
            },
            setDataRootList: function (tableId, rootList) {
                if (!table.cache[tableId]) table.cache[tableId] = {};
                if (!table.cache[tableId].data) table.cache[tableId].data = {};
                if (!table.cache[tableId].data.upIds) table.cache[tableId].data.upIds = [];
                table.cache[tableId].data.upIds = rootList
            },
            init: function (filter, settings) {

                settings = settings || {};
                var that = this, elemTable = filter ? $('table[lay-filter="' + filter + '"]') : $(ELEM + "[lay-data]"),
                    errorTips = "Table element property lay-data configuration item has a syntax error: ";
                elemTable.each(function () {
                    var othis = $(this), tableData = othis.attr("lay-data");
                    try {
                        tableData = new Function("return " + tableData)()
                    } catch (e) {
                        hint.error(errorTips + tableData)
                    }
                    var cols = [], options = $.extend({
                        elem: this,
                        cols: [],
                        data: [],
                        skin: othis.attr("lay-skin"),
                        size: othis.attr("lay-size"),
                        even: typeof othis.attr("lay-even") === "string"
                    }, table.config, settings, tableData);
                    filter && othis.hide();
                    othis.find("thead>tr").each(function (i) {
                        options.cols[i] = [];
                        $(this).children().each(function (ii) {
                            var th = $(this), itemData = th.attr("lay-data");
                            try {
                                itemData = new Function("return " + itemData)()
                            } catch (e) {
                                return hint.error(errorTips + itemData)
                            }
                            var row = $.extend({
                                title: th.text(),
                                colspan: th.attr("colspan") || 0,
                                rowspan: th.attr("rowspan") || 0
                            }, itemData);
                            if (row.colspan < 2) cols.push(row);
                            options.cols[i].push(row)
                        })
                    });
                    othis.find("tbody>tr").each(function (i1) {
                        var tr = $(this), row = {};
                        tr.children("td").each(function (i2, item2) {
                            var td = $(this), field = td.data("field");
                            if (field) {
                                return row[field] = td.html()
                            }
                        });
                        layui.each(cols, function (i3, item3) {
                            var td = tr.children("td").eq(i3);
                            row[item3.field] = td.html()
                        });
                        options.data[i1] = row
                    });
                    table.render(options)
                });
                return that
            },
            render: function (options) {
                table.pushClassIds(options.id);
                var inst = new Class(options);
                return thisTable.call(inst)
            },
            ready: function (tableId, fn) {
                var is = false;
                var myDate = new Date;

                function isReady() {
                    if (tableId) {
                        var that = table.getClass(tableId);
                        if (that && that.hasOwnProperty("layBody")) {
                            fn(that);
                            is = true
                        } else {
                            var myDate2 = new Date;
                            var i = myDate2.getTime() - myDate.getTime();
                            if (i <= 1e3 * 10 && !is) {
                                setTimeout(isReady, 50)
                            }
                        }
                    }
                }

                if (tableId && fn) {
                    setTimeout(isReady, 50)
                }
            },
            checkStatus: function (tableId) {
                var nums = 0, invalidNum = 0, arr = [], data = table.getDataList(tableId) || [];
                layui.each(data, function (i, item) {
                    if (item.constructor === Array) {
                        invalidNum++;
                        return
                    }
                    if (item[table.config.cols.isCheckName]) {
                        nums++;
                        arr.push(table.clearCacheKey(item))
                    }
                });
                return {data: arr, isAll: data.length ? nums === data.length - invalidNum : false}
            },
            setCheckStatus: function (tableId, fildName, ids) {
                var retObj = null;
                var that = table.getClass(tableId), invalidNum = 0, arr = [], data = table.getDataList(tableId) || [],
                    childs = that.layBody.find('input[name="' + TABLE_CHECKBOX_ID + '"]');
                if (fildName && ids) {
                    var idsarr = ids.split(",");
                    idsarr.forEach(function (o) {
                        var temo = null;
                        data.forEach(function (e) {
                            var b1 = e[fildName] + "";
                            var b2 = o + "";
                            if (b1 == b2) {
                                temo = e;
                                return
                            }
                        });
                        if (temo) {
                            var v = temo[table.config.indexName];
                            that.layBody.find('input[name="' + TABLE_CHECKBOX_ID + '"][value="' + v + '"]').prop("checked", true);
                            that.setCheckData(v, true)
                        }
                    });
                    that.syncCheckAll();
                    that.renderForm("checkbox")
                }
                return retObj
            },
            radioStatus: function (tableId) {
                var that = table.getClass(tableId);
                var retObj = null;
                var nums = 0, invalidNum = 0, arr = [], data = table.getDataList(tableId) || [];
                var v = that.layBody.find("input[name='" + TABLE_RADIO_ID + "']:checked").val();
                v = parseInt(v);
                data.forEach(function (e) {
                    if (e[table.config.indexName] == v) {
                        retObj = e
                    }
                });
                return table.clearCacheKey(retObj)
            },
            setRadioStatus: function (tableId, fildName, value) {
                var that = table.getClass(tableId);
                var retObj = null;
                var nums = 0, invalidNum = 0, arr = [], data = table.getDataList(tableId) || [];
                if (fildName && value) {
                    data.forEach(function (e) {
                        var b1 = e[fildName] + "";
                        var b2 = value + "";
                        if (b1 == b2) {
                            retObj = e;
                            return
                        }
                    });
                    if (retObj) {
                        var v = retObj[table.config.indexName];
                        that.layBody.find("input:radio[name='" + TABLE_RADIO_ID + "'][value='" + v + "']").prop("checked", true);
                        form.render("radio")
                    }
                }
                return retObj
            },
            clearCacheKey: function (data) {
                data = $.extend({}, data);
                delete data[table.config.cols.isCheckName];
                delete data[table.config.indexName];
                return data
            },
            query: function (tableId, options) {
                var that = table.getClass(tableId);
                that.renderTdCss();
                if (that.config.data && that.config.data.constructor === Array) delete that.config.data;
                that.config = $.extend({}, that.config, options);
                that.pullData(that.page, that.loading())
            },
            reload: function (tableId, options) {
                var config = thisTable.config[tableId];
                options = options || {};
                if (!config) return hint.error("The ID option was not found in the table instance");
                if (options.data && options.data.constructor === Array) delete config.data;
                return table.render($.extend(true, {}, config, options))
            },
            addRow: function (tableId, index, data) {
                var that = table.getClass(tableId), options = that.config, uo = [],
                    treeList = table.getDataTreeList(tableId), list = table.getDataList(tableId) || [];
                that.resetData(data);
                list.splice(index, 0, data);
                table.kit.restNumbers(list);
                table.setDataMap(tableId, that.resetDataMap(list));
                if (options.isTree) {
                    var uo = that.treeFindUpData(data);
                    if (uo) {
                        if (!uo.children) {
                            uo.children = []
                        }
                        uo.children.push(data);
                        data[table.config.cols.level] = uo[table.config.cols.level] + 1
                    } else {
                        data[table.config.cols.level] = 1;
                        treeList.push(data)
                    }
                }
                var _result = that.renderTr(data, data[table.config.indexName]);
                var tds = _result._tds, tds_fixed = _result._tds_l, tds_fixed_r = _result._tds_r;
                var trs = '<tr data-index="' + data[table.config.indexName] + '"' + that.renderTrUpids(data) + ">" + tds.join("") + "</tr>";
                var trs_l = '<tr data-index="' + data[table.config.indexName] + '"' + that.renderTrUpids(data) + ">" + tds_fixed.join("") + "</tr>";
                var trs_r = '<tr data-index="' + data[table.config.indexName] + '"' + that.renderTrUpids(data) + ">" + tds_fixed_r.join("") + "</tr>";
                if (index == 0) {
                    var tbody = that.layBody.find("table tbody");
                    var tlbody = that.layFixLeft.find("table tbody");
                    var trbody = that.layFixRight.find("table tbody");
                    $(tbody).prepend(trs);
                    $(tlbody).prepend(trs_l);
                    $(trbody).prepend(trs_r);
                    that.layBody.find(".layui-none").remove();
                    that.layFixLeft.find(".layui-none").remove();
                    that.layFixRight.find(".layui-none").remove()
                } else {
                    var o = that.layBody.find("[data-index=" + (index - 1) + "]");
                    var l = that.layFixLeft.find("[data-index=" + (index - 1) + "]");
                    var r = that.layFixRight.find("[data-index=" + (index - 1) + "]");
                    $(o).after(trs);
                    $(l).after(trs_l);
                    $(r).after(trs_r)
                }
                that.renderForm();
                if (options.isPage) that.renderPage(that.config.page.count + 1);
                that.restNumbers();
                that.events();
                if (options.isTree) {
                    that.treeNodeOpen(uo, true);
                    that.renderTreeConvertShowName(uo)
                }
            },
            delRow: function (tableId, data) {
                var that = table.getClass(tableId), options = that.config, list = table.getDataList(tableId);
                var sonList = [];
                var delIds = {};
                var delDatas = [];
                var upDelDatas = [];
                if (!that || !data) return;
                if (table.kit.isArray(data)) {
                    delDatas = data
                } else {
                    delDatas[0] = data
                }
                delDatas.forEach(function (temo) {
                    var uo = that.treeFindUpData(temo);
                    if (uo) {
                        upDelDatas.push(uo)
                    }
                });
                sonList = options.isTree ? table.treeFindSonList(that.config.id, delDatas) : delDatas;
                sonList.forEach(function (temo) {
                    var index = temo[table.config.indexName];
                    delIds[index] = index;
                    var tr = that.layBody.find('tr[data-index="' + index + '"]');
                    tr.remove()
                });
                that.restNumbers();
                var newList = [];
                for (var i = 0, len = list.length; i < len; i++) {
                    var isP = true;
                    var temo1 = null;
                    sonList.forEach(function (temo) {
                        if (temo[table.config.indexName] === list[i][table.config.indexName]) {
                            isP = false
                        }
                    });
                    if (isP) {
                        newList.push(list[i])
                    }
                }
                table.kit.restNumbers(newList);
                table.setDataList(tableId, newList);
                table.setDataMap(tableId, that.resetDataMap(newList));
                table.setDataTreeList(tableId, that.resetDataTreeList(newList, table.getDataRootList(tableId)));
                upDelDatas.forEach(function (temo) {
                    that.renderTreeConvertShowName(temo)
                });
                if (options.isPage) that.renderPage(that.config.page.count - Object.keys(delIds).length);
                that.events()
            },
            updateRow: function (tableId, obj) {
                var that = table.getClass(tableId);
                if (!that || !obj) return;
                var id = obj[that.config.idField];
                var maps = table.getDataMap(tableId);
                var thisobj = maps[id];
                if (thisobj) {
                    $.extend(thisobj, obj)
                } else {
                    return
                }
                var oi = thisobj[table.config.indexName];
                var _result = that.renderTr(thisobj, oi);
                var tds = _result._tds, tds_fixed = _result._tds_l, tds_fixed_r = _result._tds_r;
                var tr = that.layBody.find("tr[data-index=" + oi + "]");
                var tr_l = that.layFixLeft.find("tr[data-index=" + oi + "]");
                var tr_r = that.layFixRight.find("tr[data-index=" + oi + "]");
                $(tr).html(tds);
                $(tr_l).html(tds_fixed);
                $(tr_r).html(tds_fixed_r)
            },
            treeNodeOpen: function (tableId, o, isOpen) {
                var that = table.getClass(tableId);
                if (!that || !o) return;
                that.treeNodeOpen(o, isOpen)
            },
            treeOpenAll: function (tableId, isOpen) {
                var that = table.getClass(tableId);
                if (!that) return;
                if (isOpen === undefined) {
                    isOpen = true
                }
                var list = table.getDataList(tableId);
                if (!list) return;
                list.forEach(function (temo) {
                    that.treeNodeOpen(temo, isOpen)
                })
            },
            treeFindSonList: function (tableId, data) {
                var that = table.getClass(tableId);
                if (!that || !data) return [];
                var delDatas = [];
                var sonList = [];
                var delIds = {};
                if (table.kit.isArray(data)) {
                    delDatas = data
                } else {
                    delDatas[0] = data
                }
                delDatas.forEach(function (temo) {
                    if (temo.children.length > 0) {
                        var temSonList = that.treeFindSonData(temo);
                        temSonList.forEach(function (temii) {
                            if (!delIds[temii[table.config.indexName]]) {
                                sonList.push(temii);
                                delIds[temii[table.config.indexName]] = temii[table.config.indexName]
                            }
                        })
                    }
                    sonList.push(temo);
                    delIds[temo[table.config.indexName]] = temo[table.config.indexName]
                });
                return sonList
            },
            treeFindUpDatas: function (tableId, o) {
                var that = table.getClass(tableId);
                if (!that || !o) return [];
                return that.treeFindUpDatas(o)
            },
            treeFindUpData: function (tableId, o) {
                var that = table.getClass(tableId);
                if (!that || !o) return [];
                return that.treeFindUpData(o)
            },
            treeFindSonIds: function (tableId, data) {
                var delIds = [];
                var sonList = table.treeFindSonList(tableId, data);
                sonList.forEach(function (temo) {
                    delIds.push([table.config.indexName])
                });
                return delIds
            },
            treeFindSonIdFields: function (tableId, data) {
                var idField = [];
                var that = table.getClass(tableId);
                var sonList = table.treeFindSonList(tableId, data);
                sonList.forEach(function (temo) {
                    idField.push(temo[that.config.idField])
                });
                return idField
            },
            treeIconRender: function (tableId, o) {
                var that = table.getClass(tableId);
                if (!that || !o) return [];
                return that.treeIconRender(o, false)
            },
            treeFindRowCheck: function (tableId) {
                var rowchecks = [];
                var list = table.getDataList(tableId);
                if (list) {
                    list.forEach(function (temo) {
                        if (temo[table.config.cols.isRowCheck]) {
                            rowchecks.push(temo)
                        }
                    })
                }
                return rowchecks
            },
            treeRowCheck: function (tableId, index) {
                var that = table.getClass(tableId);
                if (!that) return;
                var list = table.getDataList(that.config.id);
                var o = list[index];
                if (that.config.model == "tree") {
                    list.forEach(function (temo) {
                        temo[table.config.cols.isRowCheck] = false
                    });
                    o[table.config.cols.isRowCheck] = true;
                    that.layBody.find("tr").css("background-color", "");
                    that.getTr(index).css("background-color", "#ccc")
                }
                typeof that.config.onClickRow === "function" && that.config.onClickRow(index, o)
            },
            kit: {
                isArray: function (o) {
                    return Object.prototype.toString.call(o) === "[object Array]"
                }, isNumber: function (val) {
                    var regPos = /^\d+(\.\d+)?$/;
                    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/;
                    if (regPos.test(val) || regNeg.test(val)) {
                        return true
                    } else {
                        return false
                    }
                }, restNumbers: function (list) {
                    if (!list) return;
                    var i = 0;
                    list.forEach(function (o) {
                        o[table.config.indexName] = i;
                        i++
                    })
                }
            }
        }, thisTable = function () {
            var that = this, options = that.config, id = options.id;
            id && (thisTable.config[id] = options);
            return {
                reload: function (options) {
                    that.reload.call(that, options)
                }, config: options
            }
        }, MOD_NAME = "treeGrid", ELEM = ".layui-table", THIS = "layui-this", SHOW = "layui-show", HIDE = "layui-hide",
        DISABLED = "layui-disabled", NONE = "layui-none", ELEM_VIEW = "layui-table-view",
        ELEM_HEADER = ".layui-table-header", ELEM_BODY = ".layui-table-body", ELEM_MAIN = ".layui-table-main",
        ELEM_FIXED = ".layui-table-fixed", ELEM_FIXL = ".layui-table-fixed-l", ELEM_FIXR = ".layui-table-fixed-r",
        ELEM_TOOL = ".layui-table-tool", ELEM_PAGE = ".layui-table-page", ELEM_SORT = ".layui-table-sort",
        ELEM_EDIT = "layui-table-edit", ELEM_HOVER = "layui-table-hover", TABLE_RADIO_ID = "table_radio_",
        TABLE_CHECKBOX_ID = "layTableCheckbox", ELEM_FILTER = ".layui-table-filter", TREE_ID = "treeId",
        TREE_UPID = "treeUpId", TREE_SHOW_NAME = "treeShowName", TREE_KEY_MAP = "tree_key_map",
        TPL_HEADER = function (options) {
            var rowCols = '{{#if(item2.colspan){}} colspan="{{item2.colspan}}"{{#} if(item2.rowspan){}} rowspan="{{item2.rowspan}}"{{#}}}';
            options = options || {};
            return ['<table cellspacing="0" cellpadding="0" border="0" class="layui-table" ', '{{# if(d.data.skin){ }}lay-skin="{{d.data.skin}}"{{# } }} {{# if(d.data.size){ }}lay-size="{{d.data.size}}"{{# } }} {{# if(d.data.even){ }}lay-even{{# } }}>', "<thead>", "{{# layui.each(d.data.cols, function(i1, item1){ }}", "<tr>", "{{# layui.each(item1, function(i2, item2){ }}", '{{# if(item2.fixed && item2.fixed !== "right"){ left = true; } }}', '{{# if(item2.fixed === "right"){ right = true; } }}', function () {
                if (options.fixed && options.fixed !== "right") {
                    return '{{# if(item2.fixed && item2.fixed !== "right"){ }}'
                }
                if (options.fixed === "right") {
                    return '{{# if(item2.fixed === "right"){ }}'
                }
                return ""
            }(), '<th data-field="{{ item2.field||i2 }}" {{# if(item2.minWidth){ }}data-minwidth="{{item2.minWidth}}"{{# } }} ' + rowCols + ' {{# if(item2.unresize){ }}data-unresize="true"{{# } }}>', '<div class="layui-table-cell laytable-cell-', "{{# if(item2.colspan > 1){ }}", "group", "{{# } else { }}", "{{d.index}}-{{item2.field || i2}}", '{{# if(item2.type !== "normal"){ }}', " laytable-cell-{{ item2.type }}", "{{# } }}", "{{# } }}", '" {{#if(item2.align){}}align="{{item2.align}}"{{#}}}>', '{{# if(item2.type === "checkbox"){ }}', '<input type="checkbox" name="layTableCheckbox" lay-skin="primary" lay-filter="layTableAllChoose">', "{{# } else { }}", '<span>{{item2.title||""}}</span>', "{{# if(!(item2.colspan > 1) && item2.sort){ }}", '<span class="layui-table-sort layui-inline"><i class="layui-edge layui-table-sort-asc"></i><i class="layui-edge layui-table-sort-desc"></i></span>', "{{# } }}", "{{# } }}", "</div>", "</th>", options.fixed ? "{{# }; }}" : "", "{{# }); }}", "</tr>", "{{# }); }}", "</thead>", "</table>"].join("")
        }, TPL_FILTER = function (options) {
        },
        TPL_BODY = ['<table cellspacing="0" cellpadding="0" border="0" class="layui-table" ', '{{# if(d.data.skin){ }}lay-skin="{{d.data.skin}}"{{# } }} {{# if(d.data.size){ }}lay-size="{{d.data.size}}"{{# } }} {{# if(d.data.even){ }}lay-even{{# } }}>', "<tbody></tbody>", "</table>"].join(""),
        TPL_MAIN = ['<div class="layui-form layui-border-box {{d.VIEW_CLASS}} {{d.data.id}}" lay-filter="LAY-table-{{d.index}}" style="{{# if(d.data.width){ }}width:{{d.data.width}}px;{{# } }} {{# if(d.data.height){ }}height:{{d.data.height}}px;{{# } }}">', "{{# if(d.data.toolbar){ }}", '<div class="layui-table-tool"></div>', "{{# } }}", '<div class="layui-table-box">', "{{# var left, right; }}", '<div class="layui-table-header">', TPL_HEADER(), "</div>", '<div class="layui-table-filter">', TPL_FILTER(), "</div>", '<div class="layui-table-body layui-table-main">', TPL_BODY, "</div>", "{{# if(left){ }}", '<div class="layui-table-fixed layui-table-fixed-l">', '<div class="layui-table-header">', TPL_HEADER({fixed: true}), "</div>", '<div class="layui-table-body">', TPL_BODY, "</div>", "</div>", "{{# }; }}", "{{# if(right){ }}", '<div class="layui-table-fixed layui-table-fixed-r">', '<div class="layui-table-header">', TPL_HEADER({fixed: "right"}), '<div class="layui-table-mend"></div>', "</div>", '<div class="layui-table-body">', TPL_BODY, "</div>", "</div>", "{{# }; }}", "</div>", "{{# if(d.data.isPage){ }}", '<div class="layui-table-page">', '<div id="layui-table-page{{d.index}}"></div>', "</div>", "{{# } }}", "</div>"].join(""),
        _WIN = $(window), _DOC = $(document), Class = function (options) {
            var that = this;
            that.index = ++table.index;
            that.config = $.extend({}, that.config, table.config, options);
            that.configFirst = $.extend({}, that.config, table.config, options);
            that.render();
            table.pushClass(options.id, that)
        };
    Class.prototype.config = {
        init: null,
        limit: 10,
        loading: true,
        cellMinWidth: 60,
        heightRemove: [],
        text: {none: "无数据"},
        isFilter: false,
        method: "post",
        radDisabledNum: 0,
        cheDisabledNum: 0,
        branch: ["&#xe622;", "&#xe624;"],
        leaf: "&#xe621;",
        iconOpen: true,
        isOpenDefault: true,
        parseData: null,
        onClickRow: null,
        onDblClickRow: null,
        onBeforeCheck: null,
        onCheck: null,
        onRadio: null,
        isTree: true,
        isPage: false,
        height: "100%",
        model: "",
        editModel: "click"
    };
    Class.prototype.configFirst = {};
    Class.prototype.render = function () {
        var that = this, options = that.config;
        options.elem = $(options.elem);
        options.where = options.where || {};
        options.id = options.id || options.elem.attr("id");
        that.test();
        options.request = $.extend({pageName: "page", limitName: "limit"}, options.request);
        options.response = $.extend({
            statusName: "code",
            statusCode: 0,
            msgName: "msg",
            dataName: "data",
            countName: "count"
        }, options.response);
        if (typeof options.page === "object") {
            options.limit = options.page.limit || options.limit;
            options.limits = options.page.limits || options.limits;
            that.page = options.page.curr = options.page.curr || 1;
            delete options.page.elem;
            delete options.page.jump
        }
        if (!options.elem[0]) return that;
        that.columnWidthInit();
        var othis = options.elem, hasRender = othis.next("." + ELEM_VIEW),
            reElem = that.elem = $(laytpl(TPL_MAIN).render({VIEW_CLASS: ELEM_VIEW, data: options, index: that.index}));
        options.index = that.index;
        hasRender[0] && hasRender.remove();
        othis.after(reElem);
        that.renderTdCss();
        that.layHeader = reElem.find(ELEM_HEADER);
        that.layMain = reElem.find(ELEM_MAIN);
        that.layBody = reElem.find(ELEM_BODY);
        that.layFixed = reElem.find(ELEM_FIXED);
        that.layFixLeft = reElem.find(ELEM_FIXL);
        that.layFixRight = reElem.find(ELEM_FIXR);
        that.layTool = reElem.find(ELEM_TOOL);
        that.layPage = reElem.find(ELEM_PAGE);
        that.layFilter = reElem.find(ELEM_FILTER);
        that.layTool.html(laytpl($(options.toolbar).html() || "").render(options));
        if (options.height) {
            that.tableHeight();
            that.resizeHeight();
            that.renderCss()
        }
        if (options.cols.length > 1) {
            var th = that.layFixed.find(ELEM_HEADER).find("th");
            th.height(that.layHeader.height() - 1 - parseFloat(th.css("padding-top")) - parseFloat(th.css("padding-bottom")))
        }
        if (options.isFilter) {
            that.layFilter.html(that.renderFilter())
        }
        that.pullData(that.page, that.loading());
        that.test()
    };
    Class.prototype.initOpts = function (item) {
        var that = this, options = that.config;
        if (item.checkbox) item.type = "checkbox";
        if (item.space) item.type = "space";
        if (!item.type) item.type = "normal";
        if (item.type !== "normal") {
            item.unresize = true;
            item.width = item.width || table.config.initWidth[item.type]
        }
        if (options.isFilter) {
            if (item.isFilter != false) {
                item.isFilter = true
            }
        }
    };
    Class.prototype.getParentDivHeight = function (tableId) {
        var th = $("#" + tableId).parent().height();
        return th
    };
    Class.prototype.getCols = function (field) {
        var that = this;
        var o = {};
        var cols = that.config.cols[0];
        var isInt = false;
        var reg = /^[0-9]+.?[0-9]*$/;
        if (reg.test(field)) {
            isInt = true
        }
        for (var ii in cols) {
            if (isInt) {
                if (ii == parseInt(field)) return cols[ii]
            } else {
                if (field == cols[ii].field) return cols[ii]
            }
        }
        return o
    };
    Class.prototype.getTr = function (index) {
        var that = this;
        var tr = that.layBody.find('tr[data-index="' + index + '"]');
        return tr
    };
    Class.prototype.getTd = function (index, field) {
        var that = this;
        var tr = that.getTr(index);
        var td = $(tr).find('td[data-field="' + field + '"]');
        return td
    };
    Class.prototype.reload = function (options) {
        var that = this;
        if (that.config.data && that.config.data.constructor === Array) delete that.config.data;
        that.config = $.extend({}, that.config, options);
        that.configFirst = $.extend({}, that.config, options);
        that.render()
    };
    Class.prototype.page = 1;
    Class.prototype.restNumbers = function () {
        var that = this, options = that.config;
        var trs = that.layBody.find("table tbody tr");
        var i = 0;
        trs.each(function (o) {
            $(this).attr("data-index", i);
            $(this).find(".laytable-cell-numbers p").text(i + 1);
            $(this).data("index", i);
            i++
        })
    };
    Class.prototype.resetData = function (n) {
        var that = this, options = that.config;
        if (options.isTree) {
            if (!n.hasOwnProperty(table.config.cols.isOpen)) {
                n[table.config.cols.isOpen] = options.isOpenDefault
            }
            if (!n.hasOwnProperty(table.config.cols.isShow)) {
                n[table.config.cols.isShow] = options.isOpenDefault ? true : false
            }
        }
        if (!n.hasOwnProperty(table.config.cols.cheDisabled)) {
            n[table.config.cols.cheDisabled] = false
        }
        if (n[table.config.cols.cheDisabled]) options.cheDisabledNum++;
        if (n[table.config.cols.radDisabled]) options.radDisabledNum++;
        n.children = []
    };
    Class.prototype.resetDataMap = function (list) {
        var that = this, options = that.config;
        var field_Id = options.idField;
        var map = {};
        if (list) {
            list.forEach(function (o) {
                map[o[field_Id]] = o
            })
        }
        return map
    };
    Class.prototype.resetDataresetRoot = true;
    Class.prototype.resetDataRoot = function (list) {
        var that = this, options = that.config;
        var field_Id = options[TREE_ID];
        var field_upId = options[TREE_UPID];
        var map = table.getDataMap(that.config.id);
        var rootList = table.cache[options.id].data.upIds || [];
        var rootMap = {};
        table.cache[options.id].data.upIds = [];
        rootList = table.cache[options.id].data.upIds;
        for (var i = 0; i < list.length; i++) {
            var temo = list[i];
            if (!map[temo[field_upId]]) {
                if (!rootMap[temo[field_upId]]) {
                    var temis = true;
                    rootList.forEach(function (temoo) {
                        if (temoo === temo[field_upId]) temis = false
                    });
                    if (temis) rootList.push(temo[field_upId])
                }
                rootMap[temo[field_upId]] = temo[field_upId]
            }
        }
        return rootList
    };
    Class.prototype.resetDataTreeList = function (list, rootList) {
        var that = this, options = that.config;
        var field_Id = options[TREE_ID];
        var field_upId = options[TREE_UPID];
        var treeList = [];
        var fa = function (upId) {
            var _array = [];
            for (var i = 0; i < list.length; i++) {
                var n = list[i];
                if (n[field_upId] === upId) {
                    n.children = fa(n[field_Id]);
                    _array.push(n)
                }
            }
            return _array
        };
        rootList.forEach(function (temo) {
            var temTreeObj = fa(temo);
            if (temTreeObj) {
                temTreeObj.forEach(function (o) {
                    treeList.push(o)
                })
            }
        });
        return treeList
    };
    Class.prototype.resetDataTableList = function (treeList) {
        var that = this, options = that.config;
        var field_Id = options[TREE_ID];
        var field_upId = options[TREE_UPID];
        var tableList = [];
        var fa2 = function (l, level) {
            for (var i = 0; i < l.length; i++) {
                var n = l[i];
                n[table.config.cols.level] = level;
                tableList.push(n);
                if (n.children && n.children.length > 0) {
                    fa2(n.children, 1 + level)
                }
            }
            return
        };
        fa2(treeList, 1);
        tableList.forEach(function (o) {
            var uo = that.treeFindUpData(o);
            if (!uo || uo[table.config.cols.isOpen] && uo[table.config.cols.isShow]) {
                o[table.config.cols.isShow] = true
            } else {
                o[table.config.cols.isShow] = false
            }
        });
        return tableList
    };
    Class.prototype.resetDatas = function (list) {
        var that = this, options = that.config;
        var field_Id = options[TREE_ID];
        var field_upId = options[TREE_UPID];
        var datas = [];
        var treeList = [];
        var tableList = list;
        var map = that.resetDataMap(list);
        datas.push(tableList);
        datas.push(treeList);
        datas.push(map);
        table.setDataList(that.config.id, tableList);
        table.setDataTreeList(that.config.id, treeList);
        table.setDataMap(that.config.id, map);
        if (list == null || list.length <= 0) return datas;
        for (var i = 0; i < list.length; i++) {
            that.resetData(list[i])
        }
        if (options.isTree) {
            tableList = [];
            table.setDataList(that.config.id, tableList);
            var rootList = table.cache[options.id].data.upIds || [];
            if (rootList.length <= 0 || that.resetDataresetRoot) {
                table.cache[options.id].data.upIds = [];
                rootList = that.resetDataRoot(list);
                that.resetDataresetRoot = false
            }
            treeList = that.resetDataTreeList(list, rootList);
            table.setDataTreeList(that.config.id, treeList);
            tableList = that.resetDataTableList(treeList);
            table.setDataList(that.config.id, tableList)
        }
        return datas
    };
    Class.prototype.treeFindDataById = function (u_Id) {
        var that = this, options = that.config;
        var e = null;
        var list = table.getDataList(that.key);
        var key = options[TREE_ID];
        list.forEach(function (o) {
            if (o[key] == u_Id) {
                e = o;
                return
            }
        });
        return e
    };
    Class.prototype.treeFindUpData = function (o) {
        var uOjb = null;
        var that = this, options = that.config;
        var key = options[TREE_UPID];
        var mapData = table.getDataMap(that.config.id);
        uOjb = mapData[o[key]];
        return uOjb
    };
    Class.prototype.treeFindUpDatas = function (o) {
        var uOjb = null;
        var that = this, options = that.config;
        var list = [];
        var temf = function (temo) {
            var uo = that.treeFindUpData(temo);
            if (uo) {
                list.push(uo);
                temf(uo)
            }
        };
        temf(o);
        return list
    };
    Class.prototype.treeFindSonData = function (data) {
        var objs = [];

        function f(o) {
            if (o.children.length > 0) {
                o.children.forEach(function (i) {
                    objs.push(i);
                    if (i.children.length > 0) {
                        f(i)
                    }
                })
            }
        }

        f(data);
        return objs
    };
    Class.prototype.treeConvertShowName = function (o) {
        var that = this, options = that.config;
        var isTreeNode = o.children && o.children.length > 0;
        var temhtml = '<div style="float: left;height: 28px;line-height: 28px;padding-left: ' + function () {
            if (isTreeNode) {
                return "5px"
            } else {
                return "21px"
            }
        }() + '">' + function () {
            var nbspHtml = "<i>";
            for (var i = 1; i < o[table.config.cols.level]; i++) {
                nbspHtml = nbspHtml + "&nbsp;&nbsp;&nbsp;&nbsp;"
            }
            nbspHtml = nbspHtml + "</i>";
            return nbspHtml
        }() + function () {
            var temTreeHtml = "";
            var temTreeIsOpen = o[table.config.cols.isOpen] ? "&#xe61a;" : "&#xe602;";
            if (isTreeNode) {
                temTreeHtml = '<i class="layui-icon layui-tree-head">' + temTreeIsOpen + "</i>" + that.treeIconRender(o, true)
            } else {
                temTreeHtml += that.treeIconRender(o, true)
            }
            return temTreeHtml
        }() + "</div>";
        return temhtml
    };
    Class.prototype.treeNodeOpen = function (o, isOpen) {
        var that = this, tr = that.layBody.find('tr[data-index="' + o[table.config.indexName] + '"]');
        if (!o) {
            return
        }
        o[table.config.cols.isOpen] = isOpen;
        var fa = function (e) {
            if (e.children && e.children.length > 0) {
                var temList = e.children;
                for (var i = 0; i < temList.length; i++) {
                    var n = temList[i];
                    if (o[table.config.cols.isOpen]) {
                        if (e[table.config.cols.isOpen] && e[table.config.cols.isShow]) {
                            var temo = that.layBody.find('tr[data-index="' + n[table.config.indexName] + '"]');
                            temo.css("display", "");
                            n[table.config.cols.isShow] = true
                        }
                    } else {
                        var temo = that.layBody.find('tr[data-index="' + n[table.config.indexName] + '"]');
                        temo.css("display", "none");
                        n[table.config.cols.isShow] = false
                    }
                    fa(n)
                }
            }
        };
        fa(o);
        that.treeIconRender(o, false);
        var dbClickI = tr.find(".layui-tree-head");
        if (o[table.config.cols.isOpen]) {
            dbClickI.html("&#xe61a;")
        } else {
            dbClickI.html("&#xe602;")
        }
    };
    Class.prototype.treeIconRender = function (o, isHtml) {
        var that = this, options = that.config, iconOpen = options.iconOpen,
            isTreeNode = o.children && o.children.length > 0;
        var temTreeHtml = "";
        if (iconOpen) {
            var temf = function () {
                var temhtml = '<i class="layui-tree-' + o[options.idField] + '" style="display:inline-block;width: 16px;height: 16px;background:url(';
                if (isTreeNode) {
                    if (o[table.config.cols.isOpen]) {
                        temhtml += o[table.config.cols.iconOpen]
                    } else {
                        temhtml += o[table.config.cols.iconClose]
                    }
                } else {
                    temhtml += o[table.config.cols.icon]
                }
                temhtml += ') 0 0 no-repeat;"></i>';
                return temhtml
            };
            if (isTreeNode) {
                if (o[table.config.cols.iconOpen] || o[table.config.cols.iconClose]) {
                    temTreeHtml = temf()
                } else {
                    temTreeHtml = '<i class="layui-icon layui-tree-' + o[options.idField] + " layui-tree-" + (o[table.config.cols.isOpen] ? "branch" : "leaf") + '" ' + iconOpen + ">" + (o[table.config.cols.isOpen] ? that.config.branch[1] : that.config.branch[0]) + "</i>"
                }
            } else {
                if (o[table.config.cols.icon]) {
                    temTreeHtml = temf()
                } else {
                    temTreeHtml += '<i class="layui-icon layui-tree-' + o[options.idField] + ' layui-tree-leaf"  ' + iconOpen + ">" + that.config.leaf + "</i>"
                }
            }
            if (isHtml) {
                return temTreeHtml
            } else {
                var temdiv = that.layBody.find('tr[data-index="' + o[table.config.indexName] + '"]').find("td[data-field=" + options[TREE_SHOW_NAME] + "]").find(".layui-table-cell");
                $(temdiv).find("div .layui-tree-" + o[options.idField]).remove();
                $(temdiv).find("div").append(temTreeHtml)
            }
        } else {
            return temTreeHtml
        }
    };
    Class.prototype.pullData = function (curr, loadIndex) {
        var that = this, options = that.config, request = options.request, response = options.response,
            sort = function () {
                if (typeof options.initSort === "object") {
                    that.sort(options.initSort.field, options.initSort.type)
                }
            };
        that.startTime = (new Date).getTime();
        if (options.url) {
            var params = {};
            params[request.pageName] = curr;
            params[request.limitName] = options.limit;
            that.filterRulesSet(params);
            that.sortSet(params);
            var data = $.extend(params, options.where);
            if (options.contentType && options.contentType.indexOf("application/json") == 0) {
                data = JSON.stringify(data)
            }
            $.ajax({
                type: options.method || "get",
                url: options.url,
                data: data,
                dataType: "json",
                contentType: options.contentType,
                headers: options.headers,
                success: function (res) {
                    if (!res[response.dataName]) {
                        res[response.dataName] = [];
                        res[response.statusName] = 0;
                        res[response.countName] = 0;
                        res[response.msgName] = "返回的数据状态异常"
                    }
                    that.resetDataresetRoot = true;
                    if (typeof options.parseData === "function") {
                        res = options.parseData(res) || res
                    }
                    that.resetDatas(res[response.dataName]);
                    res[response.dataName] = table.getDataList(options.id);
                    if (res[response.statusName] != response.statusCode) {
                        that.renderForm();
                        that.layMain.html('<div class="' + NONE + '">' + (res[response.msgName] || "返回的数据状态异常") + "</div>")
                    } else {
                        that.renderData(res, curr, res[response.countName]);
                        options.time = (new Date).getTime() - that.startTime + " ms"
                    }
                    loadIndex && layer.close(loadIndex);
                    that.events();
                    typeof options.done === "function" && options.done(res, curr, res[response.countName]);
                    that.renderRowCheck()
                },
                error: function (e, m) {
                    that.layMain.html('<div class="' + NONE + '">数据接口请求异常</div>');
                    that.renderForm();
                    loadIndex && layer.close(loadIndex)
                }
            })
        } else if (options.data && options.data.constructor === Array) {
            var res = {}, startLimit = curr * options.limit - options.limit;
            res[response.dataName] = options.data.concat().splice(startLimit, options.limit);
            that.resetDatas(res[response.dataName]);
            res[response.countName] = options.data.length;
            that.renderData(res, curr, options.data.length);
            that.events();
            typeof options.done === "function" && options.done(res, curr, res[response.countName]);
            that.renderRowCheck()
        }
    };
    Class.prototype.filterRulesSet = function (p) {
        var that = this;
        p["filterRules"] = JSON.stringify(that.filterRules())
    };
    Class.prototype.filterRules = function () {
        var that = this;
        var filterRules = [];
        var list = that.layFilter.find("[name^='filter_']");
        layui.each(list, function (i, o) {
            if ($(o).val()) {
                var tem = {field: o.name, op: "like", value: $(o).val(), datatype: "string"};
                filterRules.push(tem)
            }
        });
        return filterRules
    };
    Class.prototype.eachCols = function (callback) {
        var cols = $.extend(true, [], this.config.cols), arrs = [], index = 0,init = this.config.init
        layui.each(cols, function (i1, item1) {
            layui.each(item1, function (i2, item2) {
                if (item2.colspan > 1) {
                    var childIndex = 0;
                    index++;
                    item2.CHILD_COLS = [];
                    layui.each(cols[i1 + 1], function (i22, item22) {
                        if (item22.PARENT_COL || childIndex == item2.colspan) return;
                        item22.PARENT_COL = index;
                        item2.CHILD_COLS.push(item22);
                        childIndex = childIndex + (item22.colspan > 1 ? item22.colspan : 1)
                    })
                }
                if (item2.PARENT_COL) return;
                item2.init = init;
                arrs.push(item2)
            })
        });
        var eachArrs = function (obj) {
            layui.each(obj || arrs, function (i, item) {
                if (item.CHILD_COLS) return eachArrs(item.CHILD_COLS);
                callback(i, item)
            })
        };
        eachArrs()
    };
    Class.prototype.renderTreeConvertShowName = function (o) {
        var that = this, options = that.config, m = options.elem, hasRender = m.next("." + ELEM_VIEW);
        var temhtml = that.treeConvertShowName(o);
        var temdiv = that.layBody.find('tr[data-index="' + o[table.config.indexName] + '"]').find("td[data-field=" + options[TREE_SHOW_NAME] + "]").find(".layui-table-cell");
        $(temdiv).find("div").remove();
        $(temdiv).prepend(temhtml)
    };
    Class.prototype.renderTdCss = function () {
        var that = this, options = that.config, m = options.elem, hasRender = m.next("." + ELEM_VIEW);
        var id = that.index + "_" + MOD_NAME + "_td_style";
        hasRender.find("#" + id).remove();
        var styel = '<style id="' + id + '">' + function () {
            var ret = "";
            layui.each(that.config.cols, function (i1, item1) {
                layui.each(item1, function (i2, item2) {
                    ret += ".laytable-cell-" + that.index + "-" + (item2.field || i2) + "{" + "width:" + (item2.width ? item2.width + "px" : "0px") + "}"
                })
            });
            return ret
        }() + "</style>";
        hasRender.append(styel)
    };
    Class.prototype.renderTdEdit = function (index, field) {
        var that = this, othis = $(that.getTd(index, field)).last(), options = that.config, field = othis.data("field"),
            editType = othis.data("edit"), index = othis.parents("tr").eq(0).data("index"),
            val = othis.find("div.layui-table-cell p").eq(0).text(), data = table.getDataList(that.key)[index];
        if (editType === "select") {
            var dropName = othis.data("drop");
            var rowsField = dl.ui.table.drop.findFieldObj(options.cols[0], field);
            var o = dl.cache.code.get(rowsField.drop);
            var html = "";
            var scv = o.syscodevaluecache;
            for (var i in scv) {
                var isSelected = "";
                if (scv[i].scv_value == data[field]) {
                    isSelected = "selected='selected'"
                }
                html += "<option " + isSelected + '  value="' + scv[i].scv_value + '">' + scv[i].scv_show_name + "</option>"
            }
            var select = $('<select class="' + ELEM_EDIT + '" lay-ignore>' + html + "</select>");
            othis.find("." + ELEM_EDIT)[0] || othis.append(select)
        } else {
            var input = $('<input class="layui-input ' + ELEM_EDIT + '">');
            input[0].value = $.trim(val);
            othis.find("." + ELEM_EDIT)[0] || othis.append(input);
            input.focus()
        }
    };
    Class.prototype.renderCss = function () {
        var that = this, options = that.config, m = options.elem, hasRender = m.next("." + ELEM_VIEW);
        var id = that.index + "_" + MOD_NAME + "_style";
        hasRender.find("#" + id).remove();
        var styel = '<style id="' + id + '">' + function () {
            var ret = ".layui-tree-head{cursor: pointer;}";
            ret += ".layui-table-view {margin:0;}";
            if (options.model) {
                if (options.model == "tree") {
                    that.layHeader.hide();
                    that.layFilter.hide();
                    ret += "." + options.id + " .layui-table td,." + options.id + "{border-style: none;padding:0;}";
                    ret += "." + options.id + " .layui-table-view .layui-table{width:100%;}"
                }
            }
            return ret
        }() + "</style>";
        hasRender.append(styel)
    };
    Class.prototype.renderTrUpids = function (obj) {
        var that = this, options = that.config;
        var tree_upid_key = options[TREE_UPID];
        var upids = ' upids="' + obj["upIds"] + '" ';
        var u_id = ' u_id="' + obj[tree_upid_key] + '" ';
        var ret = options.isTree ? u_id : "";
        return ret
    };
    Class.prototype.renderTd = function (obj, cols, numbers, i3) {
        var that = this, options = that.config;
        options.primaryKey = options.primaryKey || "id";
        var v = obj[cols.field] == null ? "" : String(obj[cols.field]);
        var field = cols.field || i3, content = v, cell = that.getColElem(that.layHeader, field);
        cols.primaryKey = cols.primaryKey || options.primaryKey;
        var treeImgHtml = "";
        if (options.isTree) {
            if (options.treeShowName == cols.field) {
                treeImgHtml = that.treeConvertShowName(obj)
            }
        }
        var td = ['<td data-field="' + field + '" ' + function () {
            var attr = [];
            if (cols.edit) attr.push('data-edit="' + cols.edit + '"');
            if (cols.align) attr.push('align="' + cols.align + '"');
            if (cols.templet) attr.push('data-content="' + content + '"');
            if (cols.toolbar) attr.push('data-off="true"');
            if (cols.event) attr.push('lay-event="' + cols.event + '"');
            if (cols.style) attr.push('style="' + cols.style + '"');
            if (cols.minWidth) attr.push('data-minwidth="' + cols.minWidth + '"');
            return attr.join(" ")
        }() + ">", '<div class="layui-table-cell laytable-cell-' + function () {
            var str = options.index + "-" + field;
            return cols.type === "normal" ? str : str + " laytable-cell-" + cols.type
        }() + '">' + treeImgHtml + '<p style="width: auto;height: 100%;">' + function () {
            var tplData = $.extend(true, {LAY_INDEX: numbers, LAY_COL: cols}, obj);
            if (cols.type === "checkbox") {
                return tplData[table.config.cols.cheDisabled] ? "" : '<input type="checkbox" name="' + TABLE_CHECKBOX_ID + '" value="' + tplData[table.config.indexName] + '" lay-skin="primary" ' + function () {
                    var isCheckName = table.config.cols.isCheckName;
                    if (cols[isCheckName]) {
                        obj[isCheckName] = cols[isCheckName];
                        return cols[isCheckName] ? "checked" : ""
                    }
                    return tplData[isCheckName] ? "checked" : ""
                }() + ">"
            } else if (cols.type === "numbers") {
                return numbers
            } else if (cols.type === "drop") {
                var rowsField = dl.ui.table.drop.findFieldObj(options.cols[0], field);
                if (rowsField && rowsField["drop"]) {
                    var o = dl.cache.code.get(rowsField.drop);
                    return dl.ui.table.drop.findDropLable(rowsField.drop, content)
                }
            } else if (cols.type === "radio") {
                return tplData[table.config.cols.radDisabled] ? "" : '<input type="radio" name="' + TABLE_RADIO_ID + '" ' + function () {
                    var isRadio = table.config.cols.isRadio;
                    if (cols[isRadio]) {
                        obj[isRadio] = cols[isRadio];
                        return cols[isRadio] ? "checked" : ""
                    }
                    return tplData[isRadio] ? "checked" : ""
                }() + ' value="' + tplData[table.config.indexName] + '" title=" ">'
            }
            if (cols.toolbar) {
                return laytpl($(cols.toolbar).html() || "").render(tplData)
            }
            return cols.templet ? function () {
                return typeof cols.templet === "function" ? cols.templet(tplData) : laytpl($(cols.templet).html() || String(content)).render(tplData)
            }() : content
        }(), "</p></div></td>"].join("");
        return td
    };
    Class.prototype.renderTr = function (obj, numbers) {
        var that = this, options = that.config;
        var tds = [], tds_l = [], tds_r = [];
        that.eachCols(function (i3, cols) {
            var field = cols.field || i3, content = obj[field];
            if (cols.colspan > 1) return;
            var td = that.renderTd(obj, cols, numbers, i3);
            tds.push(td);
            if (cols.fixed && cols.fixed !== "right") tds_l.push(td);
            if (cols.fixed === "right") tds_r.push(td)
        });
        return {_tds: tds, _tds_l: tds_l, _tds_r: tds_r}
    };
    Class.prototype.renderData = function (res, curr, count, sort) {
        var that = this, options = that.config, data = res[options.response.dataName] || [], trs = [], trs_fixed = [],
            trs_fixed_r = [], render = function () {
                if (!sort && that.sortKey) {
                    return that.sort(that.sortKey.field, that.sortKey.sort, true)
                }
                layui.each(data, function (i1, obj) {
                    var uo = that.treeFindUpData(obj);
                    var display = "";
                    if (!obj[table.config.cols.isShow] && options.isTree) {
                        display = "display: none;"
                    }
                    var tds = [], tds_fixed = [], tds_fixed_r = [], numbers = i1 + options.limit * (curr - 1) + 1;
                    if (obj.length === 0) return;
                    if (!sort) {
                        obj[table.config.indexName] = i1
                    }
                    var _result = that.renderTr(obj, numbers);
                    tds = _result._tds;
                    tds_fixed = _result._tds_l;
                    tds_fixed_r = _result._tds_r;
                    trs.push('<tr style="' + display + '" data-index="' + i1 + '" ' + that.renderTrUpids(obj) + ">" + tds.join("") + "</tr>");
                    trs_fixed.push('<tr style="' + display + '"  data-index="' + i1 + '">' + tds_fixed.join("") + "</tr>");
                    trs_fixed_r.push('<tr style="' + display + '"  data-index="' + i1 + '">' + tds_fixed_r.join("") + "</tr>")
                });
                that.layBody.scrollTop(0);
                that.layMain.find("." + NONE).remove();
                that.layMain.find("tbody").html(trs.join(""));
                that.layFixLeft.find("tbody").html(trs_fixed.join(""));
                that.layFixRight.find("tbody").html(trs_fixed_r.join(""));
                that.renderForm();
                that.haveInit ? that.scrollPatch() : setTimeout(function () {
                    that.scrollPatch()
                }, 50);
                that.haveInit = true;
                layer.close(that.tipsIndex)
            };
        that.key = options.id || options.index;
        table.setDataList(that.key, data);
        that.layPage[data.length === 0 && curr == 1 ? "addClass" : "removeClass"](HIDE);
        if (sort) {
            return render()
        }
        if (data.length === 0) {
            that.renderForm();
            that.layFixed.remove();
            that.layMain.find("tbody").html("");
            that.layMain.find("." + NONE).remove();
            return that.layMain.append('<div class="' + NONE + '">' + (res[options.response.msgName] ? res[options.response.msgName] : options.text.none) + "</div>")
        }
        render();
        that.renderPage(count);
        table.pushClassIds(options.id, true)
    };
    Class.prototype.renderPage = function (count) {
        var that = this, options = that.config;
        if (options.isPage) {
            options.page = $.extend({
                elem: "layui-table-page" + options.index,
                count: count,
                limit: options.limit,
                limits: options.limits || [10, 15, 20, 30, 40, 50, 60, 70, 80, 90],
                groups: 3,
                layout: ["prev", "page", "next", "skip", "count", "limit"],
                prev: '<i class="layui-icon">&#xe603;</i>',
                next: '<i class="layui-icon">&#xe602;</i>',
                jump: function (obj, first) {
                    if (!first) {
                        that.page = obj.curr;
                        options.limit = obj.limit;
                        that.pullData(obj.curr, that.loading())
                    }
                }
            }, options.page);
            options.page.count = count;
            laypage.render(options.page)
        }
    };
    Class.prototype.renderFilter = function () {
        var that = this, options = that.config, VIEW_CLASS = ELEM_VIEW, index = that.index;
        var v = [];
        v.push('<form method="post"  id="' + options.id + '_filter_form">');
        v.push('<table cellspacing="0" cellpadding="0" border="0" class="layui-table"><thead><tr>');
        layui.each(options.cols, function (i, o) {
            layui.each(o, function (i2, item2) {
                var field = item2.field || i2;
                var minW = item2.minWidth ? "data-minwidth='" + item2.minWidth + "'" : "";
                var rowCols = item2.colspan ? 'colspan="' + item2.colspan + '"' : "";
                var rowspan = item2.rowspan ? 'rowspan="' + item2.rowspan + '"' : "";
                var unresize = item2.unresize ? 'data-unresize="true"' : "";
                v.push('<th data-field="' + field + '"' + minW + rowCols + rowspan + unresize + ">");
                v.push('<div class="layui-table-cell laytable-cell-' + function () {
                    var tem = "";
                    if (item2.colspan > 1) {
                        tem = "group"
                    } else {
                        tem = index + "-" + field;
                        if (item2.type !== "normal") {
                            tem += " laytable-cell-" + item2.type
                        }
                    }
                    return tem
                }() + '">');
                if (!item2.isFilter || !item2.field) {
                    v.push("")
                } else {
                    v.push('<input class="layui-input ' + ELEM_EDIT + '" id="filter_' + item2.field + '" name="filter_' + item2.field + '">')
                }
                v.push("</div></th>")
            })
        });
        v.push("</tr></thead></table>");
        v.push("</form>");
        return v.join("")
    };
    Class.prototype.renderRowCheck = function () {
        var that = this, options = that.config, index = that.index;
        var list = table.getDataList(options.id);
        if (list) {
            list.forEach(function (temo) {
                var tr = that.layBody.find("tr[data-index=" + temo[table.config.indexName] + "]");
                if (temo[table.config.cols.isRowCheck]) {
                    tr.css("background-color", "#ccc")
                } else {
                    tr.css("background-color", "")
                }
            })
        }
    };
    Class.prototype.getColElem = function (parent, field) {
        var that = this, options = that.config;
        return parent.eq(0).find(".laytable-cell-" + (options.index + "-" + field) + ":eq(0)")
    };
    Class.prototype.renderForm = function (type) {
        form.render(type, "LAY-table-" + this.index)
    };
    Class.prototype.sortSet = function (p) {
        var that = this;
        var sort = [];
        var cols = that.config.cols[0];
        cols.forEach(function (t) {
            if (t.sortType) {
                var tem = {field: t.field, sort: t.sortType};
                sort.push(tem)
            }
        });
        p.sort = JSON.stringify(sort)
    };
    Class.prototype.sort = function (th, type, pull, formEvent) {
        var that = this, field, res = {}, options = that.config, filter = options.elem.attr("lay-filter"),
            data = table.getDataList(that.key), thisData;
        if (typeof th === "string") {
            that.layHeader.find("th").each(function (i, item) {
                var othis = $(this), _field = othis.data("field");
                if (_field === th) {
                    th = othis;
                    field = _field;
                    return false
                }
            })
        }
        try {
            var field = field || th.data("field");
            if (that.sortKey && !pull) {
                if (field === that.sortKey.field && type === that.sortKey.sort) {
                    return
                }
            }
            var elemSort = that.layHeader.find("th .laytable-cell-" + options.index + "-" + field).find(ELEM_SORT);
            elemSort.attr("lay-sort", type || null);
            that.layFixed.find("th")
        } catch (e) {
            return hint.error("Table modules: Did not match to field")
        }
        var cols = that.getCols(field);
        if (cols) {
            cols.sortType = type
        }
    };
    Class.prototype.loading = function () {
        var that = this, options = that.config;
        if (options.loading && options.url) {
            return layer.msg("数据请求中", {
                icon: 16,
                offset: [that.elem.offset().top + that.elem.height() / 2 - 35 - _WIN.scrollTop() + "px", that.elem.offset().left + that.elem.width() / 2 - 90 - _WIN.scrollLeft() + "px"],
                time: -1,
                anim: -1,
                fixed: false
            })
        }
    };
    Class.prototype.setCheckData = function (index, checked) {
        var that = this, options = that.config, thisData = table.getDataList(that.key);
        if (!thisData[index]) return;
        if (thisData[index].constructor === Array) return;
        thisData[index][table.config.cols.isCheckName] = checked
    };
    Class.prototype.syncCheckAll = function () {
        var that = this, options = that.config;
        var list = table.getDataList(that.config.id);
        if (!list) return;
        var temis = true;
        var checkNum = 0;
        list.forEach(function (t) {
            if (!t[table.config.cols.cheDisabled]) {
                if (t[table.config.cols.isCheckName]) {
                    var checkAllElem = that.layBody.find("tr[data-index=" + t[table.config.indexName] + "]").find('input[name="' + TABLE_CHECKBOX_ID + '"]');
                    checkAllElem.prop("checked", true);
                    checkNum++
                } else {
                    temis = false;
                    var checkAllElem = that.layBody.find("tr[data-index=" + t[table.config.indexName] + "]").find('input[name="' + TABLE_CHECKBOX_ID + '"]');
                    checkAllElem.prop("checked", false)
                }
            }
        });
        if (temis) {
            var checkAllElem = that.layHeader.find('input[name="' + TABLE_CHECKBOX_ID + '"]');
            checkAllElem.prop("checked", true)
        }
        if (checkNum < list.length - options.cheDisabledNum) {
            var checkAllElem = that.layHeader.find('input[name="' + TABLE_CHECKBOX_ID + '"]');
            checkAllElem.prop("checked", false)
        }
        that.renderForm("checkbox")
    };
    Class.prototype.getCssRule = function (field, callback) {
        var that = this, style = that.elem.find("style")[0], sheet = style.sheet || style.styleSheet || {},
            rules = sheet.cssRules || sheet.rules;
        layui.each(rules, function (i, item) {
            if (item.selectorText === ".laytable-cell-" + that.index + "-" + field) {
                return callback(item), true
            }
        })
    };
    Class.prototype.test = function () {
    };
    Class.prototype.resize = function () {
        var that = this;
        that.columnWidthInit();
        that.tableHeight();
        that.resizeHeight();
        that.resizeWidth()
    };
    Class.prototype.setArea = function () {
        var that = this;
        that.columnWidthInit();
        that.tableHeight()
    };
    Class.prototype.columnWidthInit = function () {
        var that = this, options = that.config, colNums = 0, autoColNums = 0, autoWidth = 0, countWidth = 0,
            cntrWidth = options.width || function () {
                var getWidth = function (parent) {
                    var width, isNone;
                    parent = parent || options.elem.parent();
                    width = parent.width();
                    try {
                        isNone = parent.css("display") === "none"
                    } catch (e) {
                    }
                    if (parent[0] && (!width || isNone)) return getWidth(parent.parent());
                    return width
                };
                return getWidth()
            }() - 17;
        that.eachCols(function () {
            colNums++
        });
        cntrWidth = cntrWidth - function () {
            return options.skin === "line" || options.skin === "nob" ? 2 : colNums + 1
        }();
        layui.each(options.cols, function (i1, item1) {
            layui.each(item1, function (i2, item2) {
                var width;
                if (!item2) {
                    item1.splice(i2, 1);
                    return
                }
                that.initOpts(item2);
                width = item2.width || 0;
                if (item2.colspan > 1) return;
                if (/\d+%$/.test(width)) {
                    item2.width = width = Math.floor(parseFloat(width) / 100 * cntrWidth)
                } else if (item2._is_width_dev || !width) {
                    item2._is_width_dev = true;
                    item2.width = width = 0;
                    autoColNums++
                }
                countWidth = countWidth + width
            })
        });
        that.autoColNums = autoColNums;
        cntrWidth > countWidth && autoColNums && (autoWidth = (cntrWidth - countWidth) / autoColNums);
        layui.each(options.cols, function (i1, item1) {
            layui.each(item1, function (i2, item2) {
                var minWidth = item2.minWidth || options.cellMinWidth;
                if (item2.colspan > 1) return;
                if (item2.width === 0) {
                    item2.width = Math.floor(autoWidth >= minWidth ? autoWidth : minWidth)
                }
            })
        })
    };
    Class.prototype.resizeWidth = function () {
        var that = this;
        that.renderTdCss()
    };
    Class.prototype.tableHeight = function () {
        var that = this, options = that.config, optionsFirst = that.configFirst;
        if (!table.kit.isNumber(optionsFirst.height)) {
            var htremove = 0;
            if (options.heightRemove && table.kit.isArray(options.heightRemove)) {
                var htatt = options.heightRemove;
                htatt.forEach(function (t) {
                    var temh = table.kit.isNumber(t) ? t : $(t).outerHeight(true);
                    if (table.kit.isNumber(temh)) {
                        htremove += temh
                    }
                })
            }
            var th = _WIN.height() - htremove - 1;
            that.fullHeightGap = 0;
            if (options.height) {
                if (/^full-\d+$/.test(options.height)) {
                    that.fullHeightGap = options.height.split("-")[1]
                }
            }
            options.height = th - that.fullHeightGap
        }
    };
    Class.prototype.resizeHeight = function () {
        var that = this, options = that.config, height = options.height, bodyHeight;
        if (height < 135) height = 135;
        that.elem.css("height", height);
        var theader = options.isFilter ? 76 : 38;
        bodyHeight = parseFloat(height) - (that.config.model == "tree" ? 0 : theader) - 1;
        if (options.toolbar) {
            bodyHeight = bodyHeight - that.layTool.outerHeight()
        }
        if (options.isPage) {
            bodyHeight = bodyHeight - that.layPage.outerHeight() - 1
        }
        that.layMain.css("height", bodyHeight)
    };
    Class.prototype.getScrollWidth = function (elem) {
        var width = 0;
        if (elem) {
            width = elem.offsetWidth - elem.clientWidth
        } else {
            elem = document.createElement("div");
            elem.style.width = "100px";
            elem.style.height = "100px";
            elem.style.overflowY = "scroll";
            document.body.appendChild(elem);
            width = elem.offsetWidth - elem.clientWidth;
            document.body.removeChild(elem)
        }
        return width
    };
    Class.prototype.scrollPatch = function () {
        var that = this, layMainTable = that.layMain.children("table"),
            scollWidth = that.layMain.width() - that.layMain.prop("clientWidth"),
            scollHeight = that.layMain.height() - that.layMain.prop("clientHeight"),
            getScrollWidth = that.getScrollWidth(that.layMain[0]),
            outWidth = layMainTable.outerWidth() - that.layMain.width();
        if (that.autoColNums && outWidth < 5 && !that.scrollPatchWStatus) {
            var th = that.layHeader.eq(0).find("thead th:last-child"), field = th.data("field");
            that.getCssRule(field, function (item) {
                var width = item.style.width || th.outerWidth();
                item.style.width = parseFloat(width) - getScrollWidth - outWidth + "px";
                if (that.layMain.height() - that.layMain.prop("clientHeight") > 0) {
                    item.style.width = parseFloat(item.style.width) - 1 + "px"
                }
                that.scrollPatchWStatus = true
            })
        }
        if (scollWidth && scollHeight) {
            if (that.elem.find(".layui-table-patch").length <= 0) {
                var patchElem = $('<th class="layui-table-patch"><div class="layui-table-cell"></div></th>');
                patchElem.find("div").css({width: scollWidth});
                that.layHeader.eq(0).find("thead tr").append(patchElem)
            }
        } else {
            that.layFilter.eq(0).find(".layui-table-patch").remove();
            that.layHeader.eq(0).find(".layui-table-patch").remove()
        }
        var mainHeight = that.layMain.height(), fixHeight = mainHeight - scollHeight;
        that.layFixed.find(ELEM_BODY).css("height", layMainTable.height() > fixHeight ? fixHeight : "auto");
        that.layFixRight[outWidth > 0 ? "removeClass" : "addClass"](HIDE);
        that.layFixRight.css("right", scollWidth - 1)
    };
    Class.prototype.events = function () {
        var that = this, options = that.config, _BODY = $("body"), dict = {}, th = that.layHeader.find("th"),
            bodytr = that.layBody.find("tr"), resizing;
        bodytr.unbind("click").on("click", function (e) {
            var index = $(this).attr("data-index");
            table.treeRowCheck(that.config.id, index)
        });
        bodytr.unbind("dblclick").on("dblclick", function (e) {
            var index = $(this).attr("data-index");
            var list = table.getDataList(that.config.id);
            var o = list[index];
            typeof options.onDblClickRow === "function" && options.onDblClickRow(index, o)
        });
        th.unbind("mousemove").on("mousemove", function (e) {
            var othis = $(this), oLeft = othis.offset().left, pLeft = e.clientX - oLeft;
            if (othis.attr("colspan") > 1 || othis.data("unresize") || dict.resizeStart) {
                return
            }
            dict.allowResize = othis.width() - pLeft <= 10;
            _BODY.css("cursor", dict.allowResize ? "col-resize" : "")
        });
        th.unbind("mouseleave").on("mouseleave", function () {
            var othis = $(this);
            if (dict.resizeStart) return;
            _BODY.css("cursor", "")
        });
        th.unbind("mousedown").on("mousedown", function (e) {
            var othis = $(this);
            if (dict.allowResize) {
                var field = othis.data("field");
                e.preventDefault();
                dict.resizeStart = true;
                dict.offset = [e.clientX, e.clientY];
                that.getCssRule(field, function (item) {
                    var width = item.style.width || othis.outerWidth();
                    dict.rule = item;
                    dict.ruleWidth = parseFloat(width);
                    dict.minWidth = othis.data("minwidth") || options.cellMinWidth
                })
            }
        });
        _DOC.unbind("mousemove").on("mousemove", function (e) {
            if (dict.resizeStart) {
                e.preventDefault();
                if (dict.rule) {
                    var setWidth = dict.ruleWidth + e.clientX - dict.offset[0];
                    if (setWidth < dict.minWidth) setWidth = dict.minWidth;
                    dict.rule.style.width = setWidth + "px";
                    layer.close(that.tipsIndex)
                }
                resizing = 1
            }
        });
        _DOC.unbind("mouseup").on("mouseup", function (e) {
            if (dict.resizeStart) {
                dict = {};
                _BODY.css("cursor", "");
                that.scrollPatch()
            }
            if (resizing === 2) {
                resizing = null
            }
        });
        th.unbind("click").on("click", function () {
            var othis = $(this), elemSort = othis.find(ELEM_SORT), nowType = elemSort.attr("lay-sort"), type;
            if (!elemSort[0] || resizing === 1) return resizing = 2;
            if (nowType === "asc") {
                type = "desc"
            } else if (nowType === "desc") {
                type = null
            } else {
                type = "asc"
            }
            that.sort(othis, type, null, true);
            table.query(that.key)
        });
        th.find(ELEM_SORT + " .layui-edge ").unbind("click").on("click", function (e) {
            var othis = $(this), index = othis.index(), field = othis.parents("th").eq(0).data("field");
            layui.stope(e);
            if (index === 0) {
                that.sort(field, "asc", null, true)
            } else {
                that.sort(field, "desc", null, true)
            }
            table.query(that.key)
        });
        if (!that.eventsinitIsRun) {
            that.eventsinit();
            that.eventsinitIsRun = true
        }
        that.layMain.unbind("scroll").on("scroll", function () {
            var othis = $(this), scrollLeft = othis.scrollLeft(), scrollTop = othis.scrollTop();
            that.layHeader.scrollLeft(scrollLeft);
            that.layFilter.scrollLeft(scrollLeft);
            that.layFixed.find(ELEM_BODY).scrollTop(scrollTop);
            layer.close(that.tipsIndex)
        });
        _WIN.unbind("resize").on("resize", function () {
            that.resize()
        })
    };
    Class.prototype.eventsinitIsRun = false;
    Class.prototype.eventsinit = function () {
        var that = this, options = that.config, ELEM_CELL = ".layui-table-cell",
            filter = options.elem.attr("lay-filter");
        that.layFilter.on("keyup", "[name^='filter_']", function () {
            that.page = 1;
            that.pullData(that.page, that.loading())
        });
        that.layBody.on("mouseenter", "tr", function () {
            var othis = $(this), index = othis.index();
            that.layBody.find("tr:eq(" + index + ")").addClass(ELEM_HOVER)
        });
        that.layBody.on("mouseleave", "tr", function () {
            var othis = $(this), index = othis.index();
            that.layBody.find("tr:eq(" + index + ")").removeClass(ELEM_HOVER)
        });
        that.layBody.on("click", "td div.layui-table-cell p", function () {
            var othis = $(this).parent().parent(), field = othis.data("field"), editType = othis.data("edit"),
                index = othis.parents("tr").eq(0).data("index"), data = table.getDataList(that.key)[index],
                elemCell = othis.children(ELEM_CELL);
            var options = that.config;
            layer.close(that.tipsIndex);
            if (othis.data("off")) return;
            if (editType && options.editModel == "click") {
                that.renderTdEdit(index, field);
                return
            }
            var c = that.getCols(field);
            if (!table.config.initWidth[c["type"]]) {
                if (elemCell.find(".layui-form-switch,.layui-form-checkbox")[0]) return;
                if (Math.round(elemCell.prop("scrollWidth")) > Math.round(elemCell.outerWidth())) {
                    that.tipsIndex = layer.tips(['<div class="layui-table-tips-main" style="margin-top: -' + (elemCell.height() + 16) + "px;" + function () {
                        if (options.size === "sm") {
                            return "padding: 4px 15px; font-size: 12px;"
                        }
                        if (options.size === "lg") {
                            return "padding: 14px 15px;"
                        }
                        return ""
                    }() + '">', elemCell.html(), "</div>", '<i class="layui-icon layui-table-tips-c">&#x1006;</i>'].join(""), elemCell[0], {
                        tips: [3, ""],
                        time: -1,
                        anim: -1,
                        maxWidth: device.ios || device.android ? 300 : 600,
                        isOutAnim: false,
                        skin: "layui-table-tips",
                        success: function (layero, index) {
                            layero.find(".layui-table-tips-c").on("click", function () {
                                layer.close(index)
                            })
                        }
                    })
                }
            }
        });
        that.layBody.on("dblclick", "td div.layui-table-cell p", function () {
            var othis = $(this).parent().parent(), field = othis.data("field"), editType = othis.data("edit"),
                index = othis.parents("tr").eq(0).data("index"), data = table.getDataList(that.key)[index],
                elemCell = othis.children(ELEM_CELL);
            var options = that.config;
            layer.close(that.tipsIndex);
            if (othis.data("off")) return;
            if (editType && options.editModel == "dblclick") {
                that.renderTdEdit(index, field);
                return
            }
        });
        that.layBody.on("change", "." + ELEM_EDIT, function () {
            var othis = $(this), value = this.value, field = othis.parent().data("field"),
                index = othis.parents("tr").eq(0).data("index"), data = table.getDataList(that.key)[index];
            data[field] = value;
            layui.event.call(this, MOD_NAME, "edit(" + filter + ")", {value: value, data: data, field: field})
        });
        that.layBody.on("blur", "." + ELEM_EDIT, function () {
            var templet, othis = $(this), field = othis.parent().data("field"),
                index = othis.parents("tr").eq(0).data("index"), editType = othis.parent().data("edit"),
                data = table.getDataList(that.key)[index];
            var options = that.config;
            that.eachCols(function (i, item) {
                if (item.field == field && item.templet) {
                    templet = item.templet
                }
            });
            var value = "";
            if (editType === "select") {
                var rowsField = dl.ui.table.drop.findFieldObj(options.cols[0], field);
                if (rowsField && rowsField["drop"]) {
                    var o = dl.cache.code.get(rowsField.drop);
                    value = dl.ui.table.drop.findDropLable(rowsField.drop, this.value)
                }
                othis.parent().find(ELEM_CELL + " p").html(templet ? laytpl($(templet).html() || value).render(data) : value)
            } else {
                othis.parent().find(ELEM_CELL + " p").html(templet ? laytpl($(templet).html() || this.value).render(data) : this.value)
            }
            othis.parent().data("content", this.value);
            othis.remove()
        });
        that.elem.on("click", ".layui-table-cell", function () {
            var othis = $(this), index = othis.parents("tr").eq(0).data("index"), options = that.config,
                datas = table.getDataList(that.key);
            var o = datas[index];
            if (othis.find("i.layui-tree-head").length > 0) {
                that.treeNodeOpen(o, !o[table.config.cols.isOpen]);
                that.resize()
            }
        });
        that.elem.on("click", 'input[name="' + TABLE_CHECKBOX_ID + '"]+', function () {
            var checkbox = $(this).prev(), childs = that.layBody.find('input[name="' + TABLE_CHECKBOX_ID + '"]'),
                index = checkbox.parents("tr").eq(0).data("index"), checked = checkbox[0].checked,
                obj = table.getDataList(that.config.id)[index],
                isAll = checkbox.attr("lay-filter") === "layTableAllChoose";
            if (isAll) {
                var list = table.getDataList(that.key);
                list.forEach(function (temo) {
                    if (!temo[table.config.cols.cheDisabled]) {
                        that.setCheckData(temo[table.config.indexName], checked)
                    }
                })
            } else {
                that.setCheckData(index, checked);
                if (options.isTree) {
                    var sonList = that.treeFindSonData(obj);
                    sonList.forEach(function (temo) {
                        if (!temo[table.config.cols.cheDisabled]) {
                            that.setCheckData(temo[table.config.indexName], checked)
                        }
                    });
                    var temf = function (o) {
                        if (o == null) return;
                        if (o && o.children.length > 0) {
                            var temis = true;
                            o.children.forEach(function (temo) {
                                if (!temo[table.config.cols.isCheckName]) {
                                    temis = false
                                }
                            });
                            if (temis) {
                                that.setCheckData(o[table.config.indexName], checked)
                            }
                            var temuo = that.treeFindUpData(o);
                            if (temuo) {
                                temf(temuo)
                            }
                        }
                    };
                    var uo = that.treeFindUpData(obj);
                    temf(uo)
                }
            }
            that.syncCheckAll();
            layui.event.call(this, MOD_NAME, "checkbox(" + filter + ")", {
                checked: checked,
                data: table.getDataList(that.key) ? obj || {} : {},
                type: isAll ? "all" : "one"
            });
            typeof options.onCheck === "function" && options.onCheck(obj, checked, isAll)
        });
        that.elem.on("click", 'input[name="' + TABLE_RADIO_ID + '"]+', function () {
            var checkbox = $(this).prev(), index = checkbox.parents("tr").eq(0).data("index"),
                obj = table.getDataList(that.config.id)[index];
            typeof options.onRadio === "function" && options.onRadio(obj)
        });
        that.layBody.on("click", "*[lay-event]", function () {
            var othis = $(this), index = othis.parents("tr").eq(0).data("index"),
                tr = that.layBody.find('tr[data-index="' + index + '"]'), ELEM_CLICK = "layui-table-click",
                list = table.getDataList(that.key), data = table.getDataList(that.key)[index];
            layui.event.call(this, MOD_NAME, "tool(" + filter + ")", {
                data: data,
                event: othis.attr("lay-event"),
                tr: tr,
                del: function () {
                    table.delRow(options.id, data)
                },
                update: function (fields) {
                    fields = fields || {};
                    layui.each(fields, function (key, value) {
                        if (key in data) {
                            var templet, td = tr.children('td[data-field="' + key + '"]');
                            data[key] = value;
                            that.eachCols(function (i, item2) {
                                if (item2.field == key && item2.templet) {
                                    templet = item2.templet
                                }
                            });
                            td.children(ELEM_CELL).html(templet ? laytpl($(templet).html() || value).render(data) : value);
                            td.data("content", value)
                        }
                    })
                }
            });
            tr.addClass(ELEM_CLICK).siblings("tr").removeClass(ELEM_CLICK)
        })
    };
    thisTable.config = {};
    table.init();
    exports(MOD_NAME, table)
});