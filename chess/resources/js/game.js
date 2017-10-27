/*行列值*/
var COL = 9,ROW = 9;
/*各个值代表的棋子颜色*/
var AI_CHESS = 1,PLAYER_CHESS = -1,SPACE_CHESS = 0;

/*记录棋子的位置*/
var chess = null;
var score_player = null;
var score_ai = null;
//下子记录
var note = null;
//手令，1表示玩家落子，0表示ai落子
var hand = 1;
//0 未结束 1 ai获胜，2 player获胜 3 平局
var gameOver = 0;
var error = 0;
var show_chess = false;
/*存储位置*/
var point = function(r,c,val){
	this.r = r;
	this.c = c;
	this.val = val;
}

$(document).ready(function(){	
	init();
})

/*初始化*/
function init(){
	initChessArray();
	initScoreArray();
	initNote();
	$('#player_input').on('keypress',function(e){
		if(e.which == 13){
			var cmd = $(e.target).val().trim();
			playerRound(cmd);
			$(e.target).val('');
		}		
	});
	$('#show_chess').on('click',function(e){
		show_chess = $(e.target).get(0).checked;
		dispayResult();
	});
	refreshInfo();
	dispayResult();
}

/*初始化棋子*/
function initChessArray(){
	chess = new Array(ROW);
	for(var i = 0; i < ROW; i++){
		chess[i] = new Array(COL);
		for(var j = 0; j < COL; j++){
			chess[i][j] = 0;
		}
	}
}

/*重置棋盘*/
function resetChessArray(){
	for(var i = 0; i < ROW; i++){
		for(var j = 0; j < COL; j++){
			chess[i][j] = 0;
		}
	}
}

/*初始化玩家、AI得分数组*/
function initScoreArray(){
	score_ai = new Array(ROW);
	for(var i = 0; i < ROW; i++){
		score_ai[i] = new Array(COL);
		for(var j = 0; j < COL; j++){
			score_ai[i][j] = 0;
		}
	}
	score_player = new Array(ROW);
	for(var i = 0; i < ROW; i++){
		score_player[i] = new Array(COL);
		for(var j = 0; j < COL; j++){
			score_player[i][j] = 0;
		}
	}
}

/*重置得分数组*/
function resetScoreArray(){
	for(var i = 0; i < ROW; i++){
		for(var j = 0; j < COL; j++){
			score_ai[i][j] = 0;
			score_player[i][j] = 0;
		}
	}
}

/*初始化下子记录*/
function initNote(){
	note = new Array();
}

/*重置下子记录*/
function resetNote(){
	note = new Array();
}

/*添加下子记录*/
function addNote(r,c,val){
	var txt = "";
	if(val == AI_CHESS){
		txt = "ai落子:"+r+""+c;
	}else{
		txt = "玩家落子:"+r+""+c;
	}
	note.push(txt);
}

/*重新开始*/
function restart(){
	hand = 1;
	error = 0;
	gameOver = 0;
	resetScoreArray();
	resetChessArray();
	refreshInfo();
}

/*刷新提示信息*/
function refreshInfo(){
	var txt = "";
	if(gameOver!=0){
		txt = "胜负已分";
	}else{
		if(hand == 0){
			txt = "ai回合";
		}else{
			txt = "玩家回合";
		}	
	}
	$('#info').text(txt);	
}

/*ai回合*/
function aiRound(){
	if(gameOver==0 && hand == 0){
		//计算分数
		aiCompute();
		//获取最大分数
		var r1 = getMaxScore(score_ai);
		var r2 = getMaxScore(score_player);
		//根据分数下棋
		console.log(r1.score+","+r2.score);
		if(r1.score >= r2.score){
			setChess(r1.row,r1.col,AI_CHESS);
		}else{
			setChess(r2.row,r2.col,AI_CHESS);
		}
		//交换手令
		hand = 1;
	}	
}

