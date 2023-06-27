layui.define(["jquery", "cropper"], function (exports) {
    var $ = layui.jquery;
    var obj = {
        render: function (e) {
            var self = this, elem = e.elem, saveW = e.saveW, saveH = e.saveH, mark = e.mark, area = e.area, url = e.url,
                done = e.done;
            elem_this = "#" + elem.attr("id") + "_croppers";
            id = elem_this.replace("#", "");
            elem_this = elem_this + ".croppersbox";
            var html = '<div class="layui-fluid croppersbox" id=\'' + id + '\' style="display: none;padding-top: 10px;">\n' + '    <div class="layui-form-item">\n' + '        <div class="layui-input-inline layui-btn-container" style="width: auto;">\n' + "            <label for='" + id + '_cropper_avatarImgUpload\' class="layui-btn layui-btn-primary">\n' + '                <i class="layui-icon">&#xe67c;</i>上传\n' + "            </label>\n" + '            <input class="layui-upload-file" id=\'' + id + '_cropper_avatarImgUpload\' type="file" value="选择图片" name="file">\n' + "        </div>\n" + "        <div class=\"layui-form-mid layui-word-aux\" style='float:left;'> 300x300px,大小2M</div>\n" + "    </div>\n" + '    <div class="layui-row layui-col-space15">\n' + '        <div class="layui-col-xs8">\n' + ' <div class="readyimg" style="height:400px;background-color: rgb(247, 247, 247);">\n' + '                <img src="" >\n' + "            </div>\n" + "        </div>\n" + '        <div class="layui-col-xs3">\n' + '            <div class="img-preview" style="border:1px solid #1890ff;width:200px;height:200px;overflow:hidden">\n' + "            </div>\n" + "        </div>\n" + "    </div>\n" + '    <div class="layui-row layui-col-space15">\n' + '        <div class="layui-col-xs9">\n' + '            <div class="layui-row">\n' + '                <div class="layui-col-xs6">\n' + '                    <button type="button" class="layui-btn layui-btn-normal layui-icon layui-icon-left" cropper-event="rotate" data-option="-15" title="Rotate -90 degrees"> 向左旋转</button>\n' + '                    <button type="button" class="layui-btn layui-btn-normal layui-icon layui-icon-right" cropper-event="rotate" data-option="15" title="Rotate 90 degrees"> 向右旋转</button>\n' + "                </div>\n" + '                <div class="layui-col-xs6" style="text-align: right;">\n' + '                    <button type="button" class="layui-btn layui-btn-normal layui-icon layui-icon-snowflake\n" cropper-event="move" title="移动"></button>\n' + '                    <button type="button" class="layui-btn layui-btn-normal layui-icon layui-icon-addition" cropper-event="large" title="放大图片"></button>\n' + '                    <button type="button" class="layui-btn layui-btn-normal layui-icon layui-icon-subtraction\n" cropper-event="small" title="缩小图片"></button>\n' + '                    <button type="button" class="layui-btn layui-btn-normal layui-icon layui-icon-refresh" cropper-event="reset" title="重置图片"></button>\n' + "                </div>\n" + "            </div>\n" + "        </div>\n" + '        <div class="layui-col-xs3">\n' + '            <button class="layui-btn  layui-btn-danger layui-btn-fluid" cropper-event="confirmSave" type="button"> 保存修改</button>\n' + "        </div>\n" + "    </div>\n" + "\n" + "</div>";
            if ($(elem_this).length == 0) $("body").append(html);
            layui.form.render();
            var content = $(elem_this), image = $(elem_this + " .readyimg img"), preview = elem_this + " .img-preview",
                options = {aspectRatio: mark, preview: preview, viewMode: 1};
            elem.on("click", function () {
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.full(index);
                winHeight = $(document).height();
                height = winHeight >= 600 ? "600px" : "auto";
                areaWH = height ? [area, height] : area;
                layui.layer.open({
                    type: 1,
                    title: "裁剪",
                    content: content,
                    maxmin: true,
                    area: areaWH,
                    move: true,
                    shadeClose: true,
                    scoll: true,
                    resize: true,
                    success: function (layero) {
                        image.cropper(options)
                    },
                    cancel: function (index) {
                        content.css("display", "none");
                        image.cropper("destroy");
                        layer.close(index)
                    },
                    end: function () {
                        content.css("display", "none");
                        image.cropper("destroy");
                        layer.close(index)
                    },
                    full: function (layero, index) {
                    },
                    restore: function (layero, index) {
                    }
                })
            });
            $(elem_this + " .layui-btn").on("click", function () {
                var event = $(this).attr("cropper-event");
                var src = $(this).parents(".croppersbox").find(".readyimg img").attr("src");
                if (event === "confirmSave") {
                    if (!src) return false;
                    image.cropper("getCroppedCanvas", {width: saveW, height: saveH}).toBlob(function (blob) {
                        var formData = new FormData;
                        formData.append("file", blob, "fun-avatar.png");
                        $.ajax({
                            method: "post",
                            url: url,
                            data: formData,
                            processData: false,
                            contentType: false,
                            success: function (result) {
                                if (result.code > 0) {
                                    layer.closeAll("page");
                                    $(".croppersbox").hide()
                                }
                                return done(result)
                            }
                        })
                    });
                    return false
                } else if (event === "rotate") {
                    if (!src) return false;
                    var option = $(this).data("option");
                    image.cropper("rotate", option)
                } else if (event === "reset") {
                    if (!src) return false;
                    image.cropper("reset")
                } else if (event === "large") {
                    if (!src) return false;
                    image.cropper("zoom", .1)
                } else if (event === "small") {
                    if (!src) return false;
                    image.cropper("zoom", -.1)
                } else if (event === "setDragMode") {
                    if (!src) return false;
                    image.cropper("setDragMode", "move")
                } else if (event === "setDragMode1") {
                    if (!src) return false;
                    image.cropper("setDragMode", "crop")
                }
                var file = $(this).next("input[name='file']");
                file.change(function () {
                    var r = new FileReader;
                    var f = this.files[0];
                    r.readAsDataURL(f);
                    r.onload = function (e) {
                        image.cropper("destroy").attr("src", this.result).cropper(options)
                    }
                })
            })
        }
    };
    exports("croppers", obj)
});