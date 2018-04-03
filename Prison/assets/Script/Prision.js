// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

// var Player = require("Player")

var GameState = {
    Free    : 0,
    Gaming  : 1
}

var WallType = {
    Normal : 0,
    Left : 1,
    Right : 2
}

var PlaySide ={
    Left : 1,
    Right: 2
}

var INIT_HP = 50;//游戏初始

//速度分x、y速度
var defauleSpeed = [cc.p(-800,450),
                    cc.p(800,550),
                    cc.p(900,0),
                    cc.p(-900,0),
                    cc.p(-760,-400),
                    cc.p(760,-380),
                    cc.p(0,-800)
                ];

var realSpeedArray = new Array()
// [
//     cc.p(-800,450),
//     cc.p(800,550),
//     cc.p(900,0),
//     cc.p(-900,0),
//     cc.p(-760,-400),
//     cc.p(760,-380),
//     cc.p(0,-800)
// ];
var Gravity = 100

var wallChipsArray = new Array()

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar
        //     },
        //     set (value) {
        //         this._bar = value
        //     }
        // },

        playSide : PlaySide.Right,//0->left ,1->right
        visibleSize :cc.size(0,0),
        dataCount : 100, //存储电线数据个数
        maxDis : 3, //最大电线间距
        wallCount : 6,//最大墙体数目
        wallArrayCount:0,//存储墙体数组数目
        wireIndex : 0,//电线数组index
        curWireIndex : 0,//当前电线所在
        wallIndex : -1,
        currentPosY : -320,
        wallHeight : 0,//墙体高度
        realHp :    INIT_HP,//初始血量
        totalHp :   100,//总血量
        hpReduceSpeed : 6,//血量衰减速度
        hpAddSpeed  :   5,//血量增加速度
        dieHpLimit  :   0,//死亡血量限制
        scoreNumber :   0,//玩家得分
        gameLevel   :   1,
        gameState : GameState.Gaming, // 游戏状态

        btn_play:
        {
            default : null,
            type    : cc.Button
        },
        btn_restart:
        {
            default : null,
            type    : cc.Button
        },
        bg:
        {
            default : null,
            type    : cc.Sprite
        },
        wall_node :
        {
            default : null,
            type    : cc.Node
        },
        player:
        {
            default : null,
            type    : cc.Node
        },
        left_tap:
        {
            default : null,
            type    : cc.Sprite
        },
        right_tap:
        {
            default : null,
            type    : cc.Sprite
        },
        Handcuffs:
        {
            default : null,
            type    : cc.Sprite
        },
        cloud1:
        {
            default : null,
            type    : cc.Sprite
        },
        cloud2:
        {
            default : null,
            type    : cc.Sprite
        },
        cloud3:
        {
            default : null,
            type    : cc.Sprite
        },
        Logo:
        {
            default : null,
            type    : cc.Sprite
        },
        hpBarShow:
        {
            default : null,
            type    : cc.Node
        },
        hpBar:
        {
            default :   null,
            type    : cc.Node
        },
        sprScore:
        {
            default :   null,
            type    : cc.Sprite
        },
        lblScore:
        {
            default :   null,
            type    : cc.Label
        },
        playerFrame:
        {
            default : null,
            type    : cc.SpriteFrame
        },
        wireSprite:
        {
            default : null,
            type    : cc.SpriteFrame
        },
        // wallChipsArray:
        // {
        //     default : [],
        //     type    : [cc.Node]
        // },
        bgAudio:
        {
            default : null,
            url     : cc.AudioClip
        },
        prisonDieAudio:
        {
            default : null,
            url     : cc.AudioClip
        },
        prisonHitAudio:
        {
            default : null,
            url     : cc.AudioClip
        },
        btnClickAudio:
        {
            default : null,
            url     : cc.AudioClip
        },
        wallArray :
        {
            default : [],
            type    : cc.Node
        },
        wallSpriteArray: {
            default: [],
            type: [cc.SpriteFrame],
        },
        wallChipsSpriteArray: {
            default: [],
            type: [cc.SpriteFrame],
        },
        wireDistanceArray: //电线间隔数组
        {
            default:[],
            type : [cc.Integer]
        },

        wireTowardArray://电线朝向数组
        {
            default:[],
            type:[cc.Boolean]
        },
        // sprite: {
        //     default: null,
        //     type: cc.SpriteFrame,
        //   },
    },

    initData:function()
    {
        this.wallArrayCount = 0;
        this.wallIndex = -1;
        this.wireIndex = 0;
        this.curWireIndex = 0;
        this.currentPosY = -320;
        this.scoreNumber = 0;
        this.gameLevel = 1;
        for(var i = 0;i < this.dataCount;i++)
        {
            var dis = Math.floor( Math.random() * 10000000) % this.maxDis
            var toward = Math.floor( Math.random() * 10000000) % 2

            if (dis == 0)
            {
                dis = this.maxDis
            }
            if (i == 0 && dis == 1) //第一根电线距离不能太小
            {
                dis = 2
            }
            this.wireDistanceArray[i] = dis

            if (dis == 1 && i != 0 && i > 1) //当两者距离为1,如果方向相反的情况是不行的
            {
                //处理连续的情况
                if (this.wireDistanceArray[i-1] == 1 && this.wireDistanceArray[i-2] == 1)
                {
                    this.wireDistanceArray[i] = 2;
                }
                else
                {
                    this.wireTowardArray[i] = this.wireTowardArray[i-1];
                }
            }
            else
            {
                if (toward == 0)
                {
                    this.wireTowardArray[i] = false
                }
                else
                {
                    this.wireTowardArray[i] = true
                }
            }
            
        }
        // console.log("i = ",i)
        // console.log("this.wireDistanceArray[i] = ",this.wireDistanceArray[i])
        // console.log("this.wireTowardArray[i] = ",this.wireTowardArray[i])
    },


    setTouchControl: function()
    {
        var self = this
        this.node.on(cc.Node.EventType.TOUCH_START,function(event){
            if (this.gameState != GameState.Gaming)
            {
                return;
            }
            this.left_tap.setVisible(false);
            this.right_tap.setVisible(false);
            this.left_tap.node.stopAllActions();
            this.right_tap.node.stopAllActions();
            var touchPos = event.touch.getLocation()
            // console.log("touchposx = ",touchPos.x)
            // console.log("visibleSizeX = ",this.visibleSize.width)
            // console.log("visibleSizeY = ",this.visibleSize.height)
            
            // console.log("dir = ",this.player.getComponent('Player').playSide)
            if (touchPos.x < this.visibleSize.width * 0.5 )
            {
                // console.log("on touch left")
                this.onPlayerClickDir(PlaySide.Left)
                
            }
            else
            {
                // console.log("on touch right")
                this.onPlayerClickDir(PlaySide.Right)
            }
            
        }.bind(this),this)
    },

    initWallUI :function()
    {
        console.log("initWallUI")
        for (var i = 0;i < this.wallCount;i++)
        {
            this.addWall();
        }
        // this.wallCount = 6;
    },


    initHomeAction:function()
    {
        this.Handcuffs.node.runAction(cc.repeatForever(cc.sequence(
            cc.rotateTo(1.2,-20),
            cc.rotateTo(1.2,30)
        )))
    },

    runTapAction :function()
    {
        this.left_tap.setVisible(true);
        this.right_tap.setVisible(true);
        this.left_tap.node.setPosition(-250,-580)
        this.right_tap.node.setPosition(250,-580)
        this.left_tap.node.runAction(cc.repeatForever(cc.sequence(
            cc.moveBy(0.8,cc.p(50,0)),
            cc.moveBy(1.0,cc.p(-50,0))
        )))

        this.right_tap.node.runAction(cc.repeatForever(cc.sequence(
            cc.moveBy(0.8,cc.p(-50,0)),
            cc.moveBy(1.0,cc.p(50,0))
        )))
    },



    runCloudAction :function()
    {
        this.cloud1.node.runAction(cc.repeatForever(cc.sequence(
            cc.moveTo(15.0,cc.p(this.visibleSize.width * 0.5 + 100,480)),
            cc.place(cc.p(-584,480))
            // cc.moveTo(0.1,cc.p(-584,480))
        )))

        this.cloud2.node.runAction(cc.repeatForever(cc.sequence(
            cc.moveTo(14.0,cc.p(this.visibleSize.width * 0.5 + 100,330)),
            cc.place(cc.p(-534,330))
            // cc.moveTo(0.1,cc.p(-584,480))
        )))

        this.cloud3.node.runAction(cc.repeatForever(cc.sequence(
            cc.moveTo(16.0,cc.p(this.visibleSize.width * 0.5 + 100,340)),
            cc.place(cc.p(-784,340))
            // cc.moveTo(0.1,cc.p(-584,480))
        )))
    },

    onPlayerClickDir :function(dir) 
    {
        // console.log("onPlayerClickDir dir = ",dir)
        var changeSide = cc.callFunc(function () {
            this.onPlayerChangeSide(dir);
        },this);
        var boomAni = cc.callFunc(this.onBoomAni,this)
        var downAni = cc.callFunc(this.onWallDown,this);
        var hitAni = cc.callFunc(this.onPlayerHitWall,this);
        var addWallAni = cc.callFunc(this.addWall,this);
        var deleteWallAni = cc.callFunc(this.deleteWall,this);
        var chenckAlive = cc.callFunc(this.onCheckAlive,this);
        if (this.playSide != dir)//换边
        {
            this.node.runAction(cc.sequence(
                changeSide,
                chenckAlive,
                hitAni,
                boomAni,
                downAni,
                addWallAni,
                deleteWallAni,
                chenckAlive
            ))
        }
        else//不换边
        {
            this.node.runAction(cc.sequence(
                hitAni,
                boomAni,
                downAni,
                addWallAni,
                deleteWallAni,
                chenckAlive
            ))
        }

        // this.onPlayerHitWall()
    },

    addWall :function()
    {
        var wall = new cc.Node("Wall");
        var sp = wall.addComponent(cc.Sprite);
        //随机墙体精灵
        var wallSpriteIndex = Math.floor((Math.random() * 10000)) % 5
       
        sp.spriteFrame = this.wallSpriteArray[wallSpriteIndex];//this.wallSpriteArray[wallSpriteIndex];
        this.wall_node.addChild(wall);
        wall.setTag(WallType.Normal)
        this.wallHeight = wall.getContentSize().height;
        wall.setPosition(0,this.currentPosY);
        this.currentPosY += wall.getContentSize().height;
        
        this.wallIndex ++;
        var nextWireIndex = this.curWireIndex + this.wireDistanceArray[this.wireIndex % this.dataCount];
        if (nextWireIndex == this.wallIndex)
        {
            var toward = this.wireTowardArray[this.wireIndex % this.dataCount];
            var wire = new cc.Node("Wire");
            var sp = wire.addComponent(cc.Sprite);
            sp.spriteFrame = this.wireSprite;
            wall.addChild(wire);
            if (toward == true) //右边
            {
                wire.setAnchorPoint(0,0.5);
                wire.setPosition(90,0);
                wall.setTag(WallType.Right)
            }
            else
            {
                wire.setAnchorPoint(0.5,0.5);
                wire.setPosition(-250,0);
                wire.setRotationY(180);
                wall.setTag(WallType.Left)
            }

            this.curWireIndex = this.wallIndex;
            this.wireIndex ++;
        }
        
        this.wallArray[this.wallArrayCount] = wall;
        this.wallArrayCount ++;
 
        
    },

    deleteWall:function()
    {
        if (this.gameState != GameState.Gaming)
        {
            return;
        }
           //     //模仿实现c++ vector 功能实现
      
        this.wallArray[0].destroy();
        for(var i = 0;i < this.wallCount;i++)
        {
            this.wallArray[i] = this.wallArray[i + 1];
        }
        this.wallArrayCount --;
    },

    onPlayerChangeSide : function(dir)
    {
        // console.log("onPlayerChangeSide dir = ",dir)
        if (this.playSide != dir)//换边
        {
            this.playSide = dir
            if (this.playSide == PlaySide.Left ) //right->left
            {
                this.player.setRotationY(180)
                this.player.runAction(cc.moveTo(0.01,cc.p(-260,-330)))
            }
            else
            {
                this.player.setRotationY(0)
                this.player.runAction(cc.moveTo(0.01,cc.p(260,-330)))
            }
        }
    },

    onPlayerHitWall:function()
    {
        if (this.gameState != GameState.Gaming)
        {
            return;
        }
        var animation = this.player.getComponent(cc.Animation)
        animation.play('hitwall')
    },

    onPlayerDie :function()
    {
        this.playPlayerDieEffect();
        var animation = this.player.getComponent(cc.Animation)
        animation.play('electric')
    },

    onWallDown:function()
    {
        if (this.gameState != GameState.Gaming)
        {
            return;
        }
        this.wall_node.runAction(cc.moveBy(0.1,cc.p(0,-this.wallHeight)))
        this.onAddScore();
        this.onAddHp();
        this.onCheckLevel();
    },

    onBoomAni:function()
    {
        if (this.gameState != GameState.Gaming)
        {
            return;
        }
        this.playPlayerHitEccect();
        for(var i = 0;i < 7;i++)
        {
            // console.log("onBoomAni i = ",i)
            var chipNode = new cc.Node("chipNode");
            var sp = chipNode.addComponent(cc.Sprite)
            sp.spriteFrame = this.wallChipsSpriteArray[i];
            
            this.node.addChild(chipNode);
            chipNode.setPosition(cc.p(0,-320));
            // this.wallChipsArray[i] = chipNode;
            wallChipsArray.push(chipNode);
            var n = Math.floor(Math.random() * 100) % 5;
            var m = Math.floor(Math.random()*100) % 2;
            if (m == 0)
            {
                n = n * -1
            }
            var scale = 30;
            realSpeedArray.push( cc.p(defauleSpeed[i].x + scale * n,defauleSpeed[i].y +  scale * n)); 
        }
    },

    onWallAway : function(dt)
    {
        var length = wallChipsArray.length
        if (length != 0 )
        {
            for(var i = 0;i < length;i++)
            {
                var pos = wallChipsArray[i].getPosition();
                var speed = realSpeedArray[i];
                speed.y -= dt * Gravity;

                pos.x += speed.x * dt;
                pos.y += speed.y * dt;
                realSpeedArray[i] = speed;

                wallChipsArray[i].setPosition(pos);
                wallChipsArray[i].setRotation(wallChipsArray[i].getRotation() + 400 * dt );
                if (pos.x <= -this.visibleSize.width * 0.5 - 300 || pos.y <= -this.visibleSize.height * 0.5 - 300 || pos.x >= this.visibleSize.width * 0.5 + 300)
                {
                    wallChipsArray.splice(i,1);
                    realSpeedArray.splice(i,1);
                    if (i)
                    {
                        i --;
                    }
                    length--;
                    if (length == 0)
                    {
                        break;
                    }
                }

            }
        }
    },

    onAddScore:function()
    {
        this.scoreNumber ++;
        this.lblScore.string = this.scoreNumber.toString();
    },

    onAddHp : function()
    {
        // this.realHp
        if(this.gameLevel < 10)
        {
            this.realHp += 1.8 - this.gameLevel / 15.0;
        }
        else
        {
            this.realHp += 0.8;
        }
    },

    onCheckLevel:function()
    {
        if (this.gameLevel * 20 == this.scoreNumber)
        {
            this.gameLevel ++;
            console.log("level = ",this.gameLevel);

        }
    },

    changeHp:function(dt)
    {
        if (this.gameState != GameState.Gaming)
            return;
        if (this.gameLevel > 1)
        {
            this.realHp -= this.hpReduceSpeed * dt * (1 + this.gameLevel/5);
        }
        else
        {
            this.realHp -= this.hpReduceSpeed * dt;
        }
        
        if (this.realHp > this.totalHp)
            this.realHp = this.totalHp;
        if(this.realHp <= this.dieHpLimit)
        {
            // this.node.runAction(cc.sequence(
            //     cc.delayTime(2.0),
            //     cc.callFunc(this.onGameOver,this)
            // ))
            this.onPlayerDie();
            this.onGameOver();
            // this.gameState = GameState.Free
            this.playPlayerDieEffect();
        }
        
        this.setHpBarProgress(this.realHp / this.totalHp);
        // console.log("this.realHp = ",this.realHp);
    },

    onCheckAlive :function()
    {
        if (this.gameState != GameState.Gaming)
        {
            return;
        }
        var wireSide = this.wallArray[0].getTag();
        if (wireSide == this.playSide)
        {
            this.onPlayerDie();
            this.onGameOver();
            // this.node.runAction(cc.sequence(
            //     cc.delayTime(2.0),
            //     cc.callFunc(this.onGameOver,this)
            // ))
        }
    },

    onBtnPlayCallBack : function(target,tType)
    {
        if (tType == cc.Node.EventType.TOUCH_END)
        {
            console.log("在按钮结束");
        }
    },

    onGameOver : function()
    {
        console.log("onGameOver!");
        this.gameState = GameState.Free;
        var self = this;
        // this.btn_restart.node.scheduleOnce(function(){
        //     self.btn_restart.node.active = true;
        //     console.log("btn_restart setvisible true");
        // },2)
        self.btn_restart.node.active = true;
        // this.btn_restart.node.runAction(cc.sequence(
        //     cc.delayTime(2),
        //     cc.callFunc(function(){
        //         self.btn_restart.node.active = true;
        //         console.log("btn_restart setvisible true");
        //     },this),
        // ))
        
        // this.wall_node.stopAllActions();

       
    },

    onGameRestart :function()
    {
        this.btn_restart.node.active = false;
        this.btn_play.node.active = true;
        this.Handcuffs.setVisible(true);
        this.Logo.setVisible(true);
        this.setHpBarVisible(false);
        this.setScoreVisible(false);
        // this.onGameRestart();

        this.left_tap.setVisible(false);
        this.right_tap.setVisible(false);
        this.left_tap.node.stopAllActions();
        this.right_tap.node.stopAllActions();

        this.initData();
        for(var i = 0;i < this.wallCount;i++)
        {
            this.wallArray[i].destroy()
        }
        
        this.wall_node.setPosition(0,0);
        this.initWallUI();
        this.onPlayerChangeSide(PlaySide.Right);
        this.player.getComponent(cc.Sprite).spriteFrame = this.playerFrame;
        //以下做法会导致猪脚播放动画出问题，百撕不得骑姐呀
        // var realUrl = cc.url.raw('Texture/Gaming/part_1.png');
        // console.log("realUrl = ",realUrl)  
        // var texture = cc.textureCache.addImage(realUrl);  
        // this.player.getComponent(cc.Sprite).spriteFrame.setTexture(texture);
    },
    onGameStart : function()
    {
        this.realHp = INIT_HP;
        this.gameState = GameState.Gaming;
        // this.btn_play.setTouchEnable
        this.btn_play.node.active = false;
        this.runTapAction();
        this.Handcuffs.setVisible(false);
        this.Logo.setVisible(false);
        this.setHpBarVisible(true);
        this.setHpBarProgress(this.realHp / this.totalHp);
        this.setScoreVisible(true);
    },

    playBackGroundMusic: function()
    {
        cc.audioEngine.playMusic(this.bgAudio,true);
    },

    playButtonClickEffect :function()
    {
        cc.audioEngine.playEffect(this.btnClickAudio,false);
    },
    playPlayerHitEccect:function()
    {
        cc.audioEngine.playEffect(this.prisonHitAudio,false);
    },
    playPlayerDieEffect:function()
    {
        cc.audioEngine.playEffect(this.prisonDieAudio,false);
    },
    // LIFE-CYCLE CALLBACKS:

    setHpBarVisible:function(visible)
    {
        this.hpBar.active = visible;
        this.hpBarShow.active =visible;// .setVisible(visible);
    },

    setHpBarProgress:function(percent)//0-1
    {
        // this.hpBar.setProgress(percent)
        // this.hpBar.progress = 0.5;
        var progressBar = this.hpBar.getComponent(cc.ProgressBar);
        progressBar.progress = percent;
    },

    setScoreVisible:function(visible)
    {
        this.sprScore.setVisible(visible);
        this.lblScore.enabled  = visible;
    },

    onLoad :function() 
    {
        this.visibleSize = cc.director.getVisibleSize();
        this.playSide = PlaySide.Right;
        this.gameState = GameState.Free;
        this.btn_restart.node.active = false;
        this.left_tap.setVisible(false);
        this.right_tap.setVisible(false);
        
        this.setHpBarVisible(false);
        this.setScoreVisible(false);
        // this.setHpBarProgress(0.5);

        this.initData();
        this.initHomeAction();
        this.initWallUI();
        this.setTouchControl();
        this.runCloudAction();

        this.playBackGroundMusic();
        // this.addWall()
        // this.runTapAction()
        var self = this;
        this.btn_play.node.on(cc.Node.EventType.TOUCH_START, function(event){
            // console.log("按钮按下");
            self.playButtonClickEffect();
        })

        // this.btn_play.node.on(cc.Node.EventType.TOUCH_MOVE, function(event){
        //     console.log("在按钮上滑动")
        // })
        
        this.btn_play.node.on(cc.Node.EventType.TOUCH_END, function(event){
            // console.log("在按钮结束");
            self.onGameStart();
        })

        this.btn_restart.node.on(cc.Node.EventType.TOUCH_END,function(event){
            self.onGameRestart();
        })

        // var pngPath = "Texture/Plist/score.png"
        // // this.btn_play.addTouchEventListener(this.onBtnPlayCallBack,this)
        // var helloLabel = new cc.LabelAtlas("0",pngPath,46,56,'0');
        // this.node.addChild(helloLabel);
        
    },

    update: function (dt) 
    {
       this.onWallAway(dt);
       this.changeHp(dt);
    },

    start () {

    },

    // update (dt) {},
})
