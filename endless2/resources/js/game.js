$(document).ready(function(){	
	var initT = setInterval(function(){
		if(gameState.changed){
			gameState.changed = false;
			init()
		}else if(gameState.value == 3){
			clearInterval(initT);
		}
	},200);
})


/*游戏初始化*/
function init(){
	switch(gameState.value){
		case 0://初始化资源
			initResources();
		break;	
		case 1://初始阿虎界面
			initGui();	
		break;	
		case 2://开始游戏
			$.playground().startGame(function(){	
				if(gameState){
					gameState.change();
				}	
				auto();
				console.log("start game!");		
			});	
		break;
	}
	
}

/*界面初始化*/
function initGui(){
	$('#baseContainer')
		.playground({width:SCREEN_SIZE.width,height:SCREEN_SIZE.height});
	initLeftPanel();
	initRightPanel();
	if(gameState){
		gameState.change();
	}	
}

/*左侧面板初始化*/
function initLeftPanel(){
	var w = LEFT_PANEL_SIZE.width,h = LEFT_PANEL_SIZE.height;
	$.playground().
		addGroup("leftPGroup",{width:w,height:h})
			.addSprite("leftBg",{animation: animMap["leftBgAnim"],width:w,height:h})
			.addSprite("leftWeapon",{animation: animMap["leftWeaponAnim"],width:100,height:200,posy:400,posx:150})
			.addGroup("leftPanelTopGroup",{width:w,height:100})
				.addSprite("lptHp",{width:300,height:30,posx:118,posy:12})
				.addSprite("lptBg",{animation: animMap["lptBg"],width:w,height:100})
				.addSprite("lptLevel",{width:100,height:40,posx:20,posy:12}).end()
			.addGroup("missileGroup",{width:w,height:h}).end()
			.addGroup("boomEffectGroup",{width:w,height:50,posx:-50}).end()
			.addGroup("transitionGroup",{width:w,height:0}).end();

	//设置过渡层底色	
	$('#transitionGroup').css('background-color',TRANSITION_CLOR);
}

/*右侧侧面板初始化*/
function initRightPanel(){
	var w = LEFT_PANEL_SIZE.width,h = LEFT_PANEL_SIZE.height;
	$.playground()
		.addGroup("rightPGroup",{width:w,height:h,posx:400})
			.addSprite("rightBg",{animation: animMap["rightBgAnim"],width:w,height:h})
			.addSprite("rightWeapon",{animation: animMap["rightWeaponAnim"],width:250,height:400,posy:100})
			.addSprite("rightWeaponData",{width:150,height:400,posy:100,posx:250})
			.addGroup("rightBottomGroup",{width:w,height:200,posy:400})
				.addSprite("rightHpMask",{width:200,height:140,posy:165})
				.addSprite("rightBottomBg",{animation: animMap["rightBottomBg"],width:w,height:200})				
				.addSprite("lvUpBtn",{animation: animMap["lvUpBtn"],width:150,height:150,posy:22,posx:220});

	$('#rightHpMask').css('background-color','red');
	$('#lvUpBtn').on('click',function(e){
		var tmp = canWeaponUp();
		if(tmp.success){
			weaponUp();
		}
	});
	refreshWeaponData();
}

/*自动战斗*/
function auto(){
	var w = LEFT_PANEL_SIZE.width,h = LEFT_PANEL_SIZE.height;
	threads.missile = setInterval(function(){
		/*发射导弹*/
		var m = new missile(200,400,Date.now(),-1,parseInt(Math.random()*3));
		memoryInfo.missiles.push(m);
		$('#missileGroup').addSprite(m.getId(),{width:40,height:80,posx:m.x,posy:m.y,animation:animMap['missileAnim']});
	},300);

	threads.collision = setInterval(function(){		
		var arr = memoryInfo.missiles;
		for(var i = arr.length - 1;i >= 0;i--){
			var missile = arr[i];
			var result = missile.move();
			/*碰撞检测*/
			if(result.y < 100){
				//删除导弹
				arr.splice(i,1);
				$('#'+missile.getId()).remove();
				//将伤害值放入队列
				memoryInfo.damages.push(sysInfo.weapon.atk);
				/*添加爆炸效果*/
				var rx = result.x,ry = 60;
				var boomAnim =  new $.gQ.Animation({ 
					imageURL: "./resources/images/boomAnim.png",
					numberOfFrame: 4,
					delta: 80,
					rate: 120,
					type:$.gQ.ANIMATION_HORIZONTAL | $.gQ.ANIMATION_ONCE |$.gQ.ANIMATION_CALLBACK
				});
				$("#boomEffectGroup")
					.addSprite(missile.getBoomId(),{animation: boomAnim,width:80,height:80,posx:rx,posy:ry,callback:function(obj){
						$(obj).remove();
					}});
			}
		}

	},50);

	/*计算伤害*/
	threads.damage = setInterval(function(){
		if(memoryInfo.damages.length > 0){
			sysInfo.boss.hp = sysInfo.boss.hp - memoryInfo.damages[0];
			if(sysInfo.boss.hp < 0){
				sysInfo.boss.hp = 0;
			}
			memoryInfo.damages.splice(0,1);
			refreshBossInfo();
			bossLevelUp();
		}
	},100)
}

