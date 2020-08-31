$(function() {
    let $navBoxList = $(".navBox>a");
    let $itemBoxList = null; //这是添加的四个div

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
        // console.log("渲染菜单", power);测试

        // 根据权限显示内容
        // 权限有:userhandle|departhandle|jobhandle|customerall
        let str = ``;

        if (power.includes("userhandle")) {
            str += `
                <div class="itemBox" text="员工管理">
                    <h3>
                        <i class="iconfont icon-yuangong"></i>
                        员工管理
                    </h3>
                    <nav class="item">
                        <a href="page/userlist.html" target="iframeBox">员工列表</a>
                        <a href="page/useradd.html" target="iframeBox">新增员工</a>
                    </nav>
                </div>
            `
        }

        if (power.includes("departhandle")) {
            str += `
                <div class="itemBox" text="部门管理">
                    <h3>
                        <i class="iconfont icon-yuangong"></i>
                        部门管理
                    </h3>
                    <nav class="item">
                        <a href="page/departmentlist.html" target="iframeBox">部门列表</a>
                        <a href="page/departmentadd.html" target="iframeBox">新增部门</a>
                    </nav>
                </div>
            `
        }

        if (power.includes("jobhandle")) {
            str += `
                <div class="itemBox" text="职位管理">
                    <h3>
                        <i class="iconfont icon-yuangong"></i>
                        职位管理
                    </h3>
                    <nav class="item">
                        <a href="page/joblist.html" target="iframeBox">职位列表</a>
                        <a href="page/jobadd.html" target="iframeBox">新增职位</a>
                    </nav>
                </div>
            `
        }

        if (power.includes("customerall")) {
            str += `
                <div class="itemBox" text="客户管理">
                    <h3>
                        <i class="iconfont icon-kehuguanli"></i>
                        客户管理
                    </h3>
                    <nav class="item">
                        <a href="page/customerlist.html" target="iframeBox">我的客户</a>
                        <a href="page/customerlist.html" target="iframeBox">全部客户</a>
                        <a href="page/customeradd.html" target="iframeBox">新增客户</a>
                    </nav>
                </div>
            `
        }

        // 放到页面上
        $(".menuBox").html(str);

        $itemBoxList = $(".menuBox").find(".itemBox");
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
            // console.log(power);权限
            // console.log(baseInfo);信息

        // 三目运算法，baseInfo.code===0，就走baseInfo = baseInfo.data，否则就是null
        baseInfo.code === 0 ? baseInfo = baseInfo.data : null;

        power.code === 0 ? power = power.power : null;

        $plan.fire(power, baseInfo); //发布
    }

    // 控制组织结构和客户管理点击切换
    function handGroup(index) {
        // 两组,$group1与$group2
        let $group1 = $itemBoxList.filter((_, item) => {
            // $(item)是为了吧item转换成JQ对象，本来是DOM对象
            let text = $(item).attr("text");
            // console.log(text);
            return text === "客户管理"
        });

        let $group2 = $itemBoxList.filter((_, item) => {
            // $(item)是为了吧item转换成JQ对象，本来是DOM对象
            let text = $(item).attr("text");
            // console.log(text);
            return /^(员工管理|部门管理|职位管理)/.test(text);
        });
        // 控制显示哪一组
        if (index === 0) {
            $group1.css("display", "block");
            $group2.css("display", "none");
        } else if (index === 1) {
            $group1.css("display", "none");
            $group2.css("display", "block");
        }
    }

    // 实现tab选项卡功能
    $plan.add(power => {
        // 控制默认显示哪一个
        let initIndex = power.includes("customer") ? 0 : 1;
        $navBoxList.eq(initIndex).addClass("active").siblings().removeClass("active");
        handGroup(initIndex);

        // 通过用户权限，限制用户访问内容
        $navBoxList.click(function() {
            let index = $(this).index();
            let text = $(this).html().trim();

            if ((text === "客户管理") && !/customerall/.test(power) || (text === "组织结构") && !/userhandle|departhandle|jobhandle/.test(power)) {
                alert("你没有权限访问~~");
                return;
            }

            if (index === initIndex) {
                return;
            }

            $(this).addClass("active").siblings().removeClass("active");
            handGroup(index);

            initIndex = index;
        });
    })

    // 控制默认的iframe的src
    $plan.add(power => {
        let url = "page/customerlist.html";
        if (power.includes("customerall")) {
            $(".iframeBox").attr("src", url);
        }
    })
})