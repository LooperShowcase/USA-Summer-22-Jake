kaboom({
  global: true,
  fullscreen: true,
  scale: 2,
  clearColor: [0, 0, 1, 0.75],
});

loadRoot("./sprites/");
loadSprite("mario", "mario.png");
loadSprite("block", "block.png");
loadSprite("coin", "coin.png");
loadSprite("goomba", "evil_mushroom.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("surprise", "surprise.png");
loadSprite("pipe", "pipe_up.png");
loadSprite("dino", "dino.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("star", "star.png");
loadSprite("princes", "princes.png");
loadSound("gameSound", "gameSound.mp3");
loadSound("jumpSound", "jumpSound.mp3");
loadSprite("castle", "castle.png");
//////////////////////////////////////////////
scene("lose", () => {
  add([
    text("YOU LOSE GET GUD PRESS L TO RESART", 32),
    pos(width() / 2, height() / 2),
    origin("center"),
  ]);

  keyPress("l", () => {
    go("game");
  });
});
scene("win", (score) => {
  add([
    text("YOU'RE NOT THAT BAD\nScore:" + score + " HIT W TO RESTART", 32),
    pos(width() / 2, height() / 2),
    origin("center"),
  ]);

  keyPress("w", () => {
    go("game");
  });
});

scene("start", () => {
  add([
    text("PRESS THE BUTTON OR R U SCARED", 42),
    pos(width() / 2, height() / 2 - 100),
    origin("center"),
  ]);
  const button = add([
    rect(150, 50),
    pos(width() / 2, height() / 2),
    origin("center"),
  ]);
  add([
    text("Start", 28),
    pos(width() / 2, height() / 2),
    origin("center"),
    color(0, 0, 0),
  ]);

  button.action(() => {
    if (button.isHovered()) {
      button.color = rgb(0.5, 0.5, 0.5);
      if (mouseIsClicked()){
        go('game')
      }
    } else {
      button.color = rgb(1, 1, 1);
    }
  });
});

//////////////////////////////////////////////
scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");
  const map = [
    "                                                             ",
    "                                                             ",
    "                       ? ? ?                                 ",
    "                                                       ",
    "                     ??                                     ",
    "                                                          ",
    "                     ^           $$$$$                   ",
    "                 =============                             ",
    "                =             =                              ",
    "       $    ==                ===      $$$$   =                    ",
    "           ==                    =              $$$           ",
    "         ==      $        $       =                ??     @      ",
    "       ==  $                     $  =                ??         ",
    "     ==     $$$$$$$$$  $$$$$$$$$$     =                        ",
    "    ==                                =        ^                ",
    "============== ^ ^     ^  ^              == =    =================",
    "========================================   ==================",
    "========================================   ==================",
    "========================================  =================",
  ];
  play("gameSound");

  const moveSpeed = 120;
  const jumpForce = 400;
  let isJumping = false;
  let isPlayerDestroyed = false;
  let isBig = false;

  const mapSymbols = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid()],
    $: [sprite("surprise"), solid(), "surprise-coin"],
    "?": [sprite("surprise"), solid(), "surprise-mushroom"],
    C: [sprite("coin"), "coin"],
    V: [sprite("unboxed"), solid(), "unboxed"],
    M: [sprite("mushroom"), "mushroom"],
    "^": [sprite("goomba"), "goomba", body(), solid()],
    "@": [sprite("castle"), "castle"],
  };

  const gameLevel = addLevel(map, mapSymbols);

  const player = add([
    sprite("mario"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    big(jumpForce),
  ]);

  let score = 0;
  const scoreLabel = add([
    text("Score:" + score),
    pos(player.pos.x, player.pos.y - 150),
    layer("ui"),
    {
      value: score,
    },
  ]);

  keyDown("right", () => {
    player.move(moveSpeed, 0);
  });
  keyDown("left", () => {
    player.move(-moveSpeed, 0);
  });
  keyDown("up", () => {
    if (player.grounded()) {
      player.jump(jumpForce);
      play("jumpSound");
      isJumping = true;
    }
  });
  player.on("headbump", (obj) => {
    if (obj.is("surprise-coin")) {
      gameLevel.spawn("C", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("V", obj.gridPos.sub(0, 0));
    }
    if (obj.is("surprise-mushroom")) {
      gameLevel.spawn("M", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("V", obj.gridPos.sub(0, 0));
    }
  });
  player.collides("coin", (obj) => {
    destroy(obj);
    scoreLabel.value += 100;
    scoreLabel.text = "score:" + scoreLabel.value;
  });

  player.collides("mushroom", (obj) => {
    destroy(obj);
    player.biggify(10);
    isBig = true;
  });
  player.action(() => {
    camPos(player.pos);
    if (player.grounded()) {
      isJumping = false;
    }
  });
  action("mushroom", (x) => {
    x.move(50, 0);
  });
  action("goomba", (x) => {
    x.move(20, 0);
  });
  player.collides("goomba", (obj) => {
    if (isJumping) {
      destroy(obj);
    } else {
      if (isBig) {
        destroy(obj);
        player.smallify();
      } else {
        destroy(player);
        go("lose");
        isPlayerDestroyed = true;
      }
    }
  });

  player.action(() => {
    camPos(player.pos);
    if (player.grounded()) {
      isJumping = false;
    } else {
      isJumping = true;
    }
    if (player.pos.x > 1241.9854000000016) {
      go("win", scoreLabel.value);
    }
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////
});
start("start");
