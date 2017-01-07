
(function () {
    /*跳转界面*/
    var $registerbtn = $("#register-btn");
    $registerbtn.click(function () {
        open("register.html","_self");
    });


    /*登录*/
    var $loginBtn = $("#login-btn");
    var $name = $("#loginName");
    var $pwd = $("#loginPwd");
    var $info = $(".connection-info");

    $loginBtn.click(function (e) {
        e.preventDefault();

        $info.html("正在连接服务器...");
        $.post("/apis/login", {
            name: $name.val(),
            pwd: md5($pwd.val())
        }).done(function (data) {
            switch (data.state) {
                case 1:
                    $info.html("登录成功");
                    setTimeout(function () {
                        open("articlePage.html?"+encodeURIComponent($name.val()),"_self");
                    },500);
                    break;
                case 5:
                case 6:
                    $info.html("用户名或密码错误!");
                    break;
                default:
                    $info.html("登录失败");
            }
        }).fail(function () {
            $info.html("无法连接服务器");
        })
    })
})();