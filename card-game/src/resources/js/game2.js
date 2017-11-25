/**/
$(document).ready(function(){		
	init();
});

/*欢迎界面*/
function init(){
	//加载保存的数据
	load();
	loadCommonImage();
	cardDatabase = initCardDatabase();
	instanceDatabase = instanceDataInit();
	/*开始按钮位置*/	
	var px = (SCREEN_WIDTH - BTN_START_WIDTH)/2;
	var py = (SCREEN_HEIGHT - BTN_START_HEIGHT)/2;

	$('#base').playground({width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
	/*设置背景图层*/
	.addGroup('bgGroup',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
	.addSprite('bg',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT,animation:commImgMap['startBgAnim']})
	.addSprite('title',{width:SCREEN_WIDTH,height:100,posy:30})
	.addSprite('startBtn',{width:BTN_START_WIDTH,height:BTN_START_HEIGHT,posx:px,posy:py,animation:commImgMap['startBtnAnimation']});
	
	$('#title').addClass('game-title').text('卡牌游戏');
	
	$.playground().startGame(function(){
	});
	/*开始按钮事件*/
	$('#startBtn').click(function(){
		execTasks();
		clearScence();
		gameInit();	
	});	
}

/*主界面初始化*/
function gameInit(){
	console.log('gameInit');
	var offsetX = 20;
	$('#base').playground({width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
	/*设置背景图层*/
	.addGroup('bgGroup',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
	.addSprite('bg',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT,animation:commImgMap['bgAnimation']})
	.end()
	/*设置辅助妖精图层*/
	.addGroup('fairyGroup',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
	.addSprite('change',{width:250,height:40,posx:500,posy:100})
	.end()
	/*设置工具图层*/
	.addGroup('toolGroup',{width:TOOL_WIDTH,height:TOOL_HEIGHT,posx:TOOL_X,posy:TOOL_Y})
	.addSprite('btn1',{width:BTN_WIDTH,height:BTN_HEIGHT,animation:commImgMap['configBtnAnimation'],
		posx:offsetX})
	.addSprite('btn2',{width:BTN_WIDTH,height:BTN_HEIGHT,animation:commImgMap['mailBtnAnimation'],
		posx:offsetX+BTN_WIDTH*1})
	.addSprite('btn3',{width:BTN_WIDTH,height:BTN_HEIGHT,animation:commImgMap['summonBtnAnimation'],
		posx:offsetX+BTN_WIDTH*2})
	.addSprite('btn4',{width:BTN_WIDTH,height:BTN_HEIGHT,animation:commImgMap['cardBtnAnimation'],
		posx:offsetX+BTN_WIDTH*3})
	.addSprite('btn5',{width:BTN_WIDTH,height:BTN_HEIGHT,animation:commImgMap['instanceBtnAnimation'],
		posx:offsetX+BTN_WIDTH*4})
	.addSprite('btn6',{width:BTN_WIDTH,height:BTN_HEIGHT,animation:commImgMap['bagBtnAnimation'],
			posx:offsetX+BTN_WIDTH*5})
	.addSprite('btn7',{width:BTN_WIDTH,height:BTN_HEIGHT,animation:commImgMap['lineUpBtnAnim'],
			posx:offsetX+BTN_WIDTH*6})
	.end();

	addTopInfoSpire();

	/* 绑定按钮事件*/
	/*邮箱按钮初始化*/
	$('#btn1').click(function(){
		clearScence();
		configInit();		
	});
	/*邮箱按钮初始化*/
	$('#btn2').click(function(){
		if(true){
			c_alert('未开放！',null);
		}else{
			clearScence();
			eMailInit();		
		}
		
	});
	/*召唤按钮初始化*/
	$('#btn3').click(function(){
		clearScence();
		summonInit();
	});
	/*卡组按钮初始化*/
	$('#btn4').click(function(){
		deckDetailInit(null);
	});
	/*副本按钮初始化*/
	$('#btn5').click(function(){
		if(checkLineUp()){
			clearScence();
			/*battleInit();*/
			instanceInit();
		}else{
			c_alert('请设置阵容!',null);
		}		
	});	
	/*背包按钮初始化*/
	$('#btn6').click(function(){
		c_alert('未开放！',null);
	});
	/*阵容按钮初始化*/
	$('#btn7').click(function(){
		lineUpInit();
	});
	//查询相关信息
	refreshTopInfo();
	$.playground().startGame(function(){
	});
}

/*阵容界面初始化*/
function lineUpInit(){
	console.log('lineUpInit');
	if(pInfo.cards.length == 0){
		c_alert('无卡牌',null);
	}else{
		clearScence();
		var py = 100;
		$('#base').playground({width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
			/*设置背景图层*/
			.addGroup('bgGroup',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
			.addSprite('bg',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT,animation:commImgMap['bg1Anim']})
			.end()
			/*设置信息图层*/
			.addGroup('addGroup',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
			.addSprite('addBtn1',{width:CARD_SIZE,height:CARD_SIZE,posx:20,posy:py,animation:commImgMap['addBtnAnim']})
			.addSprite('addBtn2',{width:CARD_SIZE,height:CARD_SIZE,posx:20 + 200,posy:py,animation:commImgMap['addBtnAnim']})
			.addSprite('addBtn3',{width:CARD_SIZE,height:CARD_SIZE,posx:20+ 200*2,posy:py,animation:commImgMap['addBtnAnim']})
			.addSprite('addBtn4',{width:CARD_SIZE,height:CARD_SIZE,posx:20 + 200*3,posy:py,animation:commImgMap['addBtnAnim']})

			.addSprite('addDetail1',{width:CARD_SIZE,height:CARD_SIZE,posx:20 ,posy:py + 150})
			.addSprite('addDetail2',{width:CARD_SIZE,height:CARD_SIZE,posx:20 + 200*1,posy:py + 150})
			.addSprite('addDetail3',{width:CARD_SIZE,height:CARD_SIZE,posx:20 + 200*2,posy:py + 150})
			.addSprite('addDetail4',{width:CARD_SIZE,height:CARD_SIZE,posx:20 + 200*3,posy:py + 150})

			.addSprite('summary',{width:SCREEN_WIDTH,height:CARD_SIZE,posx:20 + 200*3,posy:py + 300})
			.end()
			/*工具栏图层*/
			.addGroup('toolGroup',{width:TOOL_WIDTH,height:TOOL_HEIGHT,posx:TOOL_X,posy:TOOL_Y})
			.addSprite('backBtn',{width:BTN_WIDTH,height:BTN_HEIGHT,posx:20,posy:10,animation:commImgMap['backBtnAnimation']})
			.end();
		/*添加按钮事件*/
		for(var i = 0; i < 4;i++){
			$('#addBtn'+(i+1)).click(i,function(e){
				clearScence();
				selectCard(e.data,pInfo.lineUp,'lineUpInit()',null);
			});
		}

		for(var i = 0; i < 4; i++){
			$('#addDetail'+(i+1)).css('text-align','center');
		}
		$('#backBtn').click(function(){
			clearScence();
			gameInit();
		});

		refreshLineUp();
		$.playground().startGame(function(){
		});
	}
}

/*
	选择阵容卡牌
	index表示arr中的序号
	callback为回调函数字符串
	uid表示卡牌界面（进行强化、进化的卡的uid）
*/
function selectCard(index,arr,callback,uid){
	$('#base').playground({width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
		/*设置背景图层*/
		.addGroup('bgGroup',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
		.addSprite('bg',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT,animation:commImgMap['bg1Anim']})
		.end();
	addLeftCardDetailSpire();
	$.playground()
		.addGroup('cardGroup',{width:CARD_INFO_BG_WIDTH,height:CARD_INFO_BG_HEIGHT,posx:20+CARD_PIC_WIDTH,posy:30,animation:commImgMap['cdAnim']})
		.addSprite('cardInfo',{width:CARD_INFO_BG_WIDTH,height:CARD_INFO_BG_HEIGHT,posx:25,posy:10})
		.end()
		/*工具栏图层*/
		.addGroup('toolGroup',{width:TOOL_WIDTH,height:TOOL_HEIGHT,posx:TOOL_X,posy:TOOL_Y})		
		.addSprite('backBtn',{width:BTN_WIDTH,height:BTN_HEIGHT,posx:20,posy:10,animation:commImgMap['backBtnAnimation']})
		.addSprite('preBtn',{width:BTN_WIDTH,height:BTN_HEIGHT,posx:20+BTN_HEIGHT,posy:10,animation:commImgMap['preBtnAnimation']})
		.addSprite('nextBtn',{width:BTN_WIDTH,height:BTN_HEIGHT,posx:20+BTN_HEIGHT*2,posy:10,animation:commImgMap['nextBtnAnimation']})
		.addSprite('okBtn',{width:BTN_WIDTH,height:BTN_HEIGHT,posx:20+BTN_HEIGHT*3,posy:10,animation:commImgMap['okBtnAnim']})
		.addSprite('pageInfo',{width:BTN_WIDTH*3,height:BTN_HEIGHT,posx:100+BTN_WIDTH*5,posy:10})
		.end();
	var deckIndex = -1;
	if(pInfo.cards.length>0){
		deckIndex = 0;
		var c = pInfo.cards[deckIndex];
		refreshSelectDeckInfo(c,existsDeck(c,arr),uid);
	}else{
		c_alert('无卡牌!',function(){
			clearScence();
			gameInit();	
		});
		
	}
	$('#pageInfo').css('padding-top',40)
		.css('font-size',42)
		.text((deckIndex+1)+'/'+pInfo.cards.length);
	/*绑定按钮事件*/
	$('#preBtn').click(function(){
		if(deckIndex > 0){		
			deckIndex--;
			var c = pInfo.cards[deckIndex];
			refreshSelectDeckInfo(c,existsDeck(c,arr),uid);
		}else{
			c_alert('该牌是第一张',null);
		}
		$('#pageInfo').text((deckIndex+1)+'/'+pInfo.cards.length);
	});
	$('#nextBtn').click(function(){
		if(deckIndex < pInfo.cards.length - 1){
			deckIndex++;
			var c = pInfo.cards[deckIndex];
			refreshSelectDeckInfo(c,existsDeck(c,arr),uid);
		}else{
			c_alert('该牌是最后一张',null);
		}
		$('#pageInfo').text((deckIndex+1)+'/'+pInfo.cards.length);		
	});
	$('#backBtn').click(function(){
		clearScence();
		execByFuncName(callback);
	});

	$('#okBtn').click(function(){
		var c = pInfo.cards[deckIndex];		
		var exists = false;
		for(var i = 0; i < arr.length;i++){
			if(c.uid == arr[i]){
				exists = true;
				break;
			}
		}
		if(exists){
			c_alert('该牌已经被选中！',null);
		}else if(c.compareUid(uid)){
			c_alert('本卡是要强化的卡牌!',null);
		}else{
			arr[index] = c.uid;	
			clearScence();
			execByFuncName(callback);
		}
		autoSave();		
	});

	$.playground().startGame(function(){
	});
}
/*战斗界面初始化*/
function battleInit(arr,index){
	console.log('battleInit');
	var monster = arr[index].monster.copy();
	if(pInfo.power < monster.power){
		c_alert('至少需要体力:'+monster.power,function(){
		});		
	}else{
		/*玩家、怪物*/
		var battleCards = getLineUpCards();

		var player = new Player('',0,0,{},battleCards);	
		var boss = monster;
		var cardAnim = [];
		for(var i = 0; i < battleCards.length;i++){
			var c = battleCards[i];
			cardAnim[i] = new $.gQ.Animation({ imageURL: cardBasePath+c.id+'/icon.png'});
		}
		var bossAnim = new $.gQ.Animation({ imageURL:'./resources/images/boss/'+boss.id+'/icon.png'});
		var bossImgAnim = new $.gQ.Animation({ imageURL:'./resources/images/boss/'+boss.id+'/boss.png'});

		$('#base').playground({width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
			/*设置角色图层*/
			.addGroup('charGroup',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
			.addSprite('bg',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT,animation:commImgMap['battleBgAnim']})
			.addSprite('bossImg',{width:300,height:300,posx:(SCREEN_WIDTH-300)/2,posy:(SCREEN_HEIGHT-300)/2,animation:bossImgAnim})
			.addSprite('player',{width:CARD_SIZE,height:CARD_SIZE,posx:-5,posy:455,animation:cardAnim[0]})
			.addSprite('card1',{width:CARD_SIZE,height:CARD_SIZE,posx:136,posy:430,animation:cardAnim[1]})
			.addSprite('card2',{width:CARD_SIZE,height:CARD_SIZE,posx:270,posy:430,animation:cardAnim[2]})
			.addSprite('card3',{width:CARD_SIZE,height:CARD_SIZE,posx:403,posy:430,animation:cardAnim[3]})
			.addSprite('boss',{width:CARD_SIZE,height:CARD_SIZE,posx:660,posy:-8,animation:bossAnim})
			.addSprite('damage',{width:400,height:CARD_SIZE,posx:320,posy:100})
			.end()
			/*设置背景图层*/
			.addGroup('bgGroup',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT})				
			.addSprite('bgBorder',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT,animation:commImgMap['battleBorderAnim']})		
			.end()
			/*设置信息图层*/
			.addGroup('infoGroup',{width:INSTANCE_WIDTH,height:INSTANCE_HEIGHT})
			.addSprite('playerHpMask',{width:0,height:14,posx:115,posy:580})
			.addSprite('bossHpMask',{width:0,height:14,posx:10,posy:6})
			.addSprite('playerHp',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT,posx:0,posy:576})		
			.addSprite('bossHp',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT,posx:0,posy:6})
			.end()
			/*工具栏图层*/
			.addGroup('extraGroup',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT})		
			.end();	
		
		$('#damage').addClass('battle-damage');
		battleInfoRefresh(player,boss);
		$.playground().startGame(function(){
		});
		/*加载音效等资源*/
		loadBattleResource();
		/*2s后进入战斗*/
		setTimeout(function(){
			battle(player,boss,index);
		},2000);
	}
}

/*开始战斗
	index:副本序列号
*/
function battle(player,boss,index){
	console.log('battle');
	var b = false;
	var hand = true;
	var result = {damage:0,loss:0,rewards:0,success:true,power:boss.power,index:index};
	battle1(player,boss,b,hand,result);	
}

function battle1(player,boss,b,hand,result){
	console.log('battle1');
	$('#extraGroup').addSprite('attackEffect',{width:400,height:400,posx:200,posy:100});
	/*攻击动画*/
	var attackAnim = null;
	/*音效播放*/
	if(hand){
		speakSkill();		
		attackAnim = getAnim('magicAnim');
	}else{
		audioPlay(battleAudio['tiger']);	
		attackAnim = getAnim('attackAnim');
	}
	/*动画播放*/
	$('#attackEffect').setAnimation(attackAnim,function(){	
		$('#attackEffect').remove();
		if(hand){
			/*攻击二阶段的音效和动画*/
			$('#extraGroup').addSprite('attackEffect',{width:400,height:400,posx:200,posy:100});
			var anim2 = getAnim('boomAnim');
			$('#attackEffect').setAnimation(anim2,function(){	
				$('#attackEffect').remove();
			});
			audioPlay(battleAudio['lightning']);
			/*伤害结算*/
			var damage = player.attack(boss);
			result.damage += damage;
			b = boss.isDead();

			if(damage>player.atk){
				damage = '暴击 -'+damage;
			}else{
				damage = '-'+damage;
			}
			displayDamage($('#damage'),damage);
		}else{
			var damage = boss.attack(player);
			result.loss += damage;
			b = player.isDead();
		}

		battleInfoRefresh(player,boss);	
		hand = !hand;

		if(!b){
			setTimeout(function(){
				battle1(player,boss,b,hand,result);	
			},4000);			
		}else{
			if(boss.isDead()){
				var re = boss.getRewards();
				console.log('success!' + re);
				result.rewards = re;
				result.success = true;
			}else{
				console.log('failed!');
				result.rewards = {"money":1000};
				result.success = false;
			}
			setTimeout(function(){
				clearScence();
				battleResultInit(result);	
			},4000);			
		}
	});	
}

/*对战结果界面初始化*/
function battleResultInit(result){
	var rewards = result.rewards;
	for(var key in rewards){
		if(key == 'card'){
			var card = rewards[key];
			card.setUid(Date.now());
			pInfo.cards.push(card);
		}else{
			pInfo[key] += rewards[key];	
		}		
	}
	pInfo.power -= result.power;

	$('#base').playground({width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
		/*设置背景图层*/
		.addGroup('bgGroup',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
		.addSprite('bg',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT,animation:commImgMap['bResultBgAnim']})
		.end()
		/*设置信息图层*/
		.addGroup('infoGroup',{width:DIALOG_WIDTH,height:DIALOG_HEIGHT})
		.addSprite('info',{width:DIALOG_WIDTH,height:DIALOG_HEIGHT,posx:DIALOG_X,posy:DIALOG_Y})
		.end();
	
	var html = '<p>造成伤害：'+result.damage+'</p>';
	html += '<p>受到伤害：'+result.loss+'</p>';
	html += '<p>战斗结果：'+(result.success?'胜利':'失败')+'</p>';
	html += '<p>奖励结算：</p>';
	for(var key in rewards){
		var name = '',value = rewards[key];
		if(key =='power'){
			name = '体力';
		}else if(key =='money'){
			name = '金币';
		}else if(key =='diamond'){
			name = '钻石';
		}else if(key =='card'){
			name = '卡牌';
			value = value.stars+"星"+value.name;
		}
		html += '<p style="margin-left:15px;">'+name+'：'+value+'</p>';
	}	

	$('#info').html(html);

	$('#info').click(function(){
		clearScence();
		instanceInit();
	});
	$('#bg').click(function(){
		clearScence();
		instanceInit();
	});

	$.playground().startGame(function(){
	});

	if(result.success){
		audioPlay(battleAudio['success']);
		/*挑战成功，删除该副本*/
		pInfo.instances.splice(result.index,1);
	}else{
		audioPlay(battleAudio['failed']);
	}
	/*自动保存*/
	autoSave();
}

/*血量等信息的更新显示*/
function battleInfoRefresh(player,boss){
	$('#playerHp').css('text-align','center').text(player.hp+'/'+player.hp1);
	$('#bossHp').css('text-align','center').text(boss.hp+'/'+boss.hp1);

	$('#playerHpMask').css('background-color','white').css('width',675*(player.hp1 - player.hp)/player.hp1);
	$('#bossHpMask').css('background-color','white').css('width',675*(boss.hp1 - boss.hp)/boss.hp1);
}
/*设置界面初始化*/
function configInit(){
	console.log('configInit');
	$('#base').playground({width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
		/*设置背景图层*/
		.addGroup('bgGroup',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
		.addSprite('bg',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT,animation:commImgMap['bg1Anim']})
		.end()
		/**/
		.addGroup('infoGroup',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
		.addSprite('help',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
		.end()
		/*工具栏图层*/
		.addGroup('toolGroup',{width:TOOL_WIDTH,height:TOOL_HEIGHT,posx:TOOL_X,posy:TOOL_Y})		
		.addSprite('backBtn',{width:BTN_WIDTH,height:BTN_HEIGHT,posx:20,posy:10,animation:commImgMap['backBtnAnimation']})
		.addSprite('soundBtn',{width:BTN_WIDTH,height:BTN_HEIGHT,posx:20 + BTN_WIDTH*1,posy:10,animation:(pInfo.sys.muted?commImgMap['sound2BtnAnim']:commImgMap['sound1BtnAnim'])})
		/*.addSprite('saveBtn',{width:BTN_WIDTH,height:BTN_HEIGHT,posx:20 + BTN_WIDTH*2,posy:10,animation:commImgMap['saveBtnAnim']})
		.addSprite('loadBtn',{width:BTN_WIDTH,height:BTN_HEIGHT,posx:20 + BTN_WIDTH*3,posy:10,animation:commImgMap['loadBtnAnim']})
		*/
		.addSprite('exitBtn',{width:BTN_WIDTH,height:BTN_HEIGHT,posx:20 + BTN_WIDTH*2,posy:10,animation:commImgMap['exitBtnAnim']})
		.end();
		
	$('#backBtn').click(function(){
		clearScence();
		gameInit();
	});

	$('#soundBtn').click(function(){
		pInfo.sys.muted = !pInfo.sys.muted;
		autoSave();
		$('#soundBtn').setAnimation(pInfo.sys.muted?commImgMap['sound2BtnAnim']:commImgMap['sound1BtnAnim']);
	});

	$('#exitBtn').click(function(){
		save();
		setTimeout(function(){
			window.close();
		},1000);
	});
	var html = '<h2>游戏说明</h2>';
	html+='<p>1、主界面图标依次为设置、邮件、召唤、卡牌、副本、背包、阵容</p>';
	html+='<p>2、卡牌可强化、进化(同名卡)</p>';
	html+='<p>3、游戏必须设置完整阵容</p>';
	html+='<p>4、体力每分钟回复一点，离线不记</p>';
	html+='<p>5、推荐使用谷歌浏览器（本地运行），其余浏览器可能需要服务器（ie不支持本地调用localstorage）</p>';
	html+='<p>6、其他功能自行探索</p>';
	$('#help').addClass('help').html(html);
	$.playground().startGame(function(){
	});

}
/*卡牌详情界面*/
function deckDetailInit(uid){
	console.log('deckDetailInit');	
	/**/	
	if(pInfo.cards.length>0){
		clearScence();
		var deckIndex = getDeckIndexByUid(uid);
		$('#base').playground({width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
			/*设置背景图层*/
			.addGroup('bgGroup',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
			.addSprite('bg',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT,animation:commImgMap['bg1Anim']})
			.end();
		addLeftCardDetailSpire();
		$.playground()
			.addGroup('cardGroup',{width:CARD_INFO_BG_WIDTH,height:CARD_INFO_BG_HEIGHT,posx:20+CARD_PIC_WIDTH,posy:30,animation:commImgMap['cdAnim']})
			.addSprite('cardInfo',{width:CARD_INFO_BG_WIDTH,height:CARD_INFO_BG_HEIGHT,posx:25,posy:10})
			.end()
			/*工具栏图层*/
			.addGroup('toolGroup',{width:TOOL_WIDTH,height:TOOL_HEIGHT,posx:TOOL_X,posy:TOOL_Y})		
			.addSprite('backBtn',{width:BTN_WIDTH,height:BTN_HEIGHT,posx:20,posy:10,animation:commImgMap['backBtnAnimation']})
			.addSprite('preBtn',{width:BTN_WIDTH,height:BTN_HEIGHT,posx:20+BTN_WIDTH,posy:10,animation:commImgMap['preBtnAnimation']})
			.addSprite('nextBtn',{width:BTN_WIDTH,height:BTN_HEIGHT,posx:20+BTN_WIDTH*2,posy:10,animation:commImgMap['nextBtnAnimation']})
			.addSprite('saleBtn',{width:BTN_WIDTH,height:BTN_HEIGHT,posx:20+BTN_WIDTH*3,posy:10,animation:commImgMap['saleBtnAnimation']})
			.addSprite('strBtn',{width:BTN_WIDTH,height:BTN_HEIGHT,posx:20+BTN_WIDTH*4,posy:10,animation:commImgMap['strBtnAnim']})
			.addSprite('heartBtn',{width:BTN_WIDTH,height:BTN_HEIGHT,posx:20+BTN_WIDTH*5,posy:10,animation:commImgMap['heartBtnAnim']})
			.addSprite('pageInfo',{width:BTN_WIDTH*3,height:BTN_HEIGHT,posx:130+BTN_WIDTH*5,posy:10})
			.end();
		var c = pInfo.cards[deckIndex];
		refreshDeckInfo(c);
		refreshSecretBtn(c);
		$('#pageInfo').css('padding-top',40).css('font-size',42)
		.text((deckIndex+1)+'/'+pInfo.cards.length);
		/*绑定按钮事件*/
		$('#preBtn').click(function(){
			if(deckIndex > 0){		
				deckIndex--;
				var c = pInfo.cards[deckIndex];
				refreshDeckInfo(c);
				refreshSecretBtn(c);
			}else{
				c_alert('该牌是第一张',null);
			}
			$('#pageInfo').text((deckIndex+1)+'/'+pInfo.cards.length);
		});
		$('#nextBtn').click(function(){
			if(deckIndex < pInfo.cards.length - 1){
				deckIndex++;
				var c = pInfo.cards[deckIndex];
				refreshDeckInfo(c);
				refreshSecretBtn(c);
			}else{
				c_alert('该牌是最后一张',null);
			}
			$('#pageInfo').text((deckIndex+1)+'/'+pInfo.cards.length);		
		});
		$('#backBtn').click(function(){
			/*clearEvolveCards(false);*/
			clearScence();
			gameInit();
		});
		$('#saleBtn').click(function(){
			if(pInfo.cards.length > 0){	
				var delIndex = deckIndex;
				if(pInfo.cards.length == 1){
					$('#cardPic').setAnimation(null);
					$('#cardInfo').html('');
				}else if(deckIndex == pInfo.cards.length - 1){				
					deckIndex -= 1;							
				}
				pInfo.cards.splice(delIndex,1);			
				var c = pInfo.cards[deckIndex];
				refreshDeckInfo(c);
				pInfo.money += CARD_SALE_COUNT;
				autoSave();
				//查询相关信息
				refreshTopInfo();
			}else{
				c_alert('无卡牌',null);
			}

			var cur = pInfo.cards.length == 0?0:(deckIndex+1);
			$('#pageInfo').text(cur +'/'+pInfo.cards.length);
		});

		$('#strBtn').click(function(){
			clearScence();
			deckInit(pInfo.cards[deckIndex].uid);
		});

		$('#heartBtn').click(function(){
			var c = pInfo.cards[deckIndex];
			if(toogleCardH(c)){
				refreshDeckInfo(c);
				autoSave();
			}	
		});

		$.playground().startGame(function(){
		});
	}else{
		c_alert('无卡牌!',null);
	}
	
}

/*卡组强化界面*/
function deckInit(uid){
	console.log('deckInit');
	var deckIndex = getDeckIndexByUid(uid);
	$('#base').playground({width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
		/*设置背景图层*/
		.addGroup('bgGroup',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
		.addSprite('bg',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT,animation:commImgMap['bg1Anim']})
		.end();
	addLeftCardDetailSpire();
	$.playground()
		.addGroup('cardGroup',{width:CARD_INFO_BG_WIDTH,height:CARD_INFO_BG_HEIGHT,posx:20+CARD_PIC_WIDTH,posy:30,animation:commImgMap['cibAnim']})
		.addSprite('cardInfo',{width:0,height:0})
		.end()
		/*工具栏图层*/
		.addGroup('toolGroup',{width:TOOL_WIDTH,height:TOOL_HEIGHT,posx:TOOL_X,posy:TOOL_Y})		
		.addSprite('backBtn',{width:BTN_WIDTH,height:BTN_HEIGHT,posx:20,posy:10,animation:commImgMap['backBtnAnimation']})
		.addSprite('strBtn1',{width:BTN_WIDTH,height:BTN_HEIGHT,posx:20 + BTN_WIDTH,posy:10,animation:commImgMap['strBtnAnim']})
		.end();

	/*添加强化=进化按钮*/
	$('#cardGroup')
		.addSprite('preview',{width:CARD_INFO_BG_HEIGHT,height:CARD_BTN_SIZE,posx:10,posy:10})
		.addSprite('addBtn1',{width:CARD_BTN_SIZE,height:CARD_BTN_SIZE,posx:10,posy:100,animation:commImgMap['addBtnAnim']})
		.addSprite('addBtn2',{width:CARD_BTN_SIZE,height:CARD_BTN_SIZE,posx:155,posy:100,animation:commImgMap['addBtnAnim']})
		.addSprite('addBtn3',{width:CARD_BTN_SIZE,height:CARD_BTN_SIZE,posx:300,posy:100,animation:commImgMap['addBtnAnim']})
		.addSprite('addBtn4',{width:CARD_BTN_SIZE,height:CARD_BTN_SIZE,posx:10,posy:300,animation:commImgMap['addBtnAnim']})
		.addSprite('addBtn5',{width:CARD_BTN_SIZE,height:CARD_BTN_SIZE,posx:155,posy:300,animation:commImgMap['addBtnAnim']})
		.addSprite('addBtn6',{width:CARD_BTN_SIZE,height:CARD_BTN_SIZE,posx:300,posy:300,animation:commImgMap['addBtnAnim']});

	/*绑定按钮事件*/
	for(var i = 0; i < 6; i++){
		$('#addBtn'+(i+1)).click({"i":i,"uid":uid},function(e){
			clearScence();
			selectCard(e.data.i,pInfo.strCardsUid,'deckInit'+'('+e.data.uid+')',e.data.uid);
		});
	}

	$('#strBtn1').click(function(){
		strengthCard(deckIndex);
		/*自动保存*/
		autoSave();
	});
	
	if(pInfo.cards.length>0){
		var c = pInfo.cards[deckIndex];
		refreshDeckInfo(c);
	}else{
		c_alert('无卡牌!',null);
		clearScence();
		gameInit();
	}
	
	$('#backBtn').click(function(){
		/*清空强化数组和进化数组,不删除卡牌*/
		clearStrCards(false);
		deckDetailInit(pInfo.cards[deckIndex].uid);
	});	

	refreshCardEditInfo(pInfo.cards[deckIndex]);
	$.playground().startGame(function(){
	});
}

/*副本列表初始化*/
function instanceInit(){
	console.log('instanceInit');
	if(pInfo.instances.length==0){
		gameInit();
		c_alert('目前并未出现异变!',null);
	}else{	
		$('#base').playground({width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
			/*设置背景图层*/
			.addGroup('bgGroup',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
			.addSprite('bg',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT,animation:commImgMap['bg1Anim']})
			.end();
		addLeftCardDetailSpire();
		$.playground()
			.addGroup('cardGroup',{width:CARD_INFO_BG_WIDTH,height:CARD_INFO_BG_HEIGHT,posx:20+CARD_PIC_WIDTH,posy:30,animation:commImgMap['cdAnim']})
			.addSprite('cardInfo',{width:400,height:CARD_PIC_HEIGHT,posx:25,posy:10})
			.end()
			/*工具栏图层*/
			.addGroup('toolGroup',{width:TOOL_WIDTH,height:TOOL_HEIGHT,posx:TOOL_X,posy:TOOL_Y})
			.addSprite('preBtn',{width:INSTANCE_ITEM_WIDTH,height:INSTANCE_ITEM_HEIGHT,posx:60+250,posy:10,animation:commImgMap['preBtnAnimation']})
			.addSprite('nextBtn',{width:INSTANCE_ITEM_WIDTH,height:INSTANCE_ITEM_HEIGHT,posx:60+500,posy:10,animation:commImgMap['nextBtnAnimation']})
			.addSprite('backBtn',{width:INSTANCE_ITEM_WIDTH,height:INSTANCE_ITEM_HEIGHT,posx:60,posy:10,animation:commImgMap['backBtnAnimation']})
			.end();

		refreshInstanceInfo(pInfo.instances[0]);

		var index = 0;
		var INSTANCE_T = setInterval(function(){
			if(pInfo.instances.length == 0){
				$('#backBtn').click();
			}else{
				if(index < pInfo.instances.length){

				}else{
					index = 0;
				}
				refreshInstanceInfo(pInfo.instances[index]);
				/*$('#deadline2').text(pInfo.instances[index].getDeadlineString());	*/
			}			
			
		},1000);
		/*绑定副本按钮事件*/
		$('#preBtn').click(function(){
			if(index > 0){
				index--;
				refreshInstanceInfo(pInfo.instances[index]);
			}else{
				c_alert('第一个副本',null);
			}
		});
		$('#nextBtn').click(function(){
			if(index < pInfo.instances.length - 1){
				index++;
				refreshInstanceInfo(pInfo.instances[index]);
			}else{
				c_alert('最后一个副本',null);
			}
		});
		$('#backBtn').click(function(){
			clearInterval(INSTANCE_T);
			INSTANCE_T = null;
			clearScence();
			gameInit();
		});
		$('#cardPic').click(function(){
			clearInterval(INSTANCE_T);
			INSTANCE_T = null;
			battleInit(pInfo.instances,index);
		});	

		$.playground().startGame(function(){
		});
	}
}

/*邮件界面初始化*/
function eMailInit(){
	console.log('eMailInit');

	$('#base').playground({width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
		/*设置背景图层*/
		.addGroup('bgGroup',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
		.addSprite('bg',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT,animation:commImgMap['bg1Anim']}).
		end()
		/*工具栏图层*/
		.addGroup('toolGroup',{width:TOOL_WIDTH,height:TOOL_HEIGHT,posx:TOOL_X,posy:TOOL_Y})
		.addSprite('preBtn',{width:INSTANCE_ITEM_WIDTH,height:INSTANCE_ITEM_HEIGHT,posx:60+250,posy:10,animation:commImgMap['preBtnAnimation']})
		.addSprite('nextBtn',{width:INSTANCE_ITEM_WIDTH,height:INSTANCE_ITEM_HEIGHT,posx:60+500,posy:10,animation:commImgMap['nextBtnAnimation']})
		.addSprite('backBtn',{width:INSTANCE_ITEM_WIDTH,height:INSTANCE_ITEM_HEIGHT,posx:60,posy:10,animation:commImgMap['backBtnAnimation']})
		.end();
	/*绑定副本按钮事件*/
	$('#backBtn').click(function(){
		clearScence();
		gameInit();
	});

	$.playground().startGame(function(){
	});
}

/*召唤界面初始化*/
function summonInit(){
	console.log('summonInit');
	$('#base').playground({width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
		/*设置背景图层*/
		.addGroup('bgGroup',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
		.addSprite('bg',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT,animation:commImgMap['bgAnimation']})
		.addSprite('summonPre',{width:SUMMONPRE_WIDTH,height:SUMMONPRE_HEIGHT,posx:(SCREEN_WIDTH - SUMMONPRE_WIDTH)/2,posy:(SCREEN_HEIGHT - SUMMONPRE_HEIGHT)/2 - 30,animation:commImgMap['summonPreAnim']})
		.end()
		/*设置辅助妖精图层*/
		.addGroup('fairyGroup',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT}).end()
		/*设置工具图层*/
		.addGroup('toolGroup',{width:TOOL_WIDTH,height:TOOL_HEIGHT,posx:TOOL_X,posy:TOOL_Y})
		.addSprite('backBtn',{width:BTN_WIDTH,height:BTN_HEIGHT,animation:commImgMap['backBtnAnimation'],posx:10})
		.addSprite('summon1Btn',{width:BTN_SUMMON_WIDTH,height:BTN_SUMMON_HEIGHT,posx:60+BTN_WIDTH*1,animation:commImgMap['s1Animation']})
		.addSprite('summon10Btn',{width:BTN_SUMMON_WIDTH,height:BTN_SUMMON_HEIGHT,posx:60+BTN_WIDTH*4,animation:commImgMap['s10Animation']})
		.end();
	addTopInfoSpire();
	refreshTopInfo();
	/*按钮事件*/
	$('#backBtn').click(function(){
		clearScence();
		gameInit();
	});
	$('#summon1Btn').click(function(){
		summonResultInit(10,0);
	});
	$('#summon10Btn').click(function(){
		summonResultInit(10,1);
	});
	$.playground().startGame(function(){
	});
}

/*召唤结果初始化*/
function summonResultInit(num,type){
	console.log('summonResultInit');
	/*召唤信息设置*/
	var valid = false,msg = '';
	if(type==0){
		valid = COMM_SUMMON_PRICE > pInfo.money;
		msg = '金币不足';
	}else{
		valid = SPEC_SUMMON_PRICE > pInfo.diamond;
		msg = '钻石不足';
	}

	if(!valid){
		valid = pInfo.cards.length > (CARD_MAX_COUNT - num);
		msg = '卡组容量不足，请到卡组界面处理';
	}
	if(valid){
		c_alert(msg,function(){
		});
	}else{		
		if(type==0){
			pInfo.money -= COMM_SUMMON_PRICE;
		}else{
			pInfo.diamond -= SPEC_SUMMON_PRICE;
		}
		var newCards = generateCards(num,type);
		pInfo.cards = pInfo.cards.concat(newCards);

		clearScence();
		/*显示总的结果，卡牌头像*/
		$('#base').playground({width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
			/*设置背景图层*/
			.addGroup('bgGroup',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
			.addSprite('bg',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT,animation:commImgMap['bg1Anim']})
			.end()
			/*设置妖精显示图层*/
			.addGroup('fairyGroup',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT})		
			.addSprite('cardPic0',{width:CARD_PIC_WIDTH,height:CARD_PIC_HEIGHT,posx:20,posy:30})
			.addSprite('cardPic',{width:CARD_PIC_WIDTH,height:CARD_PIC_HEIGHT,posx:20-CARD_PIC_WIDTH,posy:30})				
			.addSprite('cardName',{width:180,height:30,posx:40,posy:40})	
			.addSprite('cardAtk',{width:90,height:30,posx:185,posy:383})	
			.addSprite('cardHp',{width:90,height:30,posx:200,posy:432})	
			.addSprite('cardLv',{width:60,height:40,posx:245,posy:40})
			.addSprite('cardStars',{width:20,height:200,posx:21,posy:60})
			.end()
			.addGroup('cardGroup',{width:CARD_INFO_BG_WIDTH,height:CARD_INFO_BG_HEIGHT,posx:20+CARD_PIC_WIDTH,posy:30,animation:commImgMap['cdAnim']})
			.addSprite('cardInfo',{width:CARD_PIC_WIDTH,height:CARD_PIC_HEIGHT,posx:25,posy:10})
			.end()
			/*设置工具图层*/
			.addGroup('toolGroup',{width:TOOL_WIDTH,height:TOOL_HEIGHT,posx:TOOL_X,posy:TOOL_Y})
			.addSprite('backBtn',{width:BTN_WIDTH,height:BTN_HEIGHT,posx:10})
			.end();

		var index = 0;
		$('#cardInfo').html('');
		$('#cardPic0').setAnimation(cardBack[newCards[0].stars-1]);
		/*按钮事件*/
		$('#cardPic').click(function(){
			index++;
			if(index < newCards.length){
				refreshSummonDeckInfo(newCards[index],false);
			}else{
				refreshSummonDeckInfo(null,false);
				/*显示总结果*/
				$('#cardPic0').remove();
				$('#cardPic').remove();
				$('#cardGroup').remove();
				
				var COL_NUM = 5;
				for(var i = 0; i < newCards.length; i++){
					var c = newCards[i];
					var row = Math.floor(i/COL_NUM);
					var col = i%COL_NUM;
					var anim = new $.gQ.Animation({ imageURL:cardBasePath+c.id+'/'+cardIconPre+'.png'});
					$('#fairyGroup').addSprite(c.id+'',{width:CARD_SIZE,height:CARD_SIZE,animation:anim,posx:10 + col*CARD_SIZE,posy:85+row*CARD_SIZE});
				}

				$('#backBtn').setAnimation(commImgMap['backBtnAnimation']).click(function(){
					clearScence();
					summonInit();
				});
			}
			
		});

		$('#cardPic0').click(function(){
			refreshSummonDeckInfo(newCards[index],true);
		});
		$.playground().startGame(function(){
		});
		/*自动保存*/
		autoSave();
	}	
}