/*初始化boss信息*/
function initBossInfo(){
	sysInfo.boss.hp0 = sysInfo.boss.level*100;
	sysInfo.boss.hp = sysInfo.boss.hp0;
	memoryInfo.damages = [];
	memoryInfo.missiles = [];
}

/*刷新boss信息*/
function refreshBossInfo(){
	$('#lptLevel').text("lv"+sysInfo.boss.level);
	var hpWidth = parseInt(270*sysInfo.boss.hp/sysInfo.boss.hp0);
	$('#lptHp').css("background-color","red").css("width",hpWidth);
}

/*boss升级*/
function bossLevelUp(){
	//当前boss已经死亡
	if(sysInfo.boss.hp == 0){
		//停止计时器
		for(thread in threads){
			var t = threads[thread];
			if(t){
				clearInterval(t);	
				threads[thread] = null;			
			}
		}
		//添加过度动画
		$('#transitionGroup').css('height',600);
		//清楚全部效果
		$('#missileGroup').empty();
		//$('#boomEffectGroup').empty();		
		//升级 -- 增加物品
		bossRewards();
		sysInfo.boss.level = sysInfo.boss.level+1;
		initBossInfo();	
		refreshBossInfo();	
		setTimeout(function(){
			$('#transitionGroup').css('height',0);
			//开启新的战斗
			auto();
		},1000);
		
	}
}

/*boss升级，获取奖励*/
function bossRewards(){
	sysInfo.items.blood = sysInfo.items.blood + sysInfo.boss.hp0;
	refreshBlood();
	//每5级可以获取特殊奖励
	if(sysInfo.boss.level%5==0){
		var seed = Math.random();
		//20%的几率获取石头
		if(seed > 0.2 && seed < 0.4){
			sysInfo.items.stone = sysInfo.items.stone + sysInfo.boss.level*5;
		}
		seed = Math.random();
		if(seed > 0.65 && seed < 0.8){//15%的几率获取卡牌碎片			
			var index = parseInt(Math.random()*sysInfo.items.cards.length);
			sysInfo.items.cards[index].add(5);
		}
	}
}

/*刷新武器数据*/
function refreshWeaponData(){
	var html = '<span class="weapon-data"><p>属性</p>';
	html += '<p>攻击力:'+sysInfo.weapon.atk+'</p>';
	html += '<p>暴击率:'+sysInfo.weapon.hit+'</p>';
	html += '<p>等级:'+sysInfo.weapon.level+'</p></span>';
	$('#rightWeaponData').html(html);
}

/*武器是否可以升级*/
function canWeaponUp(){
	var tmp = getWeaponUpData();
	var y = 165;
	var p = 0;
	if(sysInfo.items.blood>=tmp){
		p = 1;
	}else{
		p = sysInfo.items.blood/tmp
	}
	return {"success":sysInfo.items.blood>=tmp,"percent":p};
}

/*武器升级*/
function weaponUp(){
	//消耗血气
	sysInfo.items.blood = sysInfo.items.blood - getWeaponUpData();
	sysInfo.weapon.level = sysInfo.weapon.level+1;
	sysInfo.weapon.atk = sysInfo.weapon.level*10;
	refreshWeaponData();
	refreshBlood();

}

/**/
function getWeaponUpData(){
	return (2*sysInfo.weapon.level+1)*300;
}
/*刷新血气升级槽*/
function refreshBlood(){
	//计算升级武器需要的血气值
	var tmp = canWeaponUp();
	var y = 130*(1-tmp.percent)+35;
	$('#rightHpMask').y(y,false);
}