/*根据参数生成随机卡片*/
function generateCards(num,type){
	var arr = [];
	for(var i = 0; i < num ; i++){
		var seed = Math.random();
		var star = 1;
		/*获取星级*/
		while(seed>starP[type][star-1]){
			seed -= starP[type][star-1];
			star++;
		}
		console.log(seed+','+star);
		/*根据星级随机抽取对应星级的卡牌*/
		var index = Math.floor(Math.random()*sCardCount[star-1]);
		for(var n = 0; n < cardDatabase.length;n++){
			var c = cardDatabase[n];
			if(c.compareStars(star)){
				if(index == 0){
					arr.push(c.instance());
					break;
				}
				index--;
			}
		}
	}
	var uid = Date.now();
	for(var i = 0; i < arr.length; i++){
		arr[i].setUid(uid+i);
	}
	return arr;
}

/*根据卡牌种类返回卡牌*/
function getCardById(id){
	var r = null;
	for(var n = 0; n < cardDatabase.length;n++){
		var c = cardDatabase[n];
		if(c.compareId(id)){
			r = c.instance();
			break;
		}
	}
	return r;
}

/*清空当前界面元素*/
function clearScence(){
	console.log('clearScence');
	$.playground().pauseGame();
	$.playground().clearAll(function(){
	});
}

/*刷新卡牌的信息*/
function refreshDeckInfo(deck){
	if(deck){
		var c = deck;
		var imgUrl = getDeckPicPath(deck);
		var anim = new $.gQ.Animation({ imageURL: imgUrl});
		$('#cardPic').setAnimation(anim);
		/*升级还需的经验*/
		var expStr = '--/--';
		if(c.level < c.maxLevel){
			expStr = c.exp+'/'+c.getCurLevelExp(c.level);
		}
		var html = 
		  '<p class="deck-detail">名称：'+c.name+'</p>'
		+ '<p class="deck-detail">生命：'+c.hp+'</p>'
		+ '<p class="deck-detail">攻击：'+c.atk+'</p>'		
		+ '<p class="deck-detail">等级：'+c.level+'/'+c.maxLevel+'</p>'
		+ '<p class="deck-detail">经验：'+expStr+'</p>'
		+ '<p class="deck-detail">稀有度：'+c.stars+'星</p>'
		+ '<p class="deck-detail">攻击成长：'+c.growAtk+'</p>'
		+ '<p class="deck-detail">生命成长：'+c.growHp+'</p>'
		+ '<p class="deck-detail">技能名称：'+c.skill.name+'</p>'
		+ '<p class="deck-detail">技能效果：'+c.skill.desc+'</p>'
		+ '<p class="deck-detail">可进化:'+(c.evolution==0?'不可进化':c.evolution)+'</p>';

		$('#cardInfo').html(html);
		/*设置左边卡牌的数值*/
		$('#cardName').addClass('card-info').html('<span>'+c.name+'</span>');
		$('#cardHp').addClass('card-info').html('<span>'+c.hp+'</span>');
		$('#cardAtk').addClass('card-info').html('<span>'+c.atk+'</span>');
		$('#cardLv').addClass('card-info').html('<span>'+c.level+'</span>');

		html = '';
		for(var i = 0; i < c.stars; i++){
			html+='<img style="width:20px;" src="./resources/images/sys/star.png">';
		}
		$('#cardStars').html(html);
	}else{

	}
}

/*更新秘密图标按钮--仅在卡牌详情页面*/
function refreshSecretBtn(deck){
	if(deck){
		if(deck.elo && deck.h){
			$('#heartBtn').css('display','block');
		}else{
			$('#heartBtn').css('display','none');
		}
	}else{
		$('#heartBtn').css('display','none');
	}

}

