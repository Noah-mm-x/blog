

(function () {

    var $title = $("#title");
    var $article = $("#article");
    var $submit = $("#submit");
    var $info = $(".info");

    /*书写用户名*/
    var $userName = $("#user-name");
    var name = decodeURIComponent(location.search.replace("?", ""));
    $userName.html(name);


    $submit.click(function (e) {
        e.preventDefault();

        var currentTime=new Date();
        var year=currentTime.getFullYear();
        var month=currentTime.getMonth()+1;
        var day=currentTime.getDate();
        var time=year+"-"+month+"-"+day;
        $info.html("正在上传...");

        if ($title.val() == "" || $article.val() == "") {
            $info.html("不能为空");
        }
        $.post("/apis/update", {
            userId: name,
            title: $title.val(),
            article: $article.val(),
            curTime:time.toString()
        }).done(function (data) {
            console.log(data);
            if (data.state == 1) {
                $info.html("保存成功");
                open("articlePage.html?"+name, "_self");
            } else {
                $info.html("保存失败");
                open("articlePage.html?"+name);
            }
        }).fail(function () {
            $info.html("保存失败");
        })
    });

})();