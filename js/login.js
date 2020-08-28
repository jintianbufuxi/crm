$(function() {
    // 登录功能
    $(".submit").click(async function(e) {
        //用到了await,就需要在await最近的函数前加上async
        // await不能单独使用，需要配合async
        // 但是async可以单独使用
        let account = $(".userName").val().trim();
        let password = $(".userPass").val().trim();

        if (account === "" || password === "") {
            alert("账号密码不能为空!");
            return;
        }
        // 可以通过正则自己校验你的用户名和密码的规则
        password = md5(password);
        // console.log((account, password)); 测试用

        // 发出ajax请求
        // axios.post("/user/login", {
        //     account,
        //     password
        // }).then(res => {//then和catch是为了获取错误的结果
        //     console.log(res);
        // }).catch(err => {
        //     console.log(err);
        // })

        // try和catch是async和await中获取错误结果的方法
        // try {
        //     let res = await axios.post("/user/login123", {
        //         account,
        //         password
        //     })
        // } catch (e) {
        //     console.log(e);
        // }

        let res = await axios.post("/user/login", {
            account,
            password
        });
        // console.log(res);
        if (parseInt(res.code) === 0) {
            alert("登录成功!");
            window.location.href = "index.html";
            return;
        }
        alert("用户名或密码错误了")
    })
})