/*刷新副本选择界面的信息*/
function refreshInstanceInfo(monster){
	if(monster){
		var c = monster.monster;
		var anim = new $.gQ.Animation({ imageURL: bossBasePath+c.id+'/pic.png'});
		$('#cardPic').setAnimation(anim);
		/*升级还需的经验*/
		var html = 
		  '<p class="deck-detail">名称：'+c.name+'</p>'
		+ '<p class="deck-detail">生命：'+c.hp1+'</p>'
		+ '<p class="deck-detail">攻击：'+c.atk+'</p>'		
		+ '<p class="deck-detail">等级：'+c.level+'</p>'
		+ '<p class="deck-detail">消费：'+c.power+'体力</p>'
		+ '<p class="deck-detail">稀有度：'+c.stars+'星</p>'
		+ '<p class="deck-detail">剩余时间：<span id="deadline2">'+monster.getDeadlineString()+'</span></p>';

		var rewards = c.rewards;
		var str = '';
		for(var key in rewards){
			if(key == 'money'){
				str+=' 金币';
			}else if(key == 'power'){
				str+=' 体力';
			}else if(key == 'diamond'){
				str+=' 钻石';
			}else if(key == 'card'){
				str+=' 经验素材';
			}
			if(rewards[key].p < 1){
				str+='(概率)';
			}
		}
		html += '<p class="deck-detail">掉落：'+str+'</p>' 
		+ '<p class="deck-detail font-danger">点击卡牌进入战斗</p>';

		$('#cardInfo').html(html);
		/*设置左边卡牌的数值*/
		$('#cardName').addClass('card-info').html('<span>'+c.name+'</span>');
		$('#cardHp').addClass('card-info').html('<span>'+c.hp1+'</span>');
		$('#cardAtk').addClass('card-info').html('<span>'+c.atk+'</span>');
		$('#cardLv').addClass('card-info').html('<span>'+c.level+'</span>');

		html = '';
		for(var i = 0; i < c.stars; i++){
			html+='<img style="width:20px;" src="./resources/images/sys/star.png">';
		}
		$('#cardStars').html(html);
	}else{

	}
}

/*更新召唤卡牌结果显示动画*/
function refreshSummonDeckInfo(deck,show){
	if(show){
		/*向右移动*/
		$('#cardPic0').setAnimation(null);
		$('#cardPic').x(300,true);
		refreshDeckInfo(deck);
		audioPlay(battleAudio['bell']);
	}else{
		/*设置初始位置*/
		$('#cardPic').x(-300,true);
		$('#cardPic').setAnimation(null);
		$('#cardInfo').html('');
		/*清除左边卡牌的数值*/
		$('#cardName').html('');
		$('#cardHp').html('');
		$('#cardAtk').html('');
		$('#cardLv').html('');
		$('#cardStars').html('');
		
		if(deck){
			$('#cardPic0').setAnimation(cardBack[deck.stars-1]);
		}		
	}
}
/*
	更新卡牌强化信息
	card表示要强化的卡牌
*/
function refreshCardEditInfo(card){
	/*强化、进化界面以及提示信息*/
	var materials = [];
	var hasSecret = false;
	for(var i = 0; i < pInfo.strCardsUid.length;i++){
		var uid = pInfo.strCardsUid[i];
		var c = getCardByUid(uid);
		materials.push(c);
		if(c){
			var anim = new $.gQ.Animation({ imageURL: cardBasePath+c.id+'/icon.png'});
			$('#addBtn'+(i+1)).setAnimation(anim);
			if(!hasSecret){
				for(var j = 0; j < SECRET_CARD_IDS.length;j++){
					hasSecret = c.id == SECRET_CARD_IDS[j];
					if(hasSecret){
						break;
					}
				}
			}
		}
	}
	

	var preview = card.preGrow(materials);
	preview.fullLv = card.level == card.maxLevel;
	/*if(card.elo && !card.h){
	}else{
		if(hasSecret){
			preview.msg = '神秘卡牌不会提供任何效果和经验!';
		}
	}*/

	var level = card.level == card.maxLevel?'已满级':preview.level;
	var envolution = card.evolution == 0 ?'最高形态':preview.evolution;
	var html = '<div><div class="preview-info">生命：'+preview.hp+'</div><div class="preview-info">攻击：'+preview.atk+'</div></div>'
	+'<div><div class="preview-info">等级：'+level+'</div><div class="preview-info">可进化：'+envolution+'</div></div>';
	$('#preview').html(html);
	
	return preview;
}