/*玩家回合*/
function playerRound(cmd){
	var msg = null;
	if(gameOver==0 && hand == 1){	
		if(cmd.length != 2){
			msg = "输入命令示例:36,表示第3行第6列";
		}else{
			var r = parseInt(cmd[0]) - 1;
			var c = parseInt(cmd[1]) - 1;		
			if(Number.isNaN(r) || Number.isNaN(c)){
				msg = "输入坐标有误";
			}else if(!indexCheck(r,c)){
				msg = "输入坐标有误";
			}else if(chess[r][c] != 0){
				msg = "该处已经落子";
				error = error+1;
			}else{
				setChess(r,c,PLAYER_CHESS);
				//交换手令
				hand = 0;
				aiRound();
			}
		}
	}else{
		msg = 'ai正在思考，请等待...';
	}

	if(msg != null){
		alert(msg);
	}
}

/*检查索引是否合法*/
function indexCheck(r,c){
	return r>=0&&c>=0&&r<ROW&&c<COL; 
}

/*设置棋子*/
function setChess(r,c,val){
	chess[r][c] = val;
	//更新ai提示信息
	if(val == AI_CHESS){
		$('#ai_chess').text("ai上手:"+(r+1)+""+(c+1));
	}
	//添加记录
	addNote(r,c,val);
	//更新回合提示
	refreshInfo();
	//胜负判断 -- 下子周围进行判断
	checkGameOver(r,c,val);
	dispayResult();
	if(gameOver!=0){
		//显示最终结果
		dispayResult();
		var msg = '';
		if(gameOver==1){
			msg = 'ai获胜';
		}else if(gameOver == 2){
			msg = '玩家获胜';
		}else if(gameOver == 3){
			msg = '平局';
		}
		alert(msg);		
	}
}

/*从数组获取最高分数的相关信息*/
function getMaxScore(arr){
	var result = {"row":0,"col":0,"score":0};
	for(var i = 0; i < ROW; i++){
		for(var j = 0; j < COL; j++){
			if(arr[i][j] >= result.score){
				result.score = arr[i][j];
				result.row = i;
				result.col = j;
			}
		}
	}
	return result;
}

/*胜负判断*/
function checkGameOver(r1,c1,val){
	var g = 0;
	if(val == AI_CHESS){
		g = 1;
	}else if(val == PLAYER_CHESS){
		g = 2;
	}
	//垂直方向
	for(var r = 0; r < ROW;r++){
		for(var c = 0; c < COL;c++){
			if(chess[r][c] == val && Math.abs(r-r1) < 5&&Math.abs(c-c1) < 5){
				for(var i = r - 4;i <= r;i++){
					if(indexCheck(i,c) && indexCheck(i+4,c)){
						if(chess[i][c]+chess[i+1][c]+chess[i+2][c]+chess[i+3][c]+chess[i+4][c] == 5*val){
							gameOver = g;
							return;
						}
					}
				}
				//水平方向
				for(var j = c - 4;j <= c;j++){
					if(indexCheck(r,j) && indexCheck(r,j+4)){
						if(chess[r][j]+chess[r][j+1]+chess[r][j+2]+chess[r][j+3]+chess[r][j+4] == 5*val){
							gameOver = g;
							return;
						}
					}
				}
				//对角线方向
				for(var i = r - 4;i <= r;i++){
					if(indexCheck(i,c - 4) && indexCheck(i+4,c)){
						if(chess[i][c-4]+chess[i+1][c-3]+chess[i+2][c-2]+chess[i+3][c-1]+chess[i+4][c] == 5*val){
							gameOver = g;
							return;
						}
					}
				}
				//反对角线方向
				for(var j = c - 4;j <= c;j++){
					if(indexCheck(r+4,j) && indexCheck(r,j+4)){
						if(chess[r+4][j]+chess[r+3][j+1]+chess[r+2][j+2]+chess[r+1][j+3]+chess[r][j+4] == 5*val){
							gameOver = g;
							return;
						}
					}
				}
			}
		}
	}

	var b = false;
	//平局判断
	for(var r = 0; r < ROW;r++){
		for(var c = 0; c < COL;c++){
			if(chess[r][c] == SPACE_CHESS){
				b = true;
			}
		}
	}
	if(b){//还有空位置
		gameOver = 0;
	}else{//平局
		gameOver = 3;
	}
	
}

