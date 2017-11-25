/*敌人、玩家*/
/*reward = {max:1,min:0}*/
var Monster = function(id,name,hp,atk,hit,rewards,power,stars,level){
	this.id = id;
	this.name = name;
	this.hp = hp;
	this.hp1 = hp;
	this.atk = atk;
	this.hit = hit;
	this.rewards = rewards;
	this.power = power;
	this.level = level;
	this.stars = stars;

	/*复制该实例*/
	this.copy = function(){
		return new Monster(this.id,this.name,this.hp,
			this.atk,this.hit,this.rewards,this.power,
			this.stars,this.level);	
	}
	this.attack = function(obj){
		/*所有攻击都有10%的几率暴击，1.5倍伤害*/
		var damage = this.atk;
		if(Math.random() < this.hit){
			damage = Math.floor(1.5*this.atk);
		}

		obj.hp -= damage;
		if(obj.hp < 0){
			obj.hp = 0;
		}
		return damage;
	}

	/**/
	this.isDead = function(){
		return this.hp == 0;
	}

	this.getRewards = function(){
		var result = {};
		for(var key in this.rewards){
			var value = this.rewards[key];
			/*物品掉落几率*/
			var p = value.p;
			/*掉落数量*/
			var data = 0;
			/*当前掉落几率参考*/
			var chance = Math.random();
			if(chance < p){
				data = Math.floor(Math.random()*(value.max - value.min)) + value.min;
			}
			/*设置当前物品掉落数量*/
			if(data > 0){
				result[key] = data;			
			}			
		}
		return result;
	}

	this.setId = function(id){
		this.id = id;
	}

	this.reset = function(){
		this.hp = this.hp1;		
	}
}
/*玩家继承monster*/
/*
	name:名称
	hp:根据出战阵容计算hp
	atk:根据出战阵容计算hp
	rewards:
	cards:出战阵容
*/
var Player = function(name,hp,atk,rewards,cards){
	hp = 0;
	atk = 0;
	var hit = 0;
	var id = null;
	/*重置buff值*/
	for(var i = 0 ; i < cards.length; i++){
		var c = cards[i];
		if(c){
			c.buffValue = [0,0,0];
		}
	}
	/*重新计算buff值*/
	for(var i = 0 ; i < cards.length; i++){
		var c = cards[i];
		if(c){
			var type = c.skill.type;
			switch(type){
				case -1:{

				}
				break;
				case 0:
				case 1:
				case 2:{
					c.buffValue[type%3] += c.skill.val;
				}
				break;
				case 3:
				case 4:
				case 5:{
					var c1 = null,c2 = null;
					if(i-1>=0){
						c1 = cards[i-1];
						c1.buffValue[type%3] += c.skill.val;
					}
					if(i+1 < cards.length){
						c2 = cards[i+1];
						c2.buffValue[type%3] += c.skill.val;
					}
				}
				break;
				case 6:
				case 7:
				case 8:{
					for(var m = 0; m < cards.length;m++){
						var c1 = cards[m];
						if(c1){
							c1.buffValue[type%3] += c.skill.val;
						}
					}
				}
				break;
			}

		}
	}
	/*根据buff计算总值*/
	for(var i = 0 ; i < cards.length; i++){
		var c = cards[i],leaderBuff = 0;
		if(c){
			if(i == 0){
				leaderBuff = 0.5;
			}
			hp += parseInt((c.buffValue[0]+1+leaderBuff)*c.hp);
			atk += parseInt((c.buffValue[1]+1+leaderBuff)*c.atk);
			hit += (c.buffValue[2]+1+leaderBuff)*c.stars*0.01;
		}
	}
	this.cards = cards;	
	var args = [id,name,hp,atk,hit,rewards,0,0,0];
	console.log(args);
	Monster.apply(this,args);
}
/*技能类*/
/*
	name-技能名称,
	desc-技能描述
	anim-技能动画对应图片的路径
	autdio-音效对应的路径,
	type-0：自身hp，1：自身atk，2：自身hit，3：相邻卡牌hp
		4：相邻卡牌atk，5：相邻卡牌hit，6：全员hp，7：全员atk，
		8：全员hit,-1：无效果
	val-影响的数值
*/
var skill = function(name,desc,anim,audio,type,val){
	this.name = name;
	this.desc = desc;
	this.anim = anim;
	this.audio = audio;
	this.type = type;
	this.val = val;

}
/*卡片属性*/
var card = function(id,stars,name,atk,hp,desc,growAtk,growHp,skill){
	/**/
	this.EXP_CARD = [29,31,38,47];
	/*卡牌的id*/
	this.id = id;
	/*卡牌的稀有度*/
	this.stars = stars;
	/*卡牌的最大等级*/	
	if(this.stars < 4){
		this.maxLevel = 30;
	}else{
		this.maxLevel = stars*10;	
	}
	/*卡牌剩余德尔突破次数*/
	if(this.stars == 4){
		this.evolution = 3;
	}else if(this.stars == 5){
		this.evolution = 4;
	}else{
		this.evolution = 0;	
	}	
	/*卡牌的当前等级*/
	this.level = 1;
	/*卡牌名称*/
	this.name = name;
	/*卡牌的攻击力*/
	this.atk = atk;
	/*生命值*/
	this.hp = hp;
	/*卡牌描述*/
	this.desc = desc;
	/*当前经验*/
	this.exp = 0;
	/*每次升级带来的攻击、生命值得成长*/
	this.growAtk = growAtk;
	this.growHp = growHp;
	/*该卡牌受到的影响的数值，依次为hp，atk，hit*/
	this.buffValue = [];
	this.skill = skill;
	/*抽到卡时候生成的序列号*/
	this.uid = '';

	/*返回卡牌的副本*/
	this.instance = function(){
		var c = new card(this.id,this.stars,this.name,
			this.atk,this.hp,this.desc,this.growAtk,this.growHp,this.skill);
		c.setEvolution(this.evolution);
		c.setMaxLevel(this.maxLevel);
		c.setLevel(this.level);
		c.setExp(this.exp);
		return c;
	}
	/*比较稀有度*/
	this.compareStars = function(stars){
		return this.stars == stars;
	}
	/*设置uid*/
	this.setUid = function(uid){
		this.uid = uid;
	}
	/*比较uid，查看是否是同一张卡片*/
	this.compareUid = function(uid){
		return this.uid == uid;
	}
	/*比较id，查看是否是同一种卡片*/
	this.compareId = function(id){
		return this.id == id;
	}
	/*获取经验值并进行等级增长验证的预料结果*/
	this.preGrow = function(cards){		
		/*预览结果*/
		var exp = 0;
		var evolve = 0;
		if(cards && cards.length > 0){
			for(var i = 0;i < cards.length;i++){
				var c = cards[i];
				if(c){
					exp += this.getCardExp(c);
					/*是否是同种卡片*/
					if(this.compareId(c.id)){
						evolve++;
					}
				}
				
			}
		}
		var result = {level:this.level,exp:this.exp,atk:this.atk,hp:this.hp,evolution:evolve};
		/*可升级,否则什么都不用做*/
		if(this.level < this.maxLevel){
			while(exp != 0){
				if(result.level < this.maxLevel){
					var difference = this.getCurLevelExp(result.level) - result.exp;
					/*需要的经验小于能够提供的经验,可以升级*/
					if(difference <= exp){
						result.level++;
						result.hp += this.growHp;
						result.atk += this.growAtk;
						result.exp = 0;
						exp -= difference;
					}else{//不能升级
						result.exp += exp;
						exp = 0;
					}
				}
			}
		}
		return result;		
	}
	/*卡牌进化*/
	this.evolve = function(count){
		var evo = this.evolution>count?count:this.evolution;
		this.maxLevel += 10*evo;
		this.evolution -= evo;
	}
	/*卡牌成长*/
	this.grow = function(data){
		this.level = data.level;
		this.hp = data.hp;
		this.atk = data.atk;
		this.evolve(data.evolution);
		this.exp = data.exp;

	}
	/*获取当前等级升级需要的经验*/
	this.getCurLevelExp = function(lv){
		return parseInt(lv*lv*lv/10)+100;
	}
	/*获取强化卡的经验*/
	this.getCardExp = function(card){
		var factor = 0.3 ;
		var result = 0;
		if(card){
			if(this.isExpCard(card)){
				result += card.stars*3000;
			}else{
				factor += card.stars*0.1;
				var lv = card.level;
				var exp = card.exp;
				result += (0.1*lv*lv*(lv-1)*(lv-1)*0.25 + lv*100);	
			}
			
		}
		return parseInt(result*factor);
	}
	this.isExpCard = function(card){
		var b = false;
		if(card){
			for(var i = 0; i < this.EXP_CARD.length;i++){
				b = (card.id == this.EXP_CARD[i]);
				if(b){
					break;
				}
			}
		}
		return b;
	}
	/*设置最大等级*/
	this.setMaxLevel = function(lv){
		this.maxLevel = lv;
	}
	/*设置当前经验*/
	this.setExp = function(exp){
		this.exp = exp;
	}
	this.setLevel = function(lv){
		this.level = lv;
	}
	this.setEvolution = function(evolution){
		this.evolution = evolution;
	}
}

