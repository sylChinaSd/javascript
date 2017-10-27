/*静态图片资源*/
var staticAnimPath = [
	{"name":"leftBgAnim","path":"./resources/images/leftPBg.jpg"},
	{"name":"rightBgAnim","path":"./resources/images/rightPBg.jpg"},
	{"name":"rightBottomBg","path":"./resources/images/rightBottom-2.png"},
	{"name":"lvUpBtn","path":"./resources/images/lvUpBtn.png"},

	
	{"name":"missileAnim","path":"./resources/images/missile.png"},
	{"name":"lptBg","path":"./resources/images/leftPanelTop.png"}

];
/*动画图片资源*/
var animPath = [
	{"name":"leftWeaponAnim","path":"./resources/images/leftWeaponAnim.png","numberOfFrame":2,"delta":100,"rate":150,"type":$.gQ.ANIMATION_HORIZONTAL},
	{"name":"rightWeaponAnim","path":"./resources/images/rightWeaponAnim.png","numberOfFrame":2,"delta":250,"rate":1000,"type":$.gQ.ANIMATION_HORIZONTAL},

];
//卡牌数据
var cardsData = [
	{"id":0,"atk":10,"hit":0,"skill":0,"stars":1,"img":"","active":false,"count":0}
];
/*初始化资源*/
function initResources(){
	for(var i = 0; i < staticAnimPath.length; i++){
		var tmp = staticAnimPath[i];
		if(tmp && tmp.name && tmp.path && tmp.name.length > 0 && tmp.path.length > 0){
			animMap[tmp.name] = new $.gQ.Animation({ imageURL: tmp.path});
		}
	}

	for(var i = 0; i < animPath.length; i++){
		var tmp = animPath[i];
		if(tmp && tmp.name && tmp.path && tmp.name.length > 0 && tmp.path.length > 0){
			animMap[tmp.name] = new $.gQ.Animation({ 
				imageURL: tmp.path,
				numberOfFrame: tmp.numberOfFrame,
				delta: tmp.delta,
				rate: tmp.rate,
				type:tmp.type
			});
		}
	}

	if(gameState){
		gameState.change();
	}

	/*初始卡牌资源*/
	var c = sysInfo.items.cards;
	if(c.length == 0){
		for(var i = 0; i < cardsData.length;i++){
			var tmp = cardsData[i];
			c.push(new card(tmp.id,tmp.atk,tmp.hit,tmp.skill,tmp.stars,tmp.img,tmp.active,tmp.count));
		}
	}	
}