/*ai计算*/
function aiCompute(){
	//ai分数
	//存储要判断的五个棋子以及首尾的棋子
	var arr = new Array(7);

	for(var r = 0;r < ROW;r++){
		for(var c = 0; c < COL;c++){
			//该位置可以落子
			if(chess[r][c] == 0){
				//水平方向判断
				for(var j = c-4;j<c;j++){
					if(indexCheck(r,j)&&indexCheck(r,j+4)){
						for(var m = 0; m < 5;m++){
							if(j+m == c){
								arr[m+1] = new point(r,j+m,AI_CHESS);
							}else{
								arr[m+1] = new point(r,j+m,chess[r][j+m]);	
							}							
						}
						//如果不存在该位置则设为对方棋子
						if(indexCheck(r,j-1)){
							arr[0] = new point(r,j-1,chess[r][j-1]);
						}else{
							arr[0] = PLAYER_CHESS;
						}
						if(indexCheck(r,j+5)){
							arr[6] = new point(r,j+5,chess[r][j+5]);
						}else{
							arr[6] = PLAYER_CHESS;
						}
						//获取分数
						var score = getChessScore(arr,AI_CHESS);
						score_ai[r][c] = score_ai[r][c]+score;
					}
				}
				//垂直方向判断
				for(var i = r-4;i<r;i++){
					if(indexCheck(i,c)&&indexCheck(i+4,c)){
						for(var m = 0; m < 5;m++){
							if(i+m == r){
								arr[m+1] = new point(i+m,c,AI_CHESS);
							}else{
								arr[m+1] = new point(i+m,c,chess[i+m][c]);	
							}							
						}
						//如果不存在该位置则设为对方棋子
						if(indexCheck(r,i-1)){
							arr[0] = new point(r,i-1,chess[r][i-1]);
						}else{
							arr[0] = PLAYER_CHESS;
						}
						if(indexCheck(r,i+5)){
							arr[6] = new point(r,i+5,chess[r][i+5]);
						}else{
							arr[6] = PLAYER_CHESS;
						}
						//获取分数
						var score = getChessScore(arr,AI_CHESS);
						score_ai[r][c] = score_ai[r][c]+score;
					}
				}
				//对角方向判断
				for(var n = 0; n < 5;n++){
					if(indexCheck(r-n,c-n)&&indexCheck(r-n+4,c-n+4)){
						for(var m = 0; m < 5;m++){
							if(m == n){
								arr[m+1] = new point(r-n+m,c-n+m,AI_CHESS);
							}else{
								arr[m+1] = new point(r-n+m,c-n+m,chess[r-n+m][c-n+m]);	
							}							
						}
						//如果不存在该位置则设为对方棋子
						if(indexCheck(r-n-1,c-n-1)){
							arr[0] = new point(r,j-1,chess[r-n-1][c-n-1]);
						}else{
							arr[0] = PLAYER_CHESS;
						}
						if(indexCheck(r-n+5,c-n+5)){
							arr[6] = new point(r-n+5,c-n+5,chess[r-n+5][c-n+5]);
						}else{
							arr[6] = PLAYER_CHESS;
						}
						//获取分数
						var score = getChessScore(arr,AI_CHESS);
						score_ai[r][c] = score_ai[r][c]+score;
					}
				}
				//反对角方向判断
				for(var n = 0; n < 5;n++){
					if(indexCheck(r+n,c-n)&&indexCheck(r+n-4,c-n+4)){
						for(var m = 0; m < 5;m++){
							if(m == n){
								arr[m+1] = new point(r+n-m,c-n+m,AI_CHESS);
							}else{
								arr[m+1] = new point(r+n-m,c-n+m,chess[r+n-m][c-n+m]);	
							}							
						}
						//如果不存在该位置则设为对方棋子
						if(indexCheck(r+n+1,c-n-1)){
							arr[0] = new point(r,j-1,chess[r+n+1][c-n-1]);
						}else{
							arr[0] = PLAYER_CHESS;
						}
						if(indexCheck(r+n-5,c-n+5)){
							arr[6] = new point(r+n-5,c-n+5,chess[r+n-5][c-n+5]);
						}else{
							arr[6] = PLAYER_CHESS;
						}
						//获取分数
						var score = getChessScore(arr,AI_CHESS);
						score_ai[r][c] = score_ai[r][c]+score;
					}
				}
			}else{
				score_ai[r][c] = 0;
			}
		}
	}
	//玩家分数
	arr = new Array(7);
	for(var r = 0;r < ROW;r++){
		for(var c = 0; c < COL;c++){
			//该位置可以落子
			if(chess[r][c] == 0){
				//水平方向判断
				for(var j = c-4;j<c;j++){
					if(indexCheck(r,j)&&indexCheck(r,j+4)){
						for(var m = 0; m < 5;m++){
							if(j+m == c){
								arr[m+1] = new point(r,j+m,PLAYER_CHESS);
							}else{
								arr[m+1] = new point(r,j+m,chess[r][j+m]);	
							}							
						}
						//如果不存在该位置则设为对方棋子
						if(indexCheck(r,j-1)){
							arr[0] = new point(r,j-1,chess[r][j-1]);
						}else{
							arr[0] = AI_CHESS;
						}
						if(indexCheck(r,j+5)){
							arr[6] = new point(r,j+5,chess[r][j+5]);
						}else{
							arr[6] = AI_CHESS;
						}
						//获取分数
						var score = getChessScore(arr,PLAYER_CHESS);
						score_player[r][c] = score_player[r][c]+score;
					}
				}
				//垂直方向判断
				for(var i = r-4;i<r;i++){
					if(indexCheck(i,c)&&indexCheck(i+4,c)){
						for(var m = 0; m < 5;m++){
							if(i+m == r){
								arr[m+1] = new point(i+m,c,PLAYER_CHESS);
							}else{
								arr[m+1] = new point(i+m,c,chess[i+m][c]);	
							}							
						}
						//如果不存在该位置则设为对方棋子
						if(indexCheck(r,i-1)){
							arr[0] = new point(r,i-1,chess[r][i-1]);
						}else{
							arr[0] = AI_CHESS;
						}
						if(indexCheck(r,i+5)){
							arr[6] = new point(r,i+5,chess[r][i+5]);
						}else{
							arr[6] = AI_CHESS;
						}
						//获取分数
						var score = getChessScore(arr,PLAYER_CHESS);
						score_player[r][c] = score_player[r][c]+score;
					}
				}
				//对角方向判断
				for(var n = 0; n < 5;n++){
					if(indexCheck(r-n,c-n)&&indexCheck(r-n+4,c-n+4)){
						for(var m = 0; m < 5;m++){
							if(m == n){
								arr[m+1] = new point(r-n+m,c-n+m,PLAYER_CHESS);
							}else{
								arr[m+1] = new point(r-n+m,c-n+m,chess[r-n+m][c-n+m]);	
							}							
						}
						//如果不存在该位置则设为对方棋子
						if(indexCheck(r-n-1,c-n-1)){
							arr[0] = new point(r,j-1,chess[r-n-1][c-n-1]);
						}else{
							arr[0] = AI_CHESS;
						}
						if(indexCheck(r-n+5,c-n+5)){
							arr[6] = new point(r-n+5,c-n+5,chess[r-n+5][c-n+5]);
						}else{
							arr[6] = AI_CHESS;
						}
						//获取分数
						var score = getChessScore(arr,PLAYER_CHESS);
						score_player[r][c] = score_player[r][c]+score;
					}
				}
				//反对角方向判断
				for(var n = 0; n < 5;n++){
					if(indexCheck(r+n,c-n)&&indexCheck(r+n-4,c-n+4)){
						for(var m = 0; m < 5;m++){
							if(m == n){
								arr[m+1] = new point(r+n-m,c-n+m,PLAYER_CHESS);
							}else{
								arr[m+1] = new point(r+n-m,c-n+m,chess[r+n-m][c-n+m]);	
							}							
						}
						//如果不存在该位置则设为对方棋子
						if(indexCheck(r+n+1,c-n-1)){
							arr[0] = new point(r,j-1,chess[r+n+1][c-n-1]);
						}else{
							arr[0] = AI_CHESS;
						}
						if(indexCheck(r+n-5,c-n+5)){
							arr[6] = new point(r+n-5,c-n+5,chess[r+n-5][c-n+5]);
						}else{
							arr[6] = AI_CHESS;
						}
						//获取分数
						var score = getChessScore(arr,PLAYER_CHESS);
						score_player[r][c] = score_player[r][c]+score;
					}
				}
			}else{
				score_player[r][c] = 0;
			}
		}
	}
}

