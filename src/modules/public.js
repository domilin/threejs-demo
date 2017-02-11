/**
 * 作者：周双龙
 * 时间：2016/12/9
 * 描述：公共调用函数
 */


const loadImg = function (arg) {
    //创建canvas
    var imgTextrue = document.createElement('canvas');
    imgTextrue.width = arg.width;
    imgTextrue.height = arg.height;
    var imgContext = imgTextrue.getContext('2d');

    //创建img对象
    var img = new Image();
    img.src = arg.src;
    img.onload = function () {
        imgContext.drawImage(img, 0, 0);
        if (threeTextrue) threeTextrue.needsUpdate = true;
    };

    //创建three材质贴图
    var threeTextrue = new THREE.Texture(imgTextrue);

    //创建材质
    var planeGeometry = new THREE.PlaneGeometry(arg.width, arg.height, 1, 1);
    var planeMeterial = new THREE.MeshBasicMaterial({
        map: threeTextrue,
        //opacity: 0.5,
        transparent: true,
        overdraw: 0.5
    });

    return new THREE.Mesh(planeGeometry, planeMeterial);
};

const loadVideo = function (arg) {
    var videoTextrue = document.createElement('canvas');
    videoTextrue.width = arg.width;
    videoTextrue.height = arg.height;
    var videoContext = videoTextrue.getContext('2d');

    var threeTextrue = new THREE.Texture(videoTextrue);

    var planeGeometry = new THREE.PlaneGeometry(arg.width, arg.height, 1, 1);
    var planeMeterial = new THREE.MeshBasicMaterial({
        map: threeTextrue,
        transparent: true,
        overdraw: 0.5
    });

    var video = document.getElementById(arg.videoId);
    if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
        videoContext.drawImage( video, 0, 0 );
        if ( videoTextrue ) videoTextrue.needsUpdate = true;
    }

    return new THREE.Mesh(planeGeometry, planeMeterial);
};

const plane = function (arg) {
    var canvasTextrue = document.createElement('canvas');
    var canvasContext = canvasTextrue.getContext('2d'),
        gradient = canvasContext.createLinearGradient(0, 0, arg.width, arg.height);
    gradient.addColorStop(0, '#F2F2F2');
    gradient.addColorStop(1, '#000000');
    canvasContext.fillStyle = gradient;
    canvasContext.fillRect(0, 0, arg.width, arg.height);

    //创建three材质贴图
    var threeTextrue = new THREE.Texture(canvasTextrue);
    if (threeTextrue) threeTextrue.needsUpdate = true;

    var planeGeometry = new THREE.PlaneGeometry(arg.width, arg.height, 1, 1);
    var planeMeterial = new THREE.MeshBasicMaterial({
        map: threeTextrue,
        overdraw: 0.5
    });
    return new THREE.Mesh(planeGeometry, planeMeterial);
};

const scrollFunc = function (event, upFn, downFn) {
    event = event || window.event;
    if (event.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件
        if (event.wheelDelta > 0) { //当滑轮向上滚动时
            upFn.call(window);
        }
        if (event.wheelDelta < 0) { //当滑轮向下滚动时
            downFn.call(window);
        }
    } else if (event.detail) {  //Firefox滑轮事件
        if (e.detail > 0) { //当滑轮向上滚动时
            upFn.call(window);
        }
        if (event.detail < 0) { //当滑轮向下滚动时
            downFn.call(window);
        }
    }
};

export {scrollFunc, loadImg, loadVideo, plane};