/* 副本数据*/
var InstanceData = function(url,deadline,monster){
	this.url = url;
	this.deadline = deadline;
	this.monster = monster;
	this.aa = 0;

	this.copy = function(){
		return new InstanceData(this.url,this.deadline,this.monster.copy());
	}
	this.setDeadline = function(t){
		this.deadline = t;
	}
	this.isDead = function(){
		return this.deadline < Date.now();
	}
	this.getDeadlineString = function(){
		var sub = this.deadline - Date.now();
		var str = '';
		if(sub <= 0){
			str = '00:00:00';
		}else{
			var d = new Date(sub);
			var h = (d.getHours() - 8)+''; 
			var m = d.getMinutes()+'';
			var s = d.getSeconds()+'';
			h = h.length < 2?('0'+h):h;
			m = m.length < 2?('0'+m):m;
			s = s.length < 2?('0'+s):s;
			str = h+':'+m+':'+s ;
		}
		return str;
	}
}

/*游戏窗口尺寸*/
var SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = 600;
/*按钮尺寸*/
var BTN_WIDTH = 100;
var BTN_HEIGHT = 100;

var BTN_SUMMON_WIDTH = 200;
var BTN_SUMMON_HEIGHT = BTN_HEIGHT;

var BTN_SIZE_64 = 64;
var BTN_START_WIDTH = 300;
var BTN_START_HEIGHT = BTN_HEIGHT;

