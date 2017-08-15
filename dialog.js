//弹窗插件 add by Li at 2016-11-29

var filter = require("sys.pipe");

exports.Lang = {
    cn:{
        title:"提示",
        okText:"确定",
        cancelText:"取消"
    },
    en:{
        title:"Notification",
        okText:"Confirm",
        cancelText:"Cancel"
    },
    pt:{
        title:"Aviso",
        okText:"Confirmar",
        cancelText:"Cancelar"
    }
};

var model = exports.model = {
    title: "",
    text: "",
    url: "",
    okText: "",
    cancelText: "",
    hasClose: false,
    hasOk: true,
    hasCancel : false,
    onOk: null,
    onCancel: null,
    onButton: null
};

exports.onRenderBefore = function() {
    this.currentLang = localStorage.lang ? this.Lang[localStorage.lang] : this.Lang.cn;
    Object.assign(model, this.currentLang);
};

exports.mediaStyle = true;
exports.timer = null;

//点击确定按钮
exports.pickOk = function(){
    exports.timer && window.clearTimeout(exports.timer);
    exports.hide();
    model.onOk && model.onOk();
};

//点击取消按钮
exports.pickCancel = function(){
    exports.hide();
    model.onCancel && model.onCancel();
};

//点击其他按钮
exports.pickButton = function(index){
    exports.hide();
    model.onButton && model.onButton(index);
};


//警告框
exports.alert = function(ops){
    if(typeof ops!="object") {
        ops = {text: ops};
        for(var i=1; i<arguments.length; i++){
            var v = arguments[i];
            typeof v == "number" && (ops.timeout = v);
            typeof v == "function" && (ops.onOk = v);
        }
    }
    ops.hasCancel = false;
    exports.showDialog(ops);
};

//确认框
exports.confirm = function(ops){
    if(typeof ops!="object"){
        ops = {
            text: arguments[0],
            onOk: arguments[1],
            onCancel: arguments[2]
        };
    }
    ops.hasCancel = true;
    exports.showDialog(ops);
};

//显示对话框
exports.showDialog = function(ops){
    //filter.mergeObj(exports.model, ops);
    Object.assign(exports.model, ops);
    model = exports.model;
    model.onOk = ops.onOk || null;
    model.onCancel = ops.onCancel || null;
    exports.render();
    exports.show();

    if(ops.timeout>0){
        exports.timer = window.setTimeout(exports.pickOk, ops.timeout);
    }
};