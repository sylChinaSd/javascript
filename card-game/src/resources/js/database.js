/*初始化卡片裤*/
function initCardDatabase(){
	var arr = [];
	var names = [];
	var index = 1;
	/*id,stars,name,atk,hp,desc,growAtk,growHp*/
	/*name,desc,anim,audio,type,val*/
	arr.push(new card(index++,3,'便装夏娜',880,840,'',29,40,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,2,'向日葵少女',820,856,'',28,20,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,2,'校园女生',863,841,'',26,21,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,3,'比基尼夏娜',899,826,'',36,34,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,3,'剑士夏娜',899,907,'',24,44,new skill('魔弹','无特殊效果','','',-1,0),false));

	arr.push(new card(index++,2,'萝莉护士',890,808,'',39,18,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,3,'比基尼实玖留',853,860,'',33,33,new skill('魔弹','无特殊效果','','',-1,0),true));
	arr.push(new card(index++,1,'秋姬&素桃',901,888,'',23,35,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,2,'泳衣秋姬',800,900,'',18,20,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,1,'平井缘',803,822,'',15,17,new skill('魔弹','无特殊效果','','',-1,0),false));

	arr.push(new card(index++,2,'火炬平井',867,826,'',44,44,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,2,'睡衣秋姬',927,810,'',15,21,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,3,'花魁',897,900,'',43,39,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,1,'小公主',810,800,'',19,17,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,2,'邻家小姐姐',877,862,'',24,27,new skill('魔弹','无特殊效果','','',-1,0),false));

	arr.push(new card(index++,1,'回忆式夏娜',803,814,'',14,17,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,2,'青梅竹马',821,837,'',24,34,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,2,'扑杀天使',897,909,'',24,41,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,2,'玩偶修女',900,803,'',34,28,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,1,'泳装萝莉',800,800,'',16,18,new skill('魔弹','无特殊效果','','',-1,0),false));

	arr.push(new card(index++,2,'恶魔歌姬',820,933,'',24,39,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,2,'冰山女仆',811,900,'',24,30,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,4,'真爱沙耶',965,923,'',71,66,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,3,'华服平井',916,806,'',44,23,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,2,'兔耳水兵',871,883,'',26,31,new skill('魔弹','无特殊效果','','',-1,0),false));

	arr.push(new card(index++,4,'人偶师秋姬',937,994,'',54,67,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,1,'西亚',800,800,'',44,44,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,2,'音乐少女',800,820,'',14,23,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,1,'经验素材',830,801,'',1,1,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,3,'剑道学姐',899,908,'',34,42,new skill('魔弹','无特殊效果','','',-1,0),false));

	arr.push(new card(index++,3,'经验素材',902,890,'',1,1,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,4,'兽耳新娘',963,924,'',57,68,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,2,'福利娘',872,822,'',24,14,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,2,'海浪少女',800,813,'',13,25,new skill('魔弹','无特殊效果','','',-1,0),true));
	arr.push(new card(index++,2,'祭典少女',806,840,'',34,19,new skill('魔弹','无特殊效果','','',-1,0),false));

	arr.push(new card(index++,3,'朝仓凉子',903,921,'',40,46,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,2,'双子冒险家',864,890,'',34,43,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,2,'经验素材',821,900,'',1,1,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,3,'火雾战士',860,923,'',40,42,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,2,'邻家夏娜',820,833,'',34,30,new skill('魔弹','无特殊效果','','',-1,0),false));

	arr.push(new card(index++,4,'恋式夏娜',930,955,'',69,57,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,2,'甜心女仆',844,820,'',18,34,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,1,'机械少女',874,802,'',17,24,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,4,'黑魔术师',890,961,'',44,72,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,1,'笨蛋情侣',809,805,'',14,17,new skill('魔弹','无特殊效果','','',-1,0),false));

	arr.push(new card(index++,2,'白领夏娜',810,873,'',29,14,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,4,'经验素材',899,903,'',1,1,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,2,'太刀夏娜',800,878,'',24,43,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,5,'抚子夏娜',976,982,'',99,73,new skill('菠萝面包','提升全员10%hp','','./resources/audio/dead.wav',6,0.1),false));
	arr.push(new card(index++,1,'旁观者',821,800,'',16,11,new skill('魔弹','无特殊效果','','',-1,0),false));
	
	arr.push(new card(index++,1,'幼女',876,807,'',24,29,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,2,'团长',900,869,'',34,45,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,4,'樱花春日',913,955,'',44,64,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,5,'神之凝视',980,900,'',84,80,new skill('世界创造','提升自身150%暴击率','','',2,1.5),false));
	arr.push(new card(index++,2,'革命春日',839,800,'',34,24,new skill('魔弹','无特殊效果','','',-1,0),false));

	arr.push(new card(index++,4,'萌神有希',910,945,'',66,54,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,2,'情人节女孩',871,854,'',24,44,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,4,'魔术师秋姬',904,980,'',67,59,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,2,'百合双姬',890,810,'',31,19,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,2,'围裙女仆',870,814,'',34,34,new skill('魔弹','无特殊效果','','',-1,0),false));

	arr.push(new card(index++,2,'迷之风',878,890,'',34,37,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,2,'双姬',872,898,'',29,36,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,2,'亲友团',869,823,'',34,44,new skill('魔弹','无特殊效果','','',-1,0),false));
	arr.push(new card(index++,5,'神秘卡牌',1,1,'',0,0,new skill('神秘效果','不可言传','','',-1,0),false));
	arr.push(new card(index++,3,'花嫁穹',919,937,'',41,47,new skill('魔弹','无特殊效果','','',-1,0),false));

	arr.push(new card(index++,2,'和服穹',927,810,'',27,49,new skill('魔弹','无特殊效果','','',-1,0),false));	

	/*设置卡牌星级对应的种类数量sCardCount*/
	for(var i = 0; i < arr.length;i++){
		sCardCount[arr[i].stars-1]++;
	}
	console.log(sCardCount);
	return arr;
}

/*副本怪物数据初始化*/
function instanceDataInit(){
	var arr = [];
	var strData = [
	'./resources/images/boss/1/boss.png|1|双翅蜥蜴|40000|600|0.1||5|3|40',
	'./resources/images/boss/2/boss.png|2|哈尔希|63000|800|0.1||5|4|50',
	'./resources/images/boss/3/boss.png|3|异形食人蛛|95000|1600|0.2||10|5|70',
	'./resources/images/boss/4/boss.png|4|熔岩巨兽|190000|2900|0.3||15|6|90'];
	for(var i = 0; i < strData.length; i++){
		var args = strData[i].split('|');
		var obj = new InstanceData(args[0],0,
			new Monster(parseInt(args[1]),args[2],parseInt(args[3]),
				parseInt(args[4]),parseFloat(args[5]),{},parseInt(args[7]),
				parseInt(args[8]),parseInt(args[9])));
		arr.push(obj);
	}
	return arr;
}