var SUMMONPRE_WIDTH = 700;
var SUMMONPRE_HEIGHT = 400;
/*工具栏位置*/
var TOOL_WIDTH = SCREEN_WIDTH;
var TOOL_HEIGHT = 120;
var TOOL_X = 0;
var TOOL_Y = SCREEN_HEIGHT - TOOL_HEIGHT;
/*信息栏位置及尺寸*/
var INFO_WIDTH = SCREEN_WIDTH;
var INFO_HEIGHT = 60;
var INFO_ITEM_WIDTH = 260;
var INFO_ITEM_HEIGHT = INFO_HEIGHT;
/*对话框位置尺寸*/
var DIALOG_WIDTH = 300;
var DIALOG_HEIGHT = 300;
var DIALOG_X = (SCREEN_WIDTH - DIALOG_WIDTH)/2;
var DIALOG_Y = (SCREEN_HEIGHT - DIALOG_HEIGHT)/2;
/*副本列表尺寸和位置*/
var INSTANCE_WIDTH = SCREEN_WIDTH;
var INSTANCE_HEIGHT = SCREEN_HEIGHT;
var INSTANCE_ITEM_WIDTH = 250;
var INSTANCE_ITEM_HEIGHT = 400;
var INSTANCE_ICON_SIZE = 300;
var COMM_SUMMON_PRICE = 100000;
var SPEC_SUMMON_PRICE = 98;

/*卡牌*/
var cardDatabase = [];
/*副本数据*/
var instanceDatabase = [];
/*玩家信息*/
var pInfo = {
	autoSave:true,
	money:1000000,/*金币*/
	power:100,/*体力*/
	diamond:1000,/*钻石*/
	cards:[],/**/
	strCardsUid:[],/*选择的强化的卡牌素材*/
	evolveCardsUid:[],/*选择的进化的卡牌素材,丢弃*/
	lineUp:[],/*出战阵容*/
	instances:[],/*当前出现的副本*/
	sys:{/*系统信息*/
		save:"cardSave",
		muted:false
	}
};
/*音效*/
var battleAudio = [];
/*卡牌背面*/
var cardBack = [];
/*常用图片*/
var commImgMap = [];

