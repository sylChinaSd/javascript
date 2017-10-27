var missile = function(x,y,createTime,speed,type){
	this.createTime = createTime;
	this.y = y;
	this.x = x;
	this.speed = speed;
	this.type = type;

	this.move = function(){
		var x = 0;
		var y = parseInt(this.y + (Date.now() - this.createTime)*this.speed);

		/*根据类型type进行移动*/
		//var r = 160000 - 400*y;
		var r = 90000 - 225*y;
		switch (type){
			case 0://直线
				x = this.x;
				break;
			case 1://左1				
				if(r >= 0){
					x = parseInt((400 - Math.sqrt(r))/2);
				}
				break;
			case 2://左2
				if(r >= 0){
					x = parseInt((400 + Math.sqrt(r))/2);
				}
				break;
			case 3://右1
				break;
			case 4://右2
				break;
		}

		//移动对应的页面元素
		var m = $('#'+this.getId());
		m.xy(x,y,false);
		return {"x":x,"y":y};
	}

	this.getId = function(){
		return "missile_" + this.createTime;
	}

	this.getBoomId = function(){
		return "boom_" + this.createTime;	
	}

}

/*卡牌类*/
var card = function(id,atk,hit,skill,stars,img,active,count){
	this.id = id;
	this.atk = atk;//攻击力
	this.hit = hit;//暴击率
	this.skill = skill;//技能
	this.stars = stars;//星级
	this.img = img;//图片
	this.active = active;//激活状态
	this.count = count;//现有数量


	this.isActive = function(){
		return this.active;
	}

	this.canStarUp = function(){
		return this.count >= this.stars*10;
	}

	this.starUp = function(){
		if(this.canStarUp()){
			this.count = this.count - this.stars*10;
			this.stars = this.stars + 1;
			this.atk = this.atk + this.stars*10;
		}
	}

	this.setActive = function(){
		this.active = true;
	}

	this.add = function(val){
		this.count = this.count + val;
	}

}