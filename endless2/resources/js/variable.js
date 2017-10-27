/*常用尺寸数据*/
var LEFT_PANEL_SIZE = {width:400,height:600};
var RIGHT_PANEL_SIZE = {width:400,height:600};
var SCREEN_SIZE =  {width:800,height:600};
var TRANSITION_CLOR = "#e5eaff";
/*用于游戏加载顺序*/
var gameState = {
	"value":0,
	"changed":true,

	change:function(){
		this.value = this.value + 1;
		this.changed = true && this.value < 3;
	}
};

/*动态、静态图片资源*/
var animMap = [];
var carddsInfo = [];

/*系统信息 -- 需保存*/
var sysInfo = {
	boss:{
		level:1,
		hp:100,
		hp0:100
	},
	weapon:{
		level:1,
		atk:10,
		hit:0.01
	},
	items:{
		blood:0,
		stone:0,
		cards:[]
	}
};
/*暂存变量*/
var memoryInfo = {
	missiles:[],
	damages:[]
};

/*定时器线程*/
var threads = {
	missile : null,
	damage : null,
	collision : null
};