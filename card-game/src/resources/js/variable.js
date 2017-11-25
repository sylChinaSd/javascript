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
/*玩家信息,默认*/
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
var cardHPath = './resources/images/cards/h/';
var bossBasePath = './resources/images/boss/';
var cardIconPre = 'icon';
var cardPre = 'card';
/*星级对应的概率*/
/*目前最高五星*/
var starP = [
	/*金币召唤的概率*/
	[0.44,0.37,0.13,0.05,0.01,0,0],
	/*钻石召唤的概率*/
	[0.00,0.40,0.30,0.28,0.02,0,0]
];
/*星级对应的总卡牌数量*/
var sCardCount = [0,0,0,0,0,0,0];
/*经验卡牌的id,从一星到四星*/
var EXP_CARD_IDS = [29,31,38,47]
/*神秘卡牌id*/
var SECRET_CARD_IDS = [64];
/**/
var CARD_SIZE = 150;
var CARD_PIC_WIDTH = 300;
var CARD_PIC_HEIGHT = 460;
var CARD_INFO_BG_WIDTH = 460;
var CARD_INFO_BG_HEIGHT = CARD_PIC_HEIGHT;
var CARD_SALE_COUNT = 1000;
var CARD_BTN_SIZE = CARD_SIZE;
var CARD_MAX_COUNT = 100;