var cardBasePath = './resources/images/cards/';
var bossBasePath = './resources/images/boss/';
var cardIconPre = 'icon';
var cardPre = 'card';
/*星级对应的概率*/
var starP = [
	/*金币召唤的概率*/
	[0.44,0.37,0.13,0.05,0.01],
	/*钻石召唤的概率*/
	[0.00,0.4,0.3,0.2,0.1]
];
/*星级对应的总卡牌数量*/
var sCardCount = [0,0,0,0,0];
/**/
var CARD_SIZE = 150;
var CARD_PIC_WIDTH = 300;
var CARD_PIC_HEIGHT = 460;
var CARD_INFO_BG_WIDTH = 460;
var CARD_INFO_BG_HEIGHT = CARD_PIC_HEIGHT;
var CARD_SALE_COUNT = 1000;
var CARD_BTN_SIZE = CARD_SIZE;
var CARD_MAX_COUNT = 100;


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
	.addSprite('startBtn',{width:BTN_START_WIDTH,height:BTN_START_HEIGHT,posx:px,posy:py,animation:commImgMap['startBtnAnimation']});
	
	/*开始按钮事件*/
	$.playground().startGame(function(){
	});

	$('#startBtn').click(function(){
		execTasks();
		clearScence();
		gameInit();	
	});	
}