/*设置阵容时更新选中卡片的信息*/
function refreshSelectDeckInfo(deck,selected,uid){
	if(deck){
		var c = deck;
		var imgUrl = getDeckPicPath(deck);
		var anim = new $.gQ.Animation({ imageURL: imgUrl});
		$('#cardPic').setAnimation(anim);
		/*升级还需的经验*/
		var html = 
		  '<p class="deck-detail">名称：'+c.name+'</p>'
		+ '<p class="deck-detail">生命：'+c.hp+'</p>'
		+ '<p class="deck-detail">攻击：'+c.atk+'</p>'		
		+ '<p class="deck-detail">等级：'+c.level+'/'+c.maxLevel+'</p>'
		+ '<p class="deck-detail">稀有度：'+c.stars+'星</p>'	
		+ '<p class="deck-detail">技能名称：'+c.skill.name+'</p>'
		+ '<p class="deck-detail">技能效果：'+c.skill.desc+'</p>';
		if(deck.compareUid(uid)){
			html += '<p class="deck-detail">状态：已选择</p>';	
		}else{
			html += '<p class="deck-detail">状态：'+(selected?'已选择':'未选择')+'</p>';	
		}		

		$('#cardInfo').html(html);

		/*设置左边卡牌的数值*/
		$('#cardName').addClass('card-info').html('<span>'+c.name+'</span>');
		$('#cardHp').addClass('card-info').html('<span>'+c.hp+'</span>');
		$('#cardAtk').addClass('card-info').html('<span>'+c.atk+'</span>');
		$('#cardLv').addClass('card-info').html('<span>'+c.level+'</span>');

		html = '';
		for(var i = 0; i < c.stars; i++){
			html+='<img style="width:20px;" src="./resources/images/sys/star.png">';
		}
		$('#cardStars').html(html);
	}else{

	}
}
/*检查阵容是否合法*/
function checkLineUp(){
	var b = true;
	b = pInfo.lineUp.length==4;
	if(b){
		for(var i = 0; i < pInfo.lineUp.length;i++){
			var uid = pInfo.lineUp[i];
			var finded = false;
			for(var j = 0; j < pInfo.cards.length;j++){
				var c = pInfo.cards[j];
				if(c.compareUid(uid)){
					finded = true;
					break;
				}
			}
			if(!finded){
				b = false;
				break;
			}
		}
	}
	return b;
}

/*更新阵容显示*/
function refreshLineUp(){
	var sumHp = 0,sumAtk = 0;
	for(var i = 0; i < 4; i++){
		var uid = pInfo.lineUp[i];
		if(uid){
			for(var j = 0; j < pInfo.cards.length; j++){
				var c = pInfo.cards[j];
				if(c.compareUid(uid)){
					var anim = new $.gQ.Animation({ imageURL: cardBasePath+c.id+'/icon.png'});
					$('#addBtn'+(i+1)).setAnimation(anim);
					var html = '';				
					html = '<p>HP:'+c.hp+'</p>'
						+'<p>ATK:'+c.atk+'</p>';
					if(i == 0){						
						html += '<p style="font-size:20px;">队长属性1.5倍</p>';
						sumHp += parseInt(c.hp*1.5);
						sumAtk += parseInt(c.atk*1.5);
					}else{
						sumHp += c.hp;
						sumAtk += c.atk;
					}

					$('#addDetail'+(i+1)).html(html);
					break;
				}
			}
		}
	}
	//summary
	var html = '<p>总HP:'+sumHp+'</p>'
		+'<p>总ATK:'+sumAtk+'</p>';
	/*$('#summary').html(html);*/
}

/*返回阵容对应的卡牌数组*/
function getLineUpCards(){
	var arr = [];
	for(var i = 0; i < 4; i++){
		var uid = pInfo.lineUp[i];
		var c = getCardByUid(uid);
		if(c){
			arr.push(c);
		}
	}
	return arr;
}
/*根据uid查找卡牌*/
function getCardByUid(uid){
	var result = null;
	if(uid){
		for(var j = 0; j < pInfo.cards.length; j++){
			var c = pInfo.cards[j];
			if(c.compareUid(uid)){
				result = c;	
				break;
			}
		}
	}
	return result;
}

/*更新顶部信息*/
function refreshTopInfo(){
	$('#money').text(pInfo.money);
	$('#power').text(pInfo.power);
	$('#diamond').text(pInfo.diamond);
}

/*添加顶部图层*/
function addTopInfoSpire(){
	/*设置信息图层*/
	$.playground()
		.addGroup('infoGroup',{width:INFO_WIDTH,height:INFO_HEIGHT})
		.addSprite('money',{width:INFO_ITEM_WIDTH,height:INFO_ITEM_HEIGHT,posx:75,posy:20})
		.addSprite('power',{width:INFO_ITEM_WIDTH,height:INFO_ITEM_HEIGHT,posx:325,posy:20})
		.addSprite('diamond',{width:INFO_ITEM_WIDTH,height:INFO_ITEM_HEIGHT,posx:575,posy:20});
}

