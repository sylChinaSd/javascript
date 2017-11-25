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
			if(key == 'card'){
				var card = getCardById(this.rewards[key]);
				if(card){
					result[key] = card;	
				}
			}else{			
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
		}
		return result;
	}
	this.setRewards = function(r){
		this.rewards = r;
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
var card = function(id,stars,name,atk,hp,desc,growAtk,growHp,skill,elo){
	/**/
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
	/*卡牌特殊效果*/
	this.elo = elo;/*是否支持*/
	this.h = false;/*是否激活*/
	this.stateElo = false;/*当前状态*/
	/*抽到卡时候生成的序列号*/
	this.uid = '';

	/*返回卡牌的副本*/
	this.instance = function(){
		var c = new card(this.id,this.stars,this.name,
			this.atk,this.hp,this.desc,this.growAtk,this.growHp,this.skill,this.elo);
		c.setEvolution(this.evolution);
		c.setMaxLevel(this.maxLevel);
		c.setLevel(this.level);
		c.setExp(this.exp);
		c.setStateElo(this.stateElo);
		c.setH(this.h);
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
		var hasSecret = false;
		if(cards && cards.length > 0){
			for(var i = 0;i < cards.length;i++){
				var c = cards[i];
				if(c){
					exp += this.getCardExp(c);
					/*是否是同种卡片*/
					if(this.compareId(c.id)){
						if(evolve < this.evolution){
							evolve++;
						}						
					}

					/*检测是否含有神秘卡牌*/
					if(this.elo && !this.h && !hasSecret){
						for(var j = 0; j < SECRET_CARD_IDS.length;j++){
							hasSecret = c.id == SECRET_CARD_IDS[j];
							break;
						}
					}					
				}				
			}
		}
		var result = {level:this.level,exp:this.exp,atk:this.atk,hp:this.hp,evolution:evolve,h:hasSecret};
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
				}else{//达到最大等级跳出
					break;
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
		if(data.h){
			this.h = data.h;
		}
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
				result += card.stars*10000;
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
			for(var i = 0; i < EXP_CARD_IDS.length;i++){
				b = (card.id == EXP_CARD_IDS[i]);
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
	this.setStateElo = function(b){
		this.stateElo = b;
	}
	this.setH = function(b){
		this.h = b;
	}
}

/* 副本数据*/
var InstanceData = function(url,deadline,monster){
	this.url = url;
	this.deadline = deadline;
	this.monster = monster;

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