/*音效初始化*/
function audioInit(){			
	battleAudio['lightning'] = new $.gameQuery.SoundWrapper('./resources/audio/lightning.wav',false);
	battleAudio['sword'] = new $.gameQuery.SoundWrapper('./resources/audio/sword.wav',false);
	battleAudio['success'] = new $.gameQuery.SoundWrapper('./resources/audio/success.wav',false);
	battleAudio['failed'] = new $.gameQuery.SoundWrapper('./resources/audio/failed.wav',false);

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
	var monster = arr[index].monster;
	if(pInfo.power < monster.power){
		c_alert('至少需要体力:'+monster.power,function(){
		});		
	}else{
		/*玩家、怪物*/
		var battleCards = getLineUpCards();

		var player = new Player('',0,0,{},battleCards);	
		var boss = monster;
		boss.reset();

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
		audioPlay(battleAudio['lightning']);	
		attackAnim = getAnim('boomAnim');
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
		pInfo[key] += rewards[key];
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
		var name = '';
		if(key =='power'){
			name = '体力';
		}else if(key =='money'){
			name = '金币';
		}else if(key =='diamond'){
			name = '钻石';
		}
		html += '<p style="margin-left:15px;">'+name+'：'+rewards[key]+'</p>';
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
		.end()
		/*工具栏图层*/
		.addGroup('toolGroup',{width:TOOL_WIDTH,height:TOOL_HEIGHT,posx:TOOL_X,posy:TOOL_Y})		
		.addSprite('backBtn',{width:BTN_WIDTH,height:BTN_HEIGHT,posx:20,posy:10,animation:commImgMap['backBtnAnimation']})
		.addSprite('soundBtn',{width:BTN_WIDTH,height:BTN_HEIGHT,posx:20 + BTN_WIDTH*1,posy:10,animation:(pInfo.sys.muted?commImgMap['sound2BtnAnim']:commImgMap['sound1BtnAnim'])})
		.addSprite('saveBtn',{width:BTN_WIDTH,height:BTN_HEIGHT,posx:20 + BTN_WIDTH*2,posy:10,animation:commImgMap['saveBtnAnim']})
		.addSprite('loadBtn',{width:BTN_WIDTH,height:BTN_HEIGHT,posx:20 + BTN_WIDTH*3,posy:10,animation:commImgMap['loadBtnAnim']})
		.addSprite('exitBtn',{width:BTN_WIDTH,height:BTN_HEIGHT,posx:20 + BTN_WIDTH*4,posy:10,animation:commImgMap['exitBtnAnim']})
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

	$('#saveBtn').click(function(){
		save();
	});

	$('#loadBtn').click(function(){
		load();
	});

	$('#exitBtn').click(function(){
		save();
		setTimeout(function(){
			window.close();
		},1000);
	});
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
			.addSprite('pageInfo',{width:BTN_WIDTH*3,height:BTN_HEIGHT,posx:100+BTN_WIDTH*5,posy:10})
			.end();
		var c = pInfo.cards[deckIndex];
		refreshDeckInfo(c);
		$('#pageInfo').css('padding-top',40).css('font-size',42)
		.text((deckIndex+1)+'/'+pInfo.cards.length);
		/*绑定按钮事件*/
		$('#preBtn').click(function(){
			if(deckIndex > 0){		
				deckIndex--;
				var c = pInfo.cards[deckIndex];
				refreshDeckInfo(c);
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
				$('#deadline2').text(pInfo.instances[index].getDeadlineString());	
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
		var anim = new $.gQ.Animation({ imageURL: cardBasePath+c.id+'/pic.png'});
		$('#cardPic').setAnimation(anim);
		/*升级还需的经验*/
		var html = 
		  '<p class="deck-detail">名称：'+c.name+'</p>'
		+ '<p class="deck-detail">生命：'+c.hp+'</p>'
		+ '<p class="deck-detail">攻击：'+c.atk+'</p>'		
		+ '<p class="deck-detail">等级：'+c.level+'/'+c.maxLevel+'</p>'
		+ '<p class="deck-detail">经验：'+c.exp+'/'+c.getCurLevelExp(c.level)+'</p>'
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
			}
			if(rewards[key].p < 1){
				str+='(概率)';
			}
		}
		html += '<p class="deck-detail">掉落：'+str+'</p>';

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
	for(var i = 0; i < pInfo.strCardsUid.length;i++){
		var uid = pInfo.strCardsUid[i];
		var c = getCardByUid(uid);
		materials.push(c);
		if(c){
			var anim = new $.gQ.Animation({ imageURL: cardBasePath+c.id+'/icon.png'});
			$('#addBtn'+(i+1)).setAnimation(anim);
		}
	}
	var preview = card.preGrow(materials);
	var level = card.level == card.maxLevel?'已满级':preview.level;
	var envolution = card.evolution == 0 ?'最高形态':((preview.evolution < card.evolution)?preview.evolution : card.evolution);
	var html = '<div><div class="preview-info">生命：'+preview.hp+'</div><div class="preview-info">攻击：'+preview.atk+'</div></div>'
	+'<div><div class="preview-info">等级：'+level+'</div><div class="preview-info">可进化：'+envolution+'</div></div>';
	$('#preview').html(html);
	
	return preview;
}

/*设置阵容时更新选中卡片的信息*/
function refreshSelectDeckInfo(deck,selected,uid){
	if(deck){
		var c = deck;
		var anim = new $.gQ.Animation({ imageURL: cardBasePath+c.id+'/pic.png'});
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

/*副本数据初始化*/
function instanceDataInit(){
	var arr = [];
	var strData = [
	'./resources/images/boss/1/boss.png|1|双翅蜥蜴|20000|600|0.1|{"money":{"min":1000,"max":3000,"p":1},"power":{"min":3,"max":6,"p":0.1}}|5|3|40',
	'./resources/images/boss/2/boss.png|2|哈尔希|23000|800|0.1|{"money":{"min":2000,"max":3000,"p":1},"power":{"min":3,"max":6,"p":0.15}}|5|4|50',
	'./resources/images/boss/3/boss.png|3|异形食人蛛|30000|1600|0.2|{"money":{"min":3000,"max":8000,"p":1},"power":{"min":3,"max":6,"p":0.2}}|10|5|70',
	'./resources/images/boss/4/boss.png|4|熔岩巨兽|90000|2100|0.3|{"money":{"min":10000,"max":20000,"p":1},"power":{"min":3,"max":6,"p":0.3},"diamond":{"min":3,"max":14,"p":0.1}}|15|6|90'];
	for(var i = 0; i < strData.length; i++){
		var args = strData[i].split('|');
		var obj = new InstanceData(args[0],0,
			new Monster(parseInt(args[1]),args[2],parseInt(args[3]),
				parseInt(args[4]),parseFloat(args[5]),JSON.parse(args[6]),parseInt(args[7]),
				parseInt(args[8]),parseInt(args[9])));
		arr.push(obj);
	}
	return arr;
}

/*保存和读取*/
function save(){
	var data = JSON.stringify(pInfo);
	localStorage.setItem(pInfo.sys.save,data);
}

function load(){
	var data = null;
	var key = pInfo.sys.save;
	for(var i = 0;i < localStorage.length;i++){
		if(localStorage.key(i) == key){
			data = localStorage.getItem(pInfo.sys.save);
			break;
		}
	}
	if(data){
		pInfo = JSON.parse(data);
		/*把cards变为对象*/
		var nCards = [];
		for(var i = 0; i < pInfo.cards.length;i++){
			var c = pInfo.cards[i];
			var n = new card(c.id,c.stars,c.name,c.atk,c.hp,c.desc,c.growAtk,c.growHp,c.skill);
			n.setEvolution(c.evolution);
			n.setMaxLevel(c.maxLevel);
			n.setLevel(c.level);
			n.setExp(c.exp);
			n.setUid(c.uid);
			nCards.push(n);
		}
		pInfo.cards = nCards;
		nCards = [];
		for(var i = 0; i < pInfo.instances.length;i++){
			var c = pInfo.instances[i];
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
	var t = 300;
	setInterval(function(){
		t--;
		$('#change').addClass('change').text('距离下次异变还有'+t+'秒');
		if(t == 0 && pInfo.instances.length < 10){
			t = 300;
			var index = parseInt(Math.random()*instanceDatabase.length);
			var instance = instanceDatabase[index].copy();
			instance.setDeadline(Date.now() + 3600*1000);
			pInfo.instances.push(instance);
			/*自动保存*/
			autoSave();
		}
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


/**/
function strengthCard(deckIndex){
	console.log('strengthCard');
	var c = pInfo.cards[deckIndex];
	var preview = refreshCardEditInfo(c);
	console.log(preview);
	c.grow(preview);
	/*删除强化的卡牌*/
	clearStrCards(true);
	deckDetailInit(c.uid);
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
	'loadBtnAnim','cibAnim','cdAnim','strBtnAnim','strBtn1Anim','summonPreAnim','dialogAnim','closeBtnAnim'];
	var value = ['./resources/images/sys/startBg.jpg','./resources/images/sys/bg.png',
	'./resources/images/sys/bg1.png','./resources/images/sys/bResultBg.png',
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
	'./resources/images/sys/dialog-2.png','./resources/images/sys/close-1.png'];

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
	}
	return anim;
}
/*吟唱技能*/
function speakSkill(){
	var c = getCardByUid(pInfo.lineUp[0]);
	if(c){
		if(c.skill.audio && c.skill.audio.length > 0){
			var index = c.id+'';
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
			audioPlay(battleAudio['sword']);			
		}		
	}	
}
/*初始化卡片裤*/
function initCardDatabase(){
	var arr = [];
	var names = [];
	var index = 1;
	/*id,stars,name,atk,hp,desc,growAtk,growHp*/
	/*name,desc,anim,audio,type,val*/
	arr.push(new card(index++,3,'便装夏娜',880,840,'',29,40,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,2,'向日葵少女',820,856,'',28,20,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,2,'校园女生',863,841,'',26,21,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,3,'比基尼夏娜',899,826,'',36,34,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,3,'剑士夏娜',899,907,'',24,44,new skill('魔弹','无特殊效果','','',-1,0)));

	arr.push(new card(index++,2,'萝莉护士',890,808,'',39,18,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,3,'比基尼实玖留',853,860,'',33,33,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,1,'秋姬&素桃',901,888,'',23,35,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,2,'泳衣秋姬',800,900,'',18,20,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,1,'平井缘',803,822,'',15,17,new skill('魔弹','无特殊效果','','',-1,0)));

	arr.push(new card(index++,2,'火炬平井',867,826,'',44,44,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,2,'睡衣秋姬',927,810,'',15,21,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,3,'花魁',897,900,'',43,39,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,1,'小公主',810,800,'',19,17,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,2,'邻家小姐姐',877,862,'',24,27,new skill('魔弹','无特殊效果','','',-1,0)));

	arr.push(new card(index++,1,'回忆式夏娜',803,814,'',14,17,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,2,'青梅竹马',821,837,'',24,34,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,2,'扑杀天使',897,909,'',24,41,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,2,'玩偶修女',900,803,'',34,28,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,1,'泳装萝莉',800,800,'',16,18,new skill('魔弹','无特殊效果','','',-1,0)));

	arr.push(new card(index++,2,'恶魔歌姬',820,933,'',24,39,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,2,'冰山女仆',811,900,'',24,30,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,4,'真爱沙耶',965,923,'',71,66,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,3,'华服平井',916,806,'',44,23,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,2,'兔耳水兵',871,883,'',26,31,new skill('魔弹','无特殊效果','','',-1,0)));

	arr.push(new card(index++,4,'人偶师秋姬',937,994,'',54,67,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,1,'西亚',800,800,'',44,44,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,2,'音乐少女',800,820,'',14,23,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,1,'经验素材',830,801,'',1,1,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,3,'剑道学姐',899,908,'',34,42,new skill('魔弹','无特殊效果','','',-1,0)));

	arr.push(new card(index++,3,'经验素材',902,890,'',1,1,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,4,'兽耳新娘',963,924,'',57,68,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,2,'福利娘',872,822,'',24,14,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,2,'海浪少女',800,813,'',13,25,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,2,'祭典少女',806,840,'',34,19,new skill('魔弹','无特殊效果','','',-1,0)));

	arr.push(new card(index++,3,'朝仓凉子',903,921,'',40,46,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,2,'双子冒险家',864,890,'',34,43,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,2,'经验素材',821,900,'',1,1,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,3,'火雾战士',860,923,'',40,42,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,2,'邻家夏娜',820,833,'',34,30,new skill('魔弹','无特殊效果','','',-1,0)));

	arr.push(new card(index++,4,'恋式夏娜',930,955,'',69,57,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,2,'甜心女仆',844,820,'',18,34,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,1,'机械少女',874,802,'',17,24,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,4,'黑魔术师',890,961,'',44,72,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,1,'笨蛋情侣',809,805,'',14,17,new skill('魔弹','无特殊效果','','',-1,0)));

	arr.push(new card(index++,2,'白领夏娜',810,873,'',29,14,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,4,'经验素材',899,903,'',1,1,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,2,'太刀夏娜',800,878,'',24,43,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,5,'抚子夏娜',976,982,'',99,73,new skill('菠萝面包','提升全员10%hp','','./resources/audio/dead.wav',6,0.1)));
	arr.push(new card(index++,1,'旁观者',821,800,'',16,11,new skill('魔弹','无特殊效果','','',-1,0)));
	
	arr.push(new card(index++,1,'幼女',876,807,'',24,29,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,2,'团长',900,869,'',34,45,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,4,'樱花春日',913,955,'',44,64,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,5,'神之凝视',980,900,'',84,80,new skill('世界创造','提升自身150%暴击率','','',2,1.5)));
	arr.push(new card(index++,2,'革命春日',839,800,'',34,24,new skill('魔弹','无特殊效果','','',-1,0)));

	arr.push(new card(index++,4,'萌神有希',910,945,'',66,54,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,2,'情人节女孩',871,854,'',24,44,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,4,'魔术师秋姬',904,980,'',67,59,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,2,'百合双姬',890,810,'',31,19,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,2,'围裙女仆',870,814,'',34,34,new skill('魔弹','无特殊效果','','',-1,0)));

	arr.push(new card(index++,2,'迷之风',878,890,'',34,37,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,2,'双姬',872,898,'',29,36,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,2,'亲友团',869,823,'',34,44,new skill('魔弹','无特殊效果','','',-1,0)));
	arr.push(new card(index++,5,'青鸟穹',999,999,'',99,99,new skill('伦理破坏','提升自身ATK100%','','',1,1)));
	arr.push(new card(index++,3,'花嫁穹',919,937,'',41,47,new skill('魔弹','无特殊效果','','',-1,0)));

	arr.push(new card(index++,2,'和服穹',927,810,'',27,49,new skill('魔弹','无特殊效果','','',-1,0)));	

	/*设置卡牌星级对应的种类数量sCardCount*/
	for(var i = 0; i < arr.length;i++){
		sCardCount[arr[i].stars-1]++;
	}
	console.log(sCardCount);
	return arr;
}