/*cards中是否存在deck*/
function existsDeck(deck,cards){
	var exists = false;
	for(var i = 0; i < cards.length;i++){
		if(deck.uid == cards[i]){
			exists = true;
			break;
		}
	}
	return exists;
}
/*保存*/
function save(){
	var json = {};
	json.autoSave = pInfo.autoSave;
	json.money = pInfo.money;
	json.power = pInfo.power;
	json.diamond = pInfo.diamond;
	json.sys = pInfo.sys;
	var data = JSON.stringify(json);
	var data2 = localStorage.getItem("East.Save.base");
	if(data != data2){
		localStorage.setItem("East.Save.base",data);
	}
	

	json = {};
	json.cards = pInfo.cards;
	data = JSON.stringify(json);
	data2 = localStorage.getItem("East.Save.cards");
	if(data != data2){
		localStorage.setItem("East.Save.cards",data);
	}
	

	json = {};
	json.lineUp = pInfo.lineUp;
	data = JSON.stringify(json);
	data2 = localStorage.getItem("East.Save.lineUp");
	if(data != data2){
		localStorage.setItem("East.Save.lineUp",data);	
	}	

	json = {};
	json.instances = pInfo.instances;
	data = JSON.stringify(json);
	data2 = localStorage.getItem("East.Save.instances");
	if(data != data2){
		localStorage.setItem("East.Save.instances",data);	
	}
	
}

/*读取*/
function load(){
	var base = localStorage.getItem("East.Save.base");
	var json = null;
	if(base){
		pInfo = JSON.parse(base);
		pInfo.strCardsUid = [];/*选择的强化的卡牌素材*/
		pInfo.evolveCardsUid = [];/*选择的进化的卡牌素材,丢弃*/
		/* 
			卡牌数据
			把cards变为对象
		*/
		base = localStorage.getItem("East.Save.cards");
		var json = JSON.parse(base);
		var nCards = [];
		for(var i = 0; i < json.cards.length;i++){
			var c = json.cards[i];
			var n = new card(c.id,c.stars,c.name,c.atk,c.hp,c.desc,c.growAtk,c.growHp,c.skill,c.elo);
			n.setEvolution(c.evolution);
			n.setMaxLevel(c.maxLevel);
			n.setLevel(c.level);
			n.setExp(c.exp);
			n.setUid(c.uid);
			n.setStateElo(c.stateElo);
			n.setH(c.h);
			nCards.push(n);
		}
		pInfo.cards = nCards;
		/* 
			阵容数据
		*/
		base = localStorage.getItem("East.Save.lineUp");
		var json = JSON.parse(base);
		pInfo.lineUp = json.lineUp;
		/*
			副本数据
		*/
		base = localStorage.getItem("East.Save.instances");
		var json = JSON.parse(base);
		nCards = [];
		for(var i = 0; i < json.instances.length;i++){
			var c = json.instances[i];
			var m = c.monster;
			var n = new InstanceData(c.url,c.deadline,
				new Monster(m.id,m.name,m.hp,m.atk,m.hit,m.rewards,m.power,m.stars,m.level));			
			nCards.push(n);
		}
		pInfo.instances = nCards;		
	}
}

/*执行任务*/
function execTasks(){
	/*延时加载音效*/
	setTimeout(function(){
		audioInit();
	},5000);

	/*定时检查副本剩余时间,如果剩余时间为0则删除*/
	setInterval(function(){
		for(var i = pInfo.instances.length - 1; i >= 0 ;i--){
			if(pInfo.instances[i].isDead()){
				pInfo.instances.splice(i,1);
				/*自动保存*/
				autoSave();
			}
		}
	},1000);

	/*定时生成副本任务*/
	var INTERVAL = 300;
	var t = INTERVAL;
	setInterval(function(){
		
		if(pInfo.instances.length >= 10){
			$('#change').addClass('change').text('请迅速处理异变！');
		}else{
			$('#change').addClass('change').text('距离下次异变还有'+t+'秒');
			if(t <= 0){
				t = INTERVAL;
				var index = parseInt(Math.random()*instanceDatabase.length);
				var instance = instanceDatabase[index].copy();
				instance.setDeadline(Date.now() + 3600*1000);
				/*生成随机奖励*/
				var rewards = generateMRewards(instance.monster);
				instance.monster.setRewards(rewards);
				pInfo.instances.push(instance);
				/*自动保存*/
				autoSave();
			}
		}
		t--;
		
	},1000);

	/*定时回复体力*/
	setInterval(function(){
		if(pInfo.power < 100){
			pInfo.power++;
			refreshTopInfo();
			/*自动保存*/
			autoSave();
		}
	},60000);
}