/*根据棋子位置及类型判断属于何种棋式，并返回对应的分数*/
function getChessScore(arr,c){
	var score = 0;
	//z中间五颗棋子是否含有对方棋子
	var count = {'cur':0,'s':0,'op':0};
	for(var i = 1; i < 6;i++){
		if(arr[i].val == c){
			count.cur++;
		}else if(arr[i].val == -c){
			count.op++;
		}else{
			count.s++;
		}
	}
	//连五判断
	if(count.cur == 5){
		score = 1000000;
	}else if(count.cur == 4){
		//活4判断
		if(arr[0].val == SPACE_CHESS && arr[5].val == SPACE_CHESS){
			score = 100000;
		}else if(arr[1].val == SPACE_CHESS && arr[6].val == SPACE_CHESS){
			score = 100000;
		}else{
			//冲4判断
			if(count.s == 1){
				score = 10000;
			}else if(count.op == 1 &&(arr[1].val == -c || arr[5].val == -c)){
				score = 10000;
			}
		}
	}else if(count.cur == 3){
		//活3判断
		if(arr[1].val == SPACE_CHESS && arr[5].val == SPACE_CHESS 
			&&(arr[0].val == SPACE_CHESS || arr[6].val == SPACE_CHESS)){
			score = 1000;
		}else if(arr[1].val == SPACE_CHESS && arr[6].val == SPACE_CHESS && count.op == 0){
			score = 1000;
		}else if(arr[5].val == SPACE_CHESS && arr[0].val == SPACE_CHESS && count.op == 0){
			score = 1000;
		}else if(count.op == 2){
			score = 0;
		}else{
			//眠三
			score = 100;
		}
	}else if(count.cur == 2){
		//活2判断
		if(count.s == 3 && (arr[2].val != SPACE_CHESS
			|| arr[3].val != SPACE_CHESS || arr[4].val != SPACE_CHESS)){
			score = 10;
		}else{
			if((arr[2].val+arr[3].val+arr[4].val == SPACE_CHESS)){
				score = 5;
			}else if(count.op == 1 && (arr[1].val == -c || arr[5].val == -c)){
				score = 5;
			}
		}
	}else{
		score = 0;
	}
	return score;
}

/*显示最终结果*/
function dispayResult(){
	var html = '';
	if(show_chess){
		html = '<tr><td></td>';
		for(var c = 0; c < COL;c++){
			html += '<td>'+(c+1)+' </td>';
		}
		html += '</p>';
		for(var r = 0;r < ROW;r++){
			html += '<tr><td>'+(r+1)+'</td>';
			for(var c = 0; c < COL;c++){
				var v = chess[r][c];
				if(v == AI_CHESS){
					html+='<td class="black">黑 </td>';
				}else if(v == PLAYER_CHESS){
					html+='<td class="white">白 </td>';
				}else{
					html+='<td class="space">空 </td>';
				}

			}
			html += '</p>';
		}
		html += '<p>玩家为白色</p>';
		
	}else{
		html = '';
	}
	$('#result').html(html);
}