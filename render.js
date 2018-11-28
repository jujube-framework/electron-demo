var fs = require("fs")
var path = require("path")
var template = require('art-template');
window.$ = window.jQuery = require('jquery');

template.defaults.imports.isEmpty = function(arr){
    return typeof(arr)=='undefined' || arr==null || arr.length <=0 ? true : false;
}
template.defaults.imports.isNotEmpty = function(arr){
    return typeof(arr)=='undefined' || arr==null || arr.length <=0 ? false : true;
}

function getSubData(subIdSelector, validValName) {
    var t = $(subIdSelector)
    var data = {};
    var vn = optional(t.find(".valName"))
    if (validValName && !vn) {
        return data
    }
    if (vn) data.valName = vn;
    data.className = optional(t.find(".className"))
    data.classComment = optional(t.find(".classComment"))
    data.fields = optional(t.find(".field"))
    if (data.fields) data.fields = data.fields.split("\n")
    data.comments = optional(t.find(".comment"))
    if (data.comments) data.comments = data.comments.split("\n")
    data.commentsExt = optional(t.find(".commentExt"))
    if (data.commentsExt) data.commentsExt = data.commentsExt.split("\n")
    return data;
}

function optional(ele) {
    return ele.length > 0 ? ele.val().trim() : null
}

// 递归创建目录 同步方法
function mkdirsSync(dirname, mode) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname), mode)) {
            fs.mkdirSync(dirname, mode);
            return true;
        }
    }
}

function gen() {
    var data = {};
    var packagePath = $("#main .packagePath").val();
    if (!packagePath) {
        alert("难道你是误点击？");
        return;
    }
    mkdirsSync(packagePath, 0755)   //先创建目录

    var data = getSubData("#main", false)
    var tmp =  packagePath.split("com\\")[1];
    data.packageName = "com." + tmp.replace(/\\/g,'.')
    data.extFields = [];
    var td = getSubData("#sub1", true);
    if (td.valName) {
        td.packageName = data.packageName;
        data.extFields.push(td)
    }

    td = getSubData("#sub2", true);
    if (td.valName) {
        td.packageName = data.packageName;
        data.extFields.push(td)
    }

    //先生成sub
    if (data.extFields.length > 0) {
        data.extFields.forEach(e => {
            var content = template(path.join(__dirname ,  '/templates/class.art'), e);
            //var dst = getJavaFilePath(packagePath, e.className);
            var dst = path.join(packagePath,e.className+".java")            
            fs.writeFileSync(dst, content, "utf-8")
            console.log("已生成文件："+dst)
            console.log("内容："+content)
        })
    }

    //生成主类
    if(data.className){
        var dst = path.join(packagePath,data.className+".java")
        var content = template(path.join(__dirname , '/templates/class.art'), data);
        fs.writeFileSync(dst, content, "utf-8")
        console.log("已生成文件："+dst)
        console.log("内容："+content)
    }
}

$("#gen").click(function () {
    gen()
})