/*强化卡牌*/
function strengthCard(deckIndex){
	console.log('strengthCard');
	var c = pInfo.cards[deckIndex];
	var preview = refreshCardEditInfo(c);
	console.log(preview);
	if(c.elo && c.h){
		c_alert('已激活神秘效果，请到卡牌功能查看!');
	}else if(!c.elo && preview.fullLv && preview.evolution == 0){
		c_alert('已满级，无需强化！');
	}else{
		c.grow(preview);
		/*删除强化的卡牌*/
		clearStrCards(true);
		deckDetailInit(c.uid);	
	}	
}

/**/
function evolveCard(deckIndex){
	console.log('');
	/*清空对应的卡牌*/
}

/**/
function execByFuncName(func){
	console.log('execByFuncName:'+func);
	/*eval('test(args)')*/
	eval(func);
}
/*清空强化数组和进化数组,不删除卡牌*/
function clearStrCards(remove){
	var arr = pInfo.strCardsUid;
	if(remove){
		for(var j = 0; j < arr.length;j++){
			var uid = arr[j];
			for(var i = 0;i < pInfo.cards.length;i++){
				var c = pInfo.cards[i];
				if(c && c.compareUid(uid)){
					pInfo.cards.splice(i,1);
				}
			}
		}
		
	}
	arr.splice(0,arr.length);
}
/*丢弃该方法*/
function clearEvolveCards(remove){
	var arr = pInfo.evolveCardsUid;
	if(remove){
		for(var j = 0; j < arr.length;j++){
			var uid = arr[j];
			for(var i = 0;i < pInfo.cards.length;i++){
				var c = pInfo.cards[i];
				if(c && c.compareUid(uid)){
					pInfo.cards.splice(i,1);
				}
			}
		}
		
	}
	arr.splice(0,arr.length);
}

/*根据uid获取牌组的序号*/
function getDeckIndexByUid(uid){
	var deckIndex = 0;
	if(uid){
		for(var i = 0; i < pInfo.cards.length;i++){
			var c = pInfo.cards[i];
			if(c.compareUid(uid)){
				deckIndex = i;
				break;
			}		
		}
	}	
	return deckIndex;
}

