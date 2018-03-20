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
        direction : 1,//0->left ,1->right
        visibleSize :cc.size(0,0),
        dataCount : 100, //存储电线数据个数
        maxDis : 4, //最大电线间距
        btn_play:
        {
            default : null,
            type    : cc.Button
        },
        bg:{
            default : null,
            type    : cc.Node
        },
        player:{
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
    },

    initData:function()
    {
        for(var i = 0;i < this.dataCount;i++)
        {
            var dis = Math.ceil( Math.random() * 10000000) % this.maxDis
            var toward = Math.ceil( Math.random() * 10000000) % 2

            if (dis == 0)
            {
                dis = this.maxDis
            }
            if (i == 0 && dis == 1) //第一根电线距离不能太小
            {
                dis = 2
            }
            this.wireDistanceArray[i] = dis

            if (dis == 1 && i != 0) //当两者距离为1,如果方向相反的情况是不行的
            {
                this.wireTowardArray[i] = this.wireTowardArray[i-1]
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

    addWall :function()
    {
        // var wall = new cc.Sprite("Texture/Gaming/wall_1.png")
        // this.node.addChild(wall)
        var wall = new cc.Node('Wall')
        var sp = wall.addComponent(cc.Sprite)
        sp = new cc.SpriteFrame("resources/Gaming/wall_1.png")
        wall.setPosition(cc.p(100,100))
        this.node.addChild(wall,100)

        
        // var wall = this.node.addComponent(cc.Sprite)
        // wall.SpriteFrame = new cc.SpriteFrame("Texture/Gaming/wall_1.png")
        // wall.setPosition(cc.p(100,100))
        // wall.x = 150
    },

    setTouchControl: function()
    {
        var self = this
        this.node.on(cc.Node.EventType.TOUCH_START,function(event){
            // console.log("Node.EventType.TOUCH_START")
            // cc.log("Node.EventType.TOUCH_START")
            var touchPos = event.touch.getLocation()
            console.log("touchposx = ",touchPos.x)
            console.log("visibleSizeX = ",this.visibleSize.width)
            console.log("visibleSizeY = ",this.visibleSize.height)
            
            console.log("dir = ",this.player.getComponent('Player').direction)
            // console.log("dir = ",Player.direction)
            if (touchPos.x < this.visibleSize.width * 0.5 )
            {
                console.log("on touch left")
                // this.player.onPlayerChangeDir(0)
                // this.player.setRotationY(180)
                // this.player.getComponent('Player').onPlayerHitWall()
                // this.player.getComponent('Player').onPlayerChangeDir(0)
                this.onPlayerChangeDir(0)
                
            }
            else
            {
                console.log("on touch right")
                // this.player.getComponent(Player).onPlayerChangeDir(1)
                // this.player.onPlayerChangeDir(1)
                // this.player.setRotationY(0)
                this.onPlayerChangeDir(1)
            }
            
        }.bind(this),this)
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
        // var node = new cc.Node('left_tap')
        // var left_tap = node.addComponent(cc.Sprite)
        
        // left_tap.SpriteFrame = new cc.SpriteFrame("Texture/Gaming/button_lefttap.png")
        // node.setAnchorPoint(0.5,0.5)
        // node.setPosition(cc.p(-250,-580))
        // // this.node.addChild(node,100)
        // node.parent = this.node
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

    onPlayerChangeDir :function(dir) 
    {
        if (this.direction != dir)
        {
            this.direction = dir
            if (this.direction == 0 ) //right->left
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

        // this.onPlayerHitWall()
    },

    onPlayerHitWall:function()
    {
        var animation = this.player.getComponent(cc.Animation)
        animation.play('hitwall')
    },

    onPlayerDie :function()
    {
        var animation = this.player.getComponent(cc.Animation)
        animation.play('electric')
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad :function() 
    {
        this.visibleSize = cc.director.getVisibleSize()
        this.direction = 1
        this.left_tap.setVisible(false)
        this.right_tap.setVisible(false)

        this.initData()
        this.initHomeAction()
        this.setTouchControl()
        this.runCloudAction()
        this.addWall()
        // this.runTapAction()
        this.btn_play.node.on(cc.Node.EventType.TOUCH_START, function(event){
            console.log("按钮按下")
        })

        this.btn_play.node.on(cc.Node.EventType.TOUCH_MOVE, function(event){
            console.log("在按钮上滑动")
        })

        this.btn_play.node.on(cc.Node.EventType.TOUCH_END, function(event){
            console.log("在按钮结束")
        })

        
        
    },
    callback: function (event) {
        //这里的 event 是一个 EventCustom 对象，你可以通过 event.detail 获取 Button 组件
        var button = event.detail;
        //do whatever you want with button
        //另外，注意这种方式注册的事件，也无法传递 customEventData
     },

    start () {

    },

    // update (dt) {},
})
