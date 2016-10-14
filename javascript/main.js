var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update,render: render });

var penzzle;

var sprite1;
var sprite2;
var sprite3;
var sprite4;
var sprite5;

var fakesprite1;
var fakesprite2;
var fakesprite3;
var fakesprite4;
var fakesprite5;

var puzzleSprites= [];
var puzzleGroup;

var fakeHitZone;

var dropZone;

var flipFlag = true;


function preload() {
    //background
    game.load.image('stars', 'assets/starfield.jpg');

    //buttons
    game.load.image('flip','assets/flipping.png');
    game.load.image('rotateRight','assets/rotateright.png');

    //lego sprites
    game.load.image('yellowPiece','assets/legoYellowSprite30x30.png');
    game.load.image('bluePiece','assets/legoBlueSprite30x30.png');

    //invisible sprite for dragging
    game.load.image('invisible-box','assets/invisible.png');
}

function create() {
    //background
    var starfield = game.add.tileSprite(0, 0, 800, 600, 'stars');
    starfield.fixedToCamera = true;

    var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

    //  The Text is positioned at 0, 100
    text = game.add.text(350, 0, "Penzzle", style);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //penzzle zone
    var penzzleZone = game.add.graphics(50, 50);
    penzzleZone.lineStyle(4, 0xffd900, 1);
    penzzleZone.drawRect(0, 0, 150, 150);

    //puzzle zone
    var puzzleZone = game.add.graphics(250, 50);
    puzzleZone.lineStyle(4, 0x0000ff, 1);
    puzzleZone.drawRect(0, 0, 500, 500);

    dropZone = new Phaser.Rectangle(250,50,500,500);

    penzzle = game.add.group();
    penzzle.x = 125; penzzle.y = 125;

    puzzleGroup = game.add.group();


    //creating 30x30 sprites for penzzle and aligning them next to each other
    sprite1 = game.add.sprite(-30,-45,'yellowPiece');
    //sprite1.width= 30; sprite1.height = 30;

    sprite2 = game.add.sprite(0, 0, 'yellowPiece');
    //sprite2.width= 30; sprite2.height = 30;
    sprite2.alignTo(sprite1,Phaser.RIGHT_CENTER);

    sprite3 = game.add.sprite(0, 0, 'yellowPiece');
    //sprite3.width= 30; sprite3.height = 30;
    sprite3.alignTo(sprite1,Phaser.BOTTOM_CENTER);

    sprite4 = game.add.sprite(0, 0, 'yellowPiece');
    //sprite4.width= 30; sprite4.height = 30;
    sprite4.alignTo(sprite3,Phaser.RIGHT_CENTER);

    sprite5 = game.add.sprite(0, 0, 'yellowPiece');
    //sprite5.width= 30; sprite5.height = 30;
    sprite5.alignTo(sprite4,Phaser.BOTTOM_CENTER);

    //creating fake sprites in the middle of the real sprites used for detecting overlaps
    fakesprite1 = game.add.sprite(-15,-30,'invisible-box');
    fakesprite1.width =1; fakesprite1.height =1;

    fakesprite2 = game.add.sprite(15,-30,'invisible-box');
    fakesprite2.width =1; fakesprite2.height =1 ;

    fakesprite3 = game.add.sprite(-15,0,'invisible-box');
    fakesprite3.width =1; fakesprite3.height =1 ;

    fakesprite4 = game.add.sprite(15,0,'invisible-box');
    fakesprite4.width =1; fakesprite4.height =1 ;

    fakesprite5 = game.add.sprite(15,30,'invisible-box');
    fakesprite5.width =1; fakesprite5.height =1 ;


    //adding sprites to penzzle group
    penzzle.add(sprite1);
    penzzle.add(sprite2);
    penzzle.add(sprite3);
    penzzle.add(sprite4);
    penzzle.add(sprite5);
    penzzle.add(fakesprite1);
    penzzle.add(fakesprite2);
    penzzle.add(fakesprite3);
    penzzle.add(fakesprite4);
    penzzle.add(fakesprite5);


    // creating a fake sprite to drag all the sprites.
    fakeHitZone = game.add.sprite(0, 0,'invisible-box');

    //making the fake sprite at the same location as penzzle
    fakeHitZone.x = penzzle.x;
    fakeHitZone.y = penzzle.y;

    //adjusting the fake sprites width and height to that of the penzzle
    fakeHitZone.width = penzzle.width;
    fakeHitZone.height = penzzle.height;

    // setting the drag properties
    fakeHitZone.inputEnabled = true;
    fakeHitZone.input.enableDrag(true);

    //setting centroid and making fake one invisible
    fakeHitZone.anchor.setTo(0.5,0.5);
    fakeHitZone.alpha = 0;

    //created a new button to rotate the penzzle
    rotateButton = game.add.button(50, 225, 'rotateRight', rotateRight, this);

    //created a new button to flip the penzzle
    flipButton = game.add.button(125,225,'flip',flipPenzzle,this);

    fakeHitZone.enableBody = true;
    game.physics.arcade.enable(fakeHitZone);
    fakeHitZone.body.collideWorldBounds = true;

    //dragging penzzle
    fakeHitZone.events.onDragStart.add(startDrag,this);
    fakeHitZone.events.onDragUpdate.add(dragUpdate,this);
    fakeHitZone.events.onDragStop.add(stopDrag,this);

    //We create and load the puzzle here
    loadPuzzle();
}
//==========================================================================================
// creates a row of blue sprites
function blueStick(x,y,n){
    for(i=0;i<n;i++){
        puzzleSprites.push(game.add.sprite(x,y,'bluePiece'));
        x+=30;
    }
}
//==========================================================================================
//function for creating and loading the puzzle
function loadPuzzle() {
    // We create and load the puzzle as the same way we do in the pizel art row by row

    // row 1
    puzzleSprites.push(game.add.sprite(90,150,'bluePiece'));
    puzzleSprites.push(game.add.sprite(180,150,'bluePiece'));

    //row 2
    blueStick(30,120,8);

    //row3
    blueStick(0,90,10);

    //row4
    blueStick(0,60,10);

    //row5
    blueStick(30,30,8);

    //row6
    blueStick(120,0,2);

    //We make all the puzzle sprites as a group
    for(i=0;i<puzzleSprites.length;i++){
        puzzleGroup.add(puzzleSprites[i]);
    }

    //we make our puzzle center of our puzzle drop zone
    puzzleGroup.alignIn(dropZone, Phaser.CENTER);

}
//==========================================================================================
function dragUpdate(sprite, pointer, dragX, dragY, snapPoint){
    var flag = [],a,b,c,d,e;
    penzzle.x = fakeHitZone.worldPosition.x ;
    penzzle.y = fakeHitZone.worldPosition.y ;

    //change the alphas of the puzzle group if penzzle is over it

    a=isSpriteOccupied(fakesprite1);
    b=isSpriteOccupied(fakesprite2,a);
    c=isSpriteOccupied(fakesprite3,a,b);
    d=isSpriteOccupied(fakesprite4,a,b,c);
    e=isSpriteOccupied(fakesprite5,a,b,c,d);

    if((a!=1000)&&(b!=1000)&&(c!=1000)&&(d!=1000)&&(e!=1000)){
        puzzleSprites[a].alpha =0.3;
        puzzleSprites[b].alpha =0.3;
        puzzleSprites[c].alpha =0.3;
        puzzleSprites[d].alpha =0.3;
        puzzleSprites[e].alpha =0.3;

        for(k=0;k<puzzleSprites.length;k++){
            if(k!=a&&k!=b&&k!=c&&k!=d&&k!=e){
                puzzleSprites[k].alpha =1;
            }
        }
    }else if(a==1000||c==1000||b==1000||d==1000||e==1000){
        for(k=0;k<puzzleSprites.length;k++){
                puzzleSprites[k].alpha =1;
        }
    }
}
//==========================================================================================
function isSpriteOccupied(sp,p,q,r,s){
    /*for(j=0;j<puzzleSprites.length;j++) {
        if (puzzleSprites[j].getBounds().contains(sp.worldPosition.x, sp.worldPosition.y)) {
            return j;
        }
    }*/
    p = p || 1001;
    q = q || 1001;
    r = r || 1001;
    s = s || 1001;
    for(j=0;j<puzzleSprites.length;j++) {
        if(p!=j||q!=j||r!=j||s!=j)
        if (puzzleSprites[j].overlap(sp)) {
            return j;
        }
    }
    return 1000;
}
//==========================================================================================
function startDrag(){
    penzzle.x = fakeHitZone.worldPosition.x ;
    penzzle.y = fakeHitZone.worldPosition.y ;
    penzzle.alpha = 0.3;
}
//==========================================================================================
function stopDrag() {
    var a,b,c,d,e;

    var p1,p2,p3,p4,p5;

    a=isSpriteOccupied(fakesprite1);
    b=isSpriteOccupied(fakesprite2);
    c=isSpriteOccupied(fakesprite3);
    d=isSpriteOccupied(fakesprite4);
    e=isSpriteOccupied(fakesprite5);

    if((a!=1000)&&(b!=1000)&&(c!=1000)&&(d!=1000)&&(e!=1000)){
        puzzleSprites[a].kill();
        puzzleSprites[b].kill();
        puzzleSprites[c].kill();
        puzzleSprites[d].kill();
        puzzleSprites[e].kill();

        p1 = puzzleSprites[a];
        p2 = puzzleSprites[b];
        p3 = puzzleSprites[c];
        p4 = puzzleSprites[d];
        p5 = puzzleSprites[e];

        puzzleSprites.splice(puzzleSprites.indexOf(p1),1);
        puzzleSprites.splice(puzzleSprites.indexOf(p2),1);
        puzzleSprites.splice(puzzleSprites.indexOf(p3),1);
        puzzleSprites.splice(puzzleSprites.indexOf(p4),1);
        puzzleSprites.splice(puzzleSprites.indexOf(p5),1);

    }
    if(puzzleSprites.length==0){
        var starfield2 = game.add.tileSprite(0, 0, 800, 600, 'stars');
        starfield2.fixedToCamera = true;
        var style2 = { font: "bold 40px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

        //  The Text is positioned at 0, 100
        text = game.add.text(350, 0, "Congratulations", style2);
    }
    penzzle.x = 125 ;
    penzzle.y = 125 ;
    fakeHitZone.x = penzzle.x;
    fakeHitZone.y = penzzle.y;
    penzzle.alpha = 1;
}
//==========================================================================================
//function to rotate the penzzle
function rotateRight(){
    penzzle.angle +=90;
    fakeHitZone.angle += 90;
}
//==========================================================================================
//function to flip the penzzle
function flipPenzzle() {
    if(flipFlag) {
        penzzle.scale.set(-1, 1);
        flipFlag = false;
    } else {
        penzzle.scale.set(1,1);
        flipFlag = true;
    }
}
//============================================================================================
function update() {
}
//============================================================================================
function render(){
 }