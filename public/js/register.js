
(function () {

    var $register = $("#register-btn");
    var $name = $("#registerName");
    var $pwd = $("#registerPwd");
    var $conPwd = $("#confirm-pwd");
    var $info = $(".connection-info");


    $register.click(function (e) {
        e.preventDefault();

        if ($pwd.val() != $conPwd.val()) {
            alert("确认密码不一致");
            return;
        }

        $info.html("正在连接服务器...");

        $.post("/apis/register", {
            name: $name.val(),
            pwd: md5($pwd.val())
        }).done(function (data) {
            console.log(data);
            switch (data.state) {
                case 1:
                    $info.html("注册成功");
                    setTimeout(function () {
                        open("index.html","_self");
                    },500);
                    break;
                case 1062:
                    $info.html("用户名已占用");
                    break;
                default:
                    $info.html("注册失败");
                    break;
            }
        }).fail(function (err) {
            console.log(err);
            $info.html("无法连接服务器");
        });
    });

})();