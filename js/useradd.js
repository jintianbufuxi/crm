$(function() {
    // 初始化部门和职务数据
    initDeptAndJob();
    async function initDeptAndJob() {
        let departmentData = await queryDepart(); //部门
        let jobData = await queryJob(); //职务
        // console.log(departmentData);测试
        // console.log(jobData);测试

        if (departmentData.code === 0) {
            departmentData = departmentData.data;
            let str = ``;
            departmentData.forEach(item => {
                str += `<option value="${item.id}">${item.name}</option>`;
            })
            $(".userdepartment").html(str);
        }

        if (jobData.code === 0) {
            jobData = jobData.data;
            let str = ``;
            jobData.forEach(item => {
                str += `<option value="${item.id}">${item.name}</option>`;
            })
            $(".userjob").html(str);
        }
    };

    // 鼠标移开，进行校验
    // 姓名
    function checkname() {
        let val = $(".username").val().trim();
        if (val.length === 0) {
            //说明名字没写
            $(".spanusername").html("姓名必须写");
            return false;
        }
        if (!/^[\u4e00-\u9fa5]{2,10}$/.test(val)) {
            $(".spanusername").html("姓名必须是2-10个汉字~~");
            return false;
        }
        // 说明姓名没问题
        $(".spanusername").html("姓名ok");
        return true;
    };
    // 邮箱
    function checkemail() {
        let val = $(".useremail").val().trim();
        if (val.length === 0) {
            //说明邮箱没写
            $(".spanuseremail").html("邮箱必须写");
            return false;
        }
        if (!/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(val)) {
            $(".spanuseremail").html("请填写正确的邮箱~")
            return false;
        }
        // 说明姓名没问题
        $(".spanuseremail").html("邮箱ok");
        return true;
    };

    // 手机号
    function checkphone() {
        let val = $(".userphone").val().trim();
        if (val.length === 0) {
            //说明邮箱没写
            $(".spanuserphone").html("你不会没有电话吧！不会吧不会吧");
            return false;
        }
        if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(val)) {
            // $(".spanuserphone").html("臭狗你这电话号打不通亲妈必死~")
            $(".spanuserphone").html("你这电话怎么能打通的啊~")
            return false;
        }
        // 说明姓名没问题
        $(".spanuserphone").html("电话ok");
        return true;
    };

    // 数据提交
    $(".submit").click(async function() {
        if (!checkname() || !checkemail() || !checkphone()) {
            // 说明姓名，邮箱，手机号有错误的
            alert("仔细看看上面的提示，你的信息不行~");
            return;
        }

        // 信息提交通过，然后获取数据
        let params = {
            name: $(".username").val().trim(),
            sex: $("#man").prop("checked") ? 0 : 1, //0是男，1是女
            email: $(".useremail").val().trim(),
            phone: $(".userphone").val().trim(),
            departmentId: $(".userdepartment").val(),
            jobId: $(".userjob").val(),
            desc: $(".userdesc").val().trim()
        };
        // console.log(params);测试，看看能不能获取到提交数据

        // 实现新增
        let result = await axios.post("/user/add", params);
        if (result.code === 0) {
            alert("添加新员工成功!!");
            window.location.href = "userlist.html";
            return;
        };
        alert("网络不行，没有成功添加员工")
    })
})