// 对axios 进行二次封装
// 配置请求的基本路径
// localhost和127.0.0.1之间存在跨域问题
axios.defaults.baseURL = "http://127.0.0.1:8888";
// axios.defaults.baseURL = "http://localhost:8888";

//配置为true 后台的请求都会带上cookie
axios.defaults.withCredentials = true;

// 对数据以表单的形式传给服务器
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';

// 还是以表单的形式扔给服务器，数据格式为：name=z3&age=4
axios.defaults.transformRequest = function(data) {
    if (!data) {
        // 不传给服务器数据
        return data;
    };
    let result = ``; //注意符号，是``，而不是''
    for (let attr in data) {
        if (!data.hasOwnProperty(attr)) {
            break
        };
        result += `&${attr}=${data[attr]}`; //注意符号，是``，而不是''
    }
    return result.substring(1);
}

// 配置请求拦截器（里面什么都没有其实,所以可以不写）
// axios.interceptors.requset.use(config => {
//     return config;
// })

// 配置响应拦截器
axios.interceptors.response.use(response => {
    // 这是成功返回的数据
    return response.data;
}, reason => {
    // 返回错误，这是响应拦截器，我们在这里统一处理错误
    // 比如路径错误404......
    // console.log("-------------"); //其实并没有什么用，只是看起来美观，下同
    // console.dir(reason); //这是失败的原因
    // console.log("-------------");

    // 创建一个失败的promise
    // 失败就返回一个失败的promise
    // return Promise.reject(reason);

    // 不过一般都是404，所以我们专门写一个方法来应对404
    if (reason.response) {
        switch (String(reason.response.status)) {
            case "404":
                alert("当前请求的地址不存在!!")
                break;
            default: //这是其他情况
                break;
        }
    }
    // 创建一个失败的promise
    return Promise.reject(reason);
})