/*添加界面左侧卡牌上的图层元素*/
function addLeftCardDetailSpire(){
	$.playground()
		.addGroup('infoGroup',{width:INSTANCE_WIDTH,height:INSTANCE_HEIGHT})
		.addSprite('cardPic',{width:CARD_PIC_WIDTH,height:CARD_PIC_HEIGHT,posx:20,posy:30})
		.addSprite('cardName',{width:180,height:30,posx:40,posy:40})	
		.addSprite('cardAtk',{width:90,height:30,posx:185,posy:383})	
		.addSprite('cardHp',{width:90,height:30,posx:200,posy:432})	
		.addSprite('cardLv',{width:60,height:40,posx:245,posy:40})
		.addSprite('cardStars',{width:20,height:200,posx:21,posy:60});
}
/*初始化常用图片*/
function loadCommonImage(){
	for(var i = 0;i < 5;i++){
		cardBack.push(
				new $.gQ.Animation({ imageURL:'./resources/images/cards/back/star'+(i+1)+'Back.png'})
			);
	}

	commImgMap = [];
	var key = ['startBgAnim','bgAnimation','bg1Anim','bResultBgAnim','battleBorderAnim',
	'battleBgAnim','startBtnAnimation','configBtnAnimation','mailBtnAnimation','summonBtnAnimation',
	'cardBtnAnimation','bagBtnAnimation','instanceBtnAnimation','saleBtnAnimation','lineUpBtnAnim',
	'addBtnAnim','okBtnAnim','exitBtnAnim','preBtnAnimation','nextBtnAnimation','backBtnAnimation','s1Animation',
	's10Animation','sound1BtnAnim','sound2BtnAnim','saveBtnAnim',
	'loadBtnAnim','cibAnim','cdAnim','strBtnAnim','strBtn1Anim','summonPreAnim','dialogAnim','closeBtnAnim','heartBtnAnim'];
	var value = ['./resources/images/sys/startBg.jpg','./resources/images/sys/bg.jpg',
	'./resources/images/sys/bg1.jpg','./resources/images/sys/bResultBg.jpg',
	'./resources/images/battle/battle-1.png','./resources/images/battle/battleBg1.png',
	'./resources/images/sys/startBtn.gif','./resources/images/sys/configBtn.png',
	'./resources/images/sys/mailBtn.png','./resources/images/sys/summonBtn.png',
	'./resources/images/sys/cardBtn.png','./resources/images/sys/bagBtn.png',
	'./resources/images/sys/instanceBtn.png','./resources/images/sys/buy.png',
	'./resources/images/sys/lineUp.png','./resources/images/sys/add.png',
	'./resources/images/sys/ok1.png','./resources/images/sys/exit.png',
	'./resources/images/sys/left.png','./resources/images/sys/right.png',
	'./resources/images/sys/back.png','./resources/images/sys/10W.png',
	'./resources/images/sys/98.png','./resources/images/sys/sound1.png',
	'./resources/images/sys/sound2.png','./resources/images/sys/save.png',
	'./resources/images/sys/load.png','./resources/images/sys/cardInfoBg.png',
	'./resources/images/sys/cardDetail.png','./resources/images/sys/strBtn.png',
	'./resources/images/sys/strBtn1.png','./resources/images/sys/summonPre.png',
	'./resources/images/sys/dialog-2.png','./resources/images/sys/close-1.png',
	'./resources/images/sys/heart.png'];

	for(var i = 0;i < key.length;i++){
		commImgMap[key[i]] = new $.gQ.Animation({ imageURL:value[i]});
	}
}

/*显示对话框*/
function c_alert(msg,callback){
	$.playground()
		.addGroup('dialogGroup',{width:SCREEN_WIDTH,height:SCREEN_HEIGHT})
		.addSprite('dialogBg',{width:370,height:240,posx:(SCREEN_WIDTH-370)/2,posy:(SCREEN_HEIGHT-240)/2,animation:commImgMap['dialogAnim']})
		.addSprite('closeBtn',{width:100,height:100,posx:(SCREEN_WIDTH+370)/2-100,posy:(SCREEN_HEIGHT-240)/2,animation:commImgMap['closeBtnAnim']})
		.addSprite('msg',{width:300,height:100,posx:(SCREEN_WIDTH-300)/2,posy:(SCREEN_HEIGHT-100)/2});

	$('#msg').addClass('c_alert').html(msg);

	$('#closeBtn').click(function(event) {		
		$('#dialogGroup').remove();
		if(typeof callback == 'function'){
			callback();
		}
	});
};
/*显示战斗伤害*/
function displayDamage(obj,damage){
	obj.text(damage);
	setTimeout(function(){
		obj.text('');
	},1000);
}
/*自动保存*/
function autoSave(){
	if(pInfo.autoSave){
		save();
	}
}
/*根据anim名称获取动画对象*/
function getAnim(name){
	var anim = null;
	if('magicAnim' == name){
		anim = new $.gQ.Animation({ imageURL: './resources/images/anim/magic.png',
			numberOfFrame: 12,
			delta: 400,
			rate: 150,
			type: $.gQ.ANIMATION_HORIZONTAL|$.gQ.ANIMATION_ONCE|$.gQ.ANIMATION_CALLBACK});
	}else if('boomAnim' == name){	
		anim = new $.gQ.Animation({ imageURL: './resources/images/anim/boom.png',
			numberOfFrame: 4,
			delta: 400,
			rate: 200,
			type: $.gQ.ANIMATION_HORIZONTAL|$.gQ.ANIMATION_ONCE|$.gQ.ANIMATION_CALLBACK});
	}else if('attackAnim' == name){	
		anim = new $.gQ.Animation({ imageURL: './resources/images/anim/attack.png',
			numberOfFrame: 5,
			delta: 400,
			rate: 200,
			type: $.gQ.ANIMATION_HORIZONTAL|$.gQ.ANIMATION_ONCE|$.gQ.ANIMATION_CALLBACK});
	}


	return anim;
}
/*吟唱技能*/
function speakSkill(){
	var c = getCardByUid(pInfo.lineUp[0]);
	if(c){
		if(c.skill.audio && c.skill.audio.length > 0){
			var index = 'skill-'+c.id;
			if(battleAudio[index]){
				audioPlay(battleAudio[index]);	
			}else{
				/*加载音效*/
				battleAudio[index] = new $.gameQuery.SoundWrapper(c.skill.audio,false);
				battleAudio[index].load(function(){
					audioPlay(battleAudio[index]);
				});
			}			
		}else{
			audioPlay(battleAudio['magic']);			
		}		
	}	
}

