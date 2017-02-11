/**
 * 作者：周双龙
 * 时间：2016/12/9
 * 描述：threejs
 */

import './sass/threejs.scss';

import {scrollFunc, loadImg, loadVideo, plane} from './modules/public';

var config = {
    wWidth: window.innerWidth,
    wHeight: window.innerHeight
};

/*var imgSrc = '../images',
    videoSrc = '../video';*/
var imgSrc = './src/images',
    videoSrc = './src/video';

$(function () {

    //插入一个包含场景的div元素
    $('body').html('<div id="renderElement"></div>' +
        '<div class="mask"></div>' +
        '<div class="video-wrap">' +
        '<a class="video-close">×</a>' +
        '<div class="video-con">' +
        /*'<video class="video" id="video" webkit-playsinline"><source src="' + videoSrc + '/baby.mp4" type="video/mp4"></video>' +*/
        '<iframe src="http://www.zhoushuanglong.cn/example/merrychristmas/index.html" class="iframe" id="iframe" allowtransparency="true" style="background-color=transparent" frameborder="0" scrolling="no"></iframe>' +
        '</div>' +
        '</div>');


    //关闭视频
    var $close = $('a.video-close'),
        $mask = $('div.mask'),
        $videoWrap = $('div.video-wrap');
        //$video = $('#video');
    $close.click(function () {
        $mask.hide();
        $videoWrap.hide();
        //$video[0].pause();
        return false;
    });
    //打开视频
    $('body').click(function () {
        $mask.show();
        $videoWrap.show();
        //$video[0].play()
    });


    //创建一个场景scene
    var scene = new THREE.Scene();

    //创建一个透视摄像机PerspectiveCamera
    var camera = new THREE.PerspectiveCamera(45, config.wWidth / config.wHeight, 0.1, 3500);
    camera.position.set(0, 0, 50);

    //创建一个webgl渲染器
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0X999999, 1.0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(config.wWidth, config.wHeight);


    //创建一个球体
    var sphereGeometry = new THREE.SphereGeometry(100, 20, 20),
        sphereTexture = new THREE.ImageUtils.loadTexture(imgSrc + '/tv.png'),
        sphereMaterial = new THREE.MeshBasicMaterial({
            map: sphereTexture
        }),
        sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, 0, 0);
    sphere.castShadow = true;
    scene.add(sphere);

    //创建主墙面
    var wallMain = loadImg({
        width: 2000,
        height: 1266,
        src: imgSrc + '/wall-main.jpg'
    });
    wallMain.position.set(0, 0, -1000);
    scene.add(wallMain);

    //创建顶部墙面
    var wallTop = plane({
        width: 2000,
        height: 2000,
        color: 0XE6E6E6
    });
    wallTop.rotation.x = 0.5 * Math.PI;
    wallTop.position.set(0, 1266 / 2, 0);
    scene.add(wallTop);

    //创建底部墙面
    var wallBottom = plane({
        width: 2000,
        height: 2000,
        color: 0XE6E6E6
    });
    wallBottom.rotation.x = -0.5 * Math.PI;
    wallBottom.position.set(0, -1266 / 2, 0);
    scene.add(wallBottom);

    //创建左侧墙面
    var wallLeft = plane({
        width: 2000,
        height: 1266,
        color: 0XE6E6E6
    });
    wallLeft.rotation.y = 0.5 * Math.PI;
    wallLeft.position.set(-2000 / 2, 0, 0);
    scene.add(wallLeft);

    //创建右侧墙面
    var wallRight = plane({
        width: 2000,
        height: 1266,
        color: 0XE6E6E6
    });
    wallRight.rotation.y = -0.5 * Math.PI;
    wallRight.position.set(2000 / 2, 0, 0);
    scene.add(wallRight);

    //加载左侧照片
    var photoFrameLeft = loadImg({
        width: 599,
        height: 814,
        src: imgSrc + '/photo-frame-left.png'
    });
    photoFrameLeft.rotation.y = 0.5 * Math.PI;
    photoFrameLeft.position.set(-2000 / 2 + 10, -100, -400);
    scene.add(photoFrameLeft);

    //加载左侧照片
    var photoFrameRight = loadImg({
        width: 599,
        height: 814,
        src: imgSrc + '/photo-frame-right.png'
    });
    photoFrameRight.rotation.y = -0.5 * Math.PI;
    photoFrameRight.position.set(2000 / 2 - 10, -100, -400);
    scene.add(photoFrameRight);

    //创建电视背景
    var videoBg = loadImg({
        width: 750,
        height: 457,
        src: imgSrc + '/tv.png'
    });
    videoBg.position.set(0, 300, -990);
    scene.add(videoBg);

    //加载视频
    /*var video = loadVideo({
     width: 720,
     height: 480,
     videoId: 'video'
     });
     video.position.set(0, 300, -900);
     scene.add(video);*/


    $('#renderElement').html(renderer.domElement);


    //鼠标事件
    var mouseX = 0;
    var mouseY = 0;
    var windowHalfX = config.wWidth / 2;
    var windowHalfY = config.wHeight / 2;
    $(document).on('mousemove', function (event) {
        mouseX = ( event.clientX - windowHalfX ) * 0.5;
        mouseY = ( event.clientY - windowHalfY ) * 0.5;
    });
    $(document).on('mousewheel', function (event) {
        var cameraZ = camera.position.z;
        scrollFunc(event, function () {
            if (cameraZ <= 1500) {
                camera.position.z += 20;
            }
        }, function () {
            console.log(cameraZ);
            if (cameraZ >= 50) {
                camera.position.z -= 20;
            }
        })
    });

    //镜头拉近动画
    cameraAnimation();
    function cameraAnimation() {
        var animate = requestAnimationFrame(cameraAnimation);
        if (camera.position.z < 1500) {
            camera.position.z += 10;
        } else {
            cancelAnimationFrame(animate);
        }
    }


    //元素交互
    var mouse = new THREE.Vector2();
    document.addEventListener('mousedown', onDocumentMouseMove, false);
    function onDocumentMouseMove(event) {
        event.preventDefault();
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
    }

    var raycaster = new THREE.Raycaster(),
        INTERSECTED;

    render();
    function render() {
        requestAnimationFrame(render);
        camera.position.x += ( mouseX - camera.position.x ) * 0.05;
        camera.position.y += ( -mouseY - camera.position.y ) * 0.05;


        /*raycaster.setFromCamera( mouse, camera );
         var intersects = raycaster.intersectObjects( scene.children );
         if ( intersects.length > 0 ) {
         if ( INTERSECTED != intersects[ 0 ].object ) {
         if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
         INTERSECTED = intersects[ 0 ].object;
         console.log(INTERSECTED);
         INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
         INTERSECTED.material.emissive.setHex( 0xff0000 );
         }
         } else {
         if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
         INTERSECTED = null;
         }*/


        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }
});
