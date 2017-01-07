
(function () {

    /*书写用户名*/
    var $userName = $("#user-name");
    var name = decodeURIComponent(location.search.replace("?", ""));
    $userName.html(name);

    /*写博文*/
    var $writeBlog = $("#write-blog");
    $writeBlog.click(function (e) {
        e.preventDefault();
        open("articleDetails.html?" + name, "_self");
    });

    //初始化界面
    var $lists = $("#blog-lists");
    $.post("/apis/article", {
        name: name
    }).done(function (data) {
        console.log(data.message);
        $lists.empty();
        if (data.state == 1 && data.message.length) {
            for (var i = 0; i < data.message.length; i++) {
                var itemTitle = data.message[i]["title"];
                var itemTime = data.message[i]["time"];
                var itemArticle = data.message[i]["text"];
                var li = "<li class='list-group-item a" + i + "'><a href='#'>" + itemTitle + "</a><span>" + itemTime + "</span></li>"

                $lists.append(li);

               
            }
            for (var j = 0; j < data.message.length; j++) {
                (function (j) {
                    $(".a" + j).on("click", function () {
                        $lists.empty();
                        var $text = $("<textarea></textarea>")
                            .attr("id", "article")
                            .html(itemArticle);
                        $("main").append($text);
                        $("#blog-title").find("h1").html(data.message[j]["title"]);
                        $writeBlog.hide();
                    });
                })(j);
            }

        }
    }).fail(function () {
        alert("查询失败");
    })
})();