/*生成怪物的随机奖励*/
function generateMRewards(monster){
	/*根据怪物稀有度影响奖励的多寡和数量*/
	/*
		奖励分为：金币、体力、钻石、经验卡
	*/
	var rewards = {
			"money":{"min":1000,"max":3000,"p":1}
		};

	if(monster){
		var stars = monster.stars;
		var power = monster.power;
		/*金币--所有怪必定掉落*/
		rewards.money = {"min":parseInt(1000*stars/2),"max":1000*stars,"p":1};
		/*体力--根据星级，星级越高掉落概率越高*/
		var r = Math.random();
		if(r < stars*0.1){
			rewards.power = {"min":1,"max":parseInt(power/2),"p":1};
		}
		/*钻石--5星以上才会掉落,根据星级，星级越高掉落概率越高*/
		if(stars >= 5){
			 r = Math.random();
			if(r < (stars*0.1 - 0.4)){
				rewards.diamond = {"min":1,"max":stars*2,"p":1};
			}
		}
		/*经验素材--星级越高掉落的经验素材的星级就越高,掉落几率均为10%*/
		r = Math.random();
		if(r < 1){
			r = Math.random();		
			r += (stars - 3)*0.1;
			if(r >= 1){
				r = 0.99;
			}
			var offset = 1/EXP_CARD_IDS.length;
			var index = parseInt(r/offset);
			rewards.card = EXP_CARD_IDS[index];
		}
	}

	return rewards;
}

/*获取卡牌显示大图的路径*/
function getDeckPicPath(c){
	var path = '';
	if(c){
		if(c.elo && c.h && c.stateElo){
			path = cardHPath+c.id+'/pic.png';
		}else{
			path = cardBasePath+c.id+'/pic.png';
		}
	}
	return path;
}

/*变更卡牌的神秘状态*/
function toogleCardH(c){
	var b = false;
	if(c){
		if(c.elo && c.h){
			c.stateElo = !c.stateElo;
			b = true;
		}
	}
	return b;
}

/*音效初始化*/
function audioInit(){			
	battleAudio['lightning'] = new $.gameQuery.SoundWrapper('./resources/audio/lightning.wav',false);
	battleAudio['sword'] = new $.gameQuery.SoundWrapper('./resources/audio/sword.wav',false);
	battleAudio['success'] = new $.gameQuery.SoundWrapper('./resources/audio/success.wav',false);
	battleAudio['failed'] = new $.gameQuery.SoundWrapper('./resources/audio/failed.wav',false);
	battleAudio['tiger'] = new $.gameQuery.SoundWrapper('./resources/audio/tiger.wav',false);
	battleAudio['magic'] = new $.gameQuery.SoundWrapper('./resources/audio/magic.wav',false);
	battleAudio['bell'] = new $.gameQuery.SoundWrapper('./resources/audio/bell.wav',false);

	for(index in battleAudio){
		battleAudio[index].load();
	}
}

/*声音播放*/
function audioPlay(audio){
	if(!pInfo.sys.muted && audio && audio.ready()){
		audio.play();
	}
}

/*加载战斗音效等资源*/
function loadBattleResource(){
	var c = getCardByUid(pInfo.lineUp[0]);
	if(c){
		if(c.skill.audio && c.skill.audio.length > 0){
			var index = 'skill-'+c.id;
			if(battleAudio[index]){
			}else{
				/*加载音效*/
				battleAudio[index] = new $.gameQuery.SoundWrapper(c.skill.audio,false);
				battleAudio[index].load();
			}			
		}		
	}	
}