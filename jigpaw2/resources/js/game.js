/**/
var lv = [{"r":4,"c":3},{"r":5,"c":4},{"r":6,"c":5}];
var pic = {"w":398,"h":498};
var STATE_START = 0,STATE_RUNNING = 1,STATE_OVER = 2;
var gameState = STATE_START;
var imgPaths = ['./resources/images/1.jpg','./resources/images/2.jpg','./resources/images/3.jpg'];
var imgPath = imgPaths[0];
var timer = {'instance':null,'time':10000,'TIME':60000,'interval':80};
var dragCount = 0;

$(document).ready(function(){	
	init();
})
/*初始化*/
function init(){
	initLeftP();
	initRightP();
	initConfigP();
    dragCount = 0;
}
/*初始化左侧面板*/
function initLeftP(){
	$('#leftP').empty();
	var html = '';
    var index = parseInt(Math.random()*imgPaths.length);
    imgPath = imgPaths[index];
	html += '<img id="origin_img" src="'+imgPath+'">';
	$('#leftP').html(html);
}
/*初始化右侧面板*/
function initRightP(){
	$('#rightP').empty();
}
/*初始化底侧面板*/
function initConfigP(){
	$('#startBtn').off('click');
	$('#startBtn').on('click',function(e){
		start();
	});
    $('#configBtn').on('click',function(e){
        if(gameState == STATE_START){
            initLeftP();
        }
    });
    timer.time = timer.TIME;
    var txt = formatTime(timer.time);
    $('#timer').text(txt);
}
/*开始*/
function start(){
	if(gameState == STATE_START){
        //计时器
        startTimer();
        //gui设置
		$('#leftP').empty();
		$('#rightP').empty();
		var html = '';
		//右侧面板设置
		var r = lv[0].r,c = lv[0].c;
		//图块的尺寸
		var w = parseInt(pic.w/c),h = parseInt(pic.h/r);
		for(var i = 0; i < r; i++){
			for(var j = 0; j < c; j++){
				var left = 0,top = 0;
				left = j*w;
				top = i*h;
				html += '<div id="r_'+(i+''+j)
                    +'" class="right-img-td" style="position:absolute;left:'
                    +left+'px;top:'+top+'px;width:'+w+'px;height:'+h+'px;">'
					+'</div>';
			}
		}
		$('#rightP').html(html);
		//设置右侧图块
		var img = new Image();
		img.onload = function(e){
			var canvas = document.getElementById('c0');
            //分割图片
            var r = lv[0].r,c = lv[0].c;
            var w = parseInt(pic.w/c),h = parseInt(pic.h/r);

			$(canvas).attr('width',w);
			$(canvas).attr('height',h);
			var cxt = canvas.getContext("2d");
            /*获取右侧图块所在div的id*/
            var sequences = [];
            for(var i = 0; i < r; i++){
                for(var j = 0; j < c; j++) {
                    sequences.push('r_'+i+''+j);
                }
            }
			for(var i = 0; i < r; i++){
				for(var j = 0; j < c; j++){
					var left = 0,top = 0;
					left = j*w;
					top = i*h;
                    cxt.drawImage(this,left,top,w,h,0,0,w,h);
					var id = 'r_img_'+(i+''+j);
                    var tmp = new Image();
					tmp.src = canvas.toDataURL('image/jpeg');
                    tmp.draggable = "true";
                    tmp.id = id;
                    tmp.setAttribute('data-sequence',i+''+j);
                    tmp.ondragstart = function(ev){
                        drag(ev);
                    };
                    //随机乱序添加图块
                    var index = parseInt(Math.random()*sequences.length);
                    document.getElementById((sequences[index])).appendChild(tmp);
                    //删除该索引
                    sequences.splice(index,1);

                    //左侧提示图片 -- 透明化
                    tmp = new Image();
                    tmp.src = canvas.toDataURL('image/jpeg');
                    $(tmp).css('opacity',0.2).css('position','absolute').css('z-index',-1);
                    tmp.id = 'l_img_'+(i+''+j);
                    document.getElementById('l_'+(i+''+j)).appendChild(tmp);
				}
			}	
		}
		img.src = imgPath;
		//左侧面板设置
        html = '';
		for(var i = 0; i < r; i++){
			for(var j = 0; j < c; j++){
				var left = 0,top = 0;
				left = j*w;
				top = i*h;
                var id = 'l_'+(i+''+j);
				html += '<div class="left-img-td" style="position:absolute;left:'
                    +left+'px;top:'+top+'px;width:'+w+'px;height:'+h+'px;"'
                    +' ondrop="drop(event)" ondragover="allowDrop(event)" '
                    +' id="'+id+'"'
                    +'>'
					+'</div>';
			}
		}
		$('#leftP').html(html);

		gameState = STATE_RUNNING;
		$('#startBtn').text('重置');
	}else if(gameState == STATE_RUNNING){
		gameState = STATE_START;
		$('#startBtn').text('开始');
        stopTimer();
		init();
	}
}
/*放置的物体*/
function allowDrop(ev){
    ev.preventDefault();
}
/*拖拽的物体*/
function drag(ev){
    var data = {'id':ev.target.id,'sequence': ev.target.getAttribute('data-sequence')};
    ev.dataTransfer.setData('text/plain',JSON.stringify(data)) ;
}
/*拖放*/
function drop(ev){
    ev.preventDefault();
    var data=ev.dataTransfer.getData('text/plain')
    data = JSON.parse(data);
    if(ev.target.id.indexOf(data.sequence) != -1){//正确位置
        var t = document.getElementById(data.id);
        t.draggable = false;
        t.ondragstart = null;
        ev.target.appendChild(t);
        dragCount++;
        checkGameOver();
    }else{
        return false;
    }
}
/*检查游戏结束*/
function checkGameOver(){
    if(dragCount == lv[0].r*lv[0].c){
        stopTimer();
        setTimeout(function(){
            alert('成功!');
        },200);
    }else{
        if(timer.time == 0){
            alert('失败!');
        }
    }
}
/*计时器*/
function startTimer(){
    timer.time = timer.TIME;
    timer.instance = setInterval(function(){
        timer.time -= timer.interval;
        if(timer.time <= 0){

            timer.time = 0
            var txt = formatTime(timer.time);
            $('#timer').text(txt);
            setTimeout(function(){
                stopTimer();
                checkGameOver();
            },100);
        }else{
            var txt = formatTime(timer.time);
            $('#timer').text(txt);
        }

    },timer.interval);
}
/*停止计时器*/
function stopTimer(){
    if(timer.instance){
        clearInterval(timer.instance);
        timer.instance = null;
    }
}
/*格式化时间*/
function formatTime(t){
    var s = parseInt(t/1000);
    var ms = parseInt(t%1000/10);
    var txt = s > 9?s:'0'+s;
    txt += ':';
    txt += ms > 9?ms:'0'+ms;
    return txt;
}