// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
      direction : 1,//0->left ,1->right
      visibleSize :cc.size(0,0),
    },

    onPlayerHitWall:function()
    {
        
    },

    onPlayerDie :function()
    {

    },

    onPlayerChangeDir :function(dir) 
    {
        if (this.direction != dir)
        {
            this.direction = dir;
            if (this.direction == 0 ) //right->left
            {
                this.setRotationY(180);
                this.node.runAction(cc.moveTo(0.05,cc.p(-260,331)));
            }
            else
            {
                this.setRotationY(0);
                this.node.runActin(cc.moveTo(0.05,cc.p(260,331)));
            }
        }

        
    },

    onLoad :function()
    {
        this.direction = 1;
    },
    

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
