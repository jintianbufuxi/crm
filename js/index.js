$(function() {
    // 先调用这个方法，下面记得用function，否则会undefine
    init();

    // 用于实现发布订阅
    let $plan = $.Callbacks();

    // 订阅
    $plan.add((_, baseInfo) => {
        // 渲染用户信息，实现退出登录
        // console.log("渲染用户信息，实现退出登录", baseInfo);
        // baseInfo.name是当前用户名，要么显示这个，要么显示空(没有登录的情况)
        $(".baseBox>span").html(`你好,${baseInfo.name || ''}`);

        // 退出登录
        $(".baseBox>a").click(async function() {
            let result = await axios.get("/user/signout");
            if (result.code == 0) {
                // 退出登录成功
                window.location.href = "login.html";
                return;
            }
            // 退出登录失败
            alert("网络的问题，这波绝对不是我的锅~~~");
        })
    });

    // 发布
    $plan.add((power) => {
        // 渲染菜单
        console.log("渲染菜单", power);
    });

    async function init() {
        // 判断当前用户有没有登录
        let result = await axios.get("/user/login");
        // console.log(result);测试
        if (result.code != 0) {
            // 说明没有登录
            alert("你还没有登录，请先登录......");
            window.location.href = "login.html";
            return;
        }
        // 这是登录了
        let [power, baseInfo] = await axios.all([
            axios.get("/user/power"), //获取用户权限
            axios.get("/user/info") //获取用户信息
        ])
        console.log(power);
        console.log(baseInfo);

        // 三目运算法，baseInfo.code===0，就走baseInfo = baseInfo.data，否则就是null
        baseInfo.code === 0 ? baseInfo = baseInfo.data : null;

        $plan.fire(power, baseInfo); //发布
    }
})