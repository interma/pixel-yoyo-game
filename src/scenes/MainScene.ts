import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private player2!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: any;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private coins!: Phaser.Physics.Arcade.Group;
  private enemies!: Phaser.Physics.Arcade.Group;
  private fireEnemies!: Phaser.Physics.Arcade.Group;
  private fireballs!: Phaser.Physics.Arcade.Group;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private lives: number = 3;
  private gameOver: boolean = false;

  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    // 由于我们没有外部图片资源，使用代码生成像素风格的图形
    this.createPixelAssets();
  }

  create() {
    // 设置背景颜色（经典FC蓝天色）
    this.cameras.main.setBackgroundColor('#5c94fc');

    // 扩大世界边界，允许更高的跳跃空间
    this.physics.world.setBounds(0, 0, 800, 1200);

    // 创建平台
    this.createPlatforms();

    // 创建玩家
    this.createPlayer();

    // 创建玩家2
    this.createPlayer2();

    // 创建金币
    this.createCoins();

    // 创建敌人
    this.createEnemies();

    // 创建喷火敌人
    this.createFireEnemies();

    // 设置碰撞
    this.setupCollisions();

    // 创建控制器
    this.cursors = this.input.keyboard!.createCursorKeys();
    
    // 创建WASD控制器
    this.wasdKeys = this.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    // 创建UI
    this.createUI();

    // 添加跳跃音效替代（视觉反馈）
    this.input.keyboard!.on('keydown-SPACE', () => {
      if (this.player.body.touching.down && !this.gameOver) {
        this.player.setVelocityY(-500);
      }
    });

    // 玩家2跳跃（Shift键）
    this.input.keyboard!.on('keydown-SHIFT', () => {
      if (this.player2.body.touching.down && !this.gameOver) {
        this.player2.setVelocityY(-500);
      }
    });
  }

  update() {
    if (this.gameOver) {
      return;
    }

    // 玩家1移动（方向键）
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
      this.player.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
      this.player.flipX = false;
    } else {
      this.player.setVelocityX(0);
    }

    // 玩家1跳跃
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-500);
    }

    // 玩家2移动（WASD）
    if (this.wasdKeys.left.isDown) {
      this.player2.setVelocityX(-200);
      this.player2.flipX = true;
    } else if (this.wasdKeys.right.isDown) {
      this.player2.setVelocityX(200);
      this.player2.flipX = false;
    } else {
      this.player2.setVelocityX(0);
    }

    // 玩家2跳跃
    if (this.wasdKeys.up.isDown && this.player2.body.touching.down) {
      this.player2.setVelocityY(-500);
    }

    // 敌人移动
    this.enemies.children.entries.forEach((enemy: any) => {
      if (enemy.body.velocity.x === 0) {
        enemy.body.velocity.x = enemy.direction * 50;
      }

      // 到达边界反向
      if (enemy.x <= enemy.minX || enemy.x >= enemy.maxX) {
        enemy.direction *= -1;
        enemy.body.velocity.x = enemy.direction * 50;
        enemy.flipX = !enemy.flipX;
      }
    });

    // 喷火敌人悬浮效果
    this.fireEnemies.children.entries.forEach((enemy: any) => {
      // 上下浮动
      if (!enemy.floatDirection) {
        enemy.floatDirection = 1;
        enemy.originalY = enemy.y;
      }
      
      if (enemy.y >= enemy.originalY + 20) {
        enemy.floatDirection = -1;
      } else if (enemy.y <= enemy.originalY - 20) {
        enemy.floatDirection = 1;
      }
      
      enemy.setVelocityY(enemy.floatDirection * 30);
    });

    // 清理屏幕外的火球
    this.fireballs.children.entries.forEach((fireball: any) => {
      if (fireball.x < 0 || fireball.x > 800 || fireball.y < -200 || fireball.y > 1200) {
        fireball.destroy();
      }
    });

    // 检查玩家是否掉出屏幕（扩大到世界底部）
    if (this.player.y > 1200 || this.player2.y > 1200) {
      this.loseLife();
    }

    // 相机跟随两个玩家的中心点
    const centerX = (this.player.x + this.player2.x) / 2;
    const centerY = (this.player.y + this.player2.y) / 2;
    this.cameras.main.scrollX = Phaser.Math.Linear(
      this.cameras.main.scrollX,
      centerX - 400,
      0.05
    );
    this.cameras.main.scrollY = Phaser.Math.Linear(
      this.cameras.main.scrollY,
      centerY - 300,
      0.05
    );
  }

  private createPixelAssets() {
    // 创建玩家纹理（索尼克风格 - 20x20像素）
    const playerGraphics = this.add.graphics();
    
    // 蓝色身体（圆形）
    playerGraphics.fillStyle(0x0080ff, 1);
    playerGraphics.fillCircle(10, 10, 7);
    
    // 刺猬的尖刺（背后的3个尖刺）
    playerGraphics.fillStyle(0x0060dd, 1);
    playerGraphics.fillTriangle(14, 8, 18, 6, 16, 10);
    playerGraphics.fillTriangle(14, 10, 18, 12, 16, 10);
    playerGraphics.fillTriangle(13, 12, 16, 15, 14, 12);
    
    // 肚子（浅色）
    playerGraphics.fillStyle(0xffe4b5, 1);
    playerGraphics.fillCircle(9, 11, 4);
    
    // 大眼睛（白色底）
    playerGraphics.fillStyle(0xffffff, 1);
    playerGraphics.fillEllipse(7, 8, 5, 4);
    playerGraphics.fillEllipse(11, 8, 5, 4);
    
    // 眼珠（黑色）
    playerGraphics.fillStyle(0x000000, 1);
    playerGraphics.fillCircle(7, 8, 2);
    playerGraphics.fillCircle(11, 8, 2);
    
    // 眼睛高光
    playerGraphics.fillStyle(0xffffff, 1);
    playerGraphics.fillCircle(7.5, 7.5, 1);
    playerGraphics.fillCircle(11.5, 7.5, 1);
    
    // 红色鞋子
    playerGraphics.fillStyle(0xff0000, 1);
    playerGraphics.fillEllipse(6, 16, 3, 2);
    playerGraphics.fillEllipse(12, 16, 3, 2);
    
    // 鞋子白色装饰
    playerGraphics.fillStyle(0xffffff, 1);
    playerGraphics.fillRect(5, 15, 3, 1);
    playerGraphics.fillRect(11, 15, 3, 1);
    
    playerGraphics.generateTexture('player', 20, 20);
    playerGraphics.destroy();

    // 创建玩家2纹理（Shadow风格 - 20x20像素）
    const player2Graphics = this.add.graphics();
    
    // 黑色身体（圆形）
    player2Graphics.fillStyle(0x1a1a1a, 1);
    player2Graphics.fillCircle(10, 10, 7);
    
    // 刺猬的尖刺（红色条纹）
    player2Graphics.fillStyle(0xff0000, 1);
    player2Graphics.fillTriangle(14, 8, 18, 6, 16, 10);
    player2Graphics.fillTriangle(14, 10, 18, 12, 16, 10);
    player2Graphics.fillTriangle(13, 12, 16, 15, 14, 12);
    
    // 胸部（白色/灰色）
    player2Graphics.fillStyle(0xd0d0d0, 1);
    player2Graphics.fillCircle(9, 11, 4);
    
    // 红色条纹（手臂）
    player2Graphics.fillStyle(0xff0000, 1);
    player2Graphics.fillRect(4, 10, 2, 4);
    player2Graphics.fillRect(14, 10, 2, 4);
    
    // 大眼睛（红色）
    player2Graphics.fillStyle(0xffffff, 1);
    player2Graphics.fillEllipse(7, 8, 5, 4);
    player2Graphics.fillEllipse(11, 8, 5, 4);
    
    // 眼珠（红色）
    player2Graphics.fillStyle(0xff0000, 1);
    player2Graphics.fillCircle(7, 8, 2);
    player2Graphics.fillCircle(11, 8, 2);
    
    // 眼睛高光
    player2Graphics.fillStyle(0xffffff, 1);
    player2Graphics.fillCircle(7.5, 7.5, 1);
    player2Graphics.fillCircle(11.5, 7.5, 1);
    
    // 黑红色鞋子
    player2Graphics.fillStyle(0x1a1a1a, 1);
    player2Graphics.fillEllipse(6, 16, 3, 2);
    player2Graphics.fillEllipse(12, 16, 3, 2);
    
    // 鞋子红色装饰
    player2Graphics.fillStyle(0xff0000, 1);
    player2Graphics.fillRect(5, 15, 3, 1);
    player2Graphics.fillRect(11, 15, 3, 1);
    
    player2Graphics.generateTexture('player2', 20, 20);
    player2Graphics.destroy();

    // 创建平台纹理
    const platformGraphics = this.add.graphics();
    platformGraphics.fillStyle(0x00ff00, 1);
    platformGraphics.fillRect(0, 0, 64, 16);
    platformGraphics.fillStyle(0x008000, 1);
    // 添加草地细节
    for (let i = 0; i < 64; i += 4) {
      platformGraphics.fillRect(i, 0, 2, 4);
    }
    platformGraphics.generateTexture('platform', 64, 16);
    platformGraphics.destroy();

    // 创建金币纹理
    const coinGraphics = this.add.graphics();
    coinGraphics.fillStyle(0xffff00, 1);
    coinGraphics.fillCircle(8, 8, 8);
    coinGraphics.fillStyle(0xffa500, 1);
    coinGraphics.fillCircle(8, 8, 4);
    coinGraphics.generateTexture('coin', 16, 16);
    coinGraphics.destroy();

    // 创建敌人纹理（蘑菇怪）
    const enemyGraphics = this.add.graphics();
    // 蘑菇帽
    enemyGraphics.fillStyle(0xff0000, 1);
    enemyGraphics.fillCircle(12, 8, 10);
    enemyGraphics.fillStyle(0xffffff, 1);
    enemyGraphics.fillCircle(8, 6, 3);
    enemyGraphics.fillCircle(16, 6, 3);
    // 蘑菇身体
    enemyGraphics.fillStyle(0xffe4b5, 1);
    enemyGraphics.fillRect(8, 12, 8, 8);
    // 眼睛
    enemyGraphics.fillStyle(0x000000, 1);
    enemyGraphics.fillRect(9, 14, 2, 2);
    enemyGraphics.fillRect(13, 14, 2, 2);
    enemyGraphics.generateTexture('enemy', 24, 24);
    enemyGraphics.destroy();

    // 创建喷火敌人纹理（火龙/飞龙）
    const fireEnemyGraphics = this.add.graphics();
    // 龙头（橙红色）
    fireEnemyGraphics.fillStyle(0xff4500, 1);
    fireEnemyGraphics.fillEllipse(12, 10, 14, 12);
    // 龙角
    fireEnemyGraphics.fillStyle(0x8b0000, 1);
    fireEnemyGraphics.fillTriangle(6, 8, 4, 4, 8, 6);
    fireEnemyGraphics.fillTriangle(18, 8, 20, 4, 16, 6);
    // 眼睛（黄色发光）
    fireEnemyGraphics.fillStyle(0xffff00, 1);
    fireEnemyGraphics.fillCircle(8, 9, 3);
    fireEnemyGraphics.fillCircle(16, 9, 3);
    fireEnemyGraphics.fillStyle(0xff0000, 1);
    fireEnemyGraphics.fillCircle(8, 9, 1);
    fireEnemyGraphics.fillCircle(16, 9, 1);
    // 鼻孔（喷火口）
    fireEnemyGraphics.fillStyle(0x000000, 1);
    fireEnemyGraphics.fillCircle(9, 13, 2);
    fireEnemyGraphics.fillCircle(15, 13, 2);
    // 翅膀
    fireEnemyGraphics.fillStyle(0xdc143c, 1);
    fireEnemyGraphics.fillTriangle(2, 10, 0, 6, 4, 12);
    fireEnemyGraphics.fillTriangle(22, 10, 24, 6, 20, 12);
    fireEnemyGraphics.generateTexture('fireEnemy', 24, 20);
    fireEnemyGraphics.destroy();

    // 创建火球纹理
    const fireballGraphics = this.add.graphics();
    // 火球核心
    fireballGraphics.fillStyle(0xffff00, 1);
    fireballGraphics.fillCircle(6, 6, 4);
    fireballGraphics.fillStyle(0xff4500, 1);
    fireballGraphics.fillCircle(6, 6, 5);
    fireballGraphics.fillStyle(0xff0000, 1);
    fireballGraphics.fillCircle(6, 6, 3);
    fireballGraphics.generateTexture('fireball', 12, 12);
    fireballGraphics.destroy();

    // 创建地面纹理
    const groundGraphics = this.add.graphics();
    groundGraphics.fillStyle(0x8b4513, 1);
    groundGraphics.fillRect(0, 0, 800, 32);
    // 添加砖块细节
    groundGraphics.lineStyle(2, 0x654321);
    for (let i = 0; i < 800; i += 50) {
      groundGraphics.lineBetween(i, 0, i, 32);
    }
    groundGraphics.generateTexture('ground', 800, 32);
    groundGraphics.destroy();
  }

  private createPlatforms() {
    this.platforms = this.physics.add.staticGroup();

    // 地面
    this.platforms.create(400, 584, 'ground').setScale(1).refreshBody();

    // 第一层平台（较低）
    this.platforms.create(600, 480, 'platform');
    this.platforms.create(200, 450, 'platform');
    this.platforms.create(500, 420, 'platform');

    // 第二层平台
    this.platforms.create(100, 360, 'platform');
    this.platforms.create(400, 340, 'platform');
    this.platforms.create(700, 320, 'platform');

    // 第三层平台
    this.platforms.create(250, 260, 'platform');
    this.platforms.create(550, 240, 'platform');
    this.platforms.create(150, 220, 'platform');

    // 第四层平台
    this.platforms.create(650, 160, 'platform');
    this.platforms.create(350, 140, 'platform');
    this.platforms.create(100, 120, 'platform');

    // 第五层平台（更高的空中平台）
    this.platforms.create(500, 60, 'platform');
    this.platforms.create(200, 40, 'platform');
    this.platforms.create(700, 20, 'platform');

    // 顶部平台（最高层）
    this.platforms.create(400, -60, 'platform');
    this.platforms.create(100, -120, 'platform');
    this.platforms.create(650, -140, 'platform');
  }

  private createPlayer() {
    this.player = this.physics.add.sprite(100, 500, 'player');
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.player.setScale(2); // 放大玩家

    // 设置相机边界
    this.cameras.main.setBounds(0, 0, 800, 1200);
  }

  private createPlayer2() {
    this.player2 = this.physics.add.sprite(150, 500, 'player2');
    this.player2.setBounce(0.1);
    this.player2.setCollideWorldBounds(true);
    this.player2.setScale(2); // 放大玩家
  }

  private createCoins() {
    this.coins = this.physics.add.group({
      key: 'coin',
      repeat: 11,
      setXY: { x: 100, y: 0, stepX: 70 }
    });

    this.coins.children.entries.forEach((coin: any) => {
      coin.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      coin.setScale(1.5);
    });
  }

  private createFireEnemies() {
    this.fireEnemies = this.physics.add.group();
    this.fireballs = this.physics.add.group();

    // 创建3个喷火敌人
    const fireEnemy1 = this.fireEnemies.create(300, 200, 'fireEnemy');
    fireEnemy1.setCollideWorldBounds(true);
    fireEnemy1.setBounce(1);
    fireEnemy1.setGravityY(-800); // 抵消重力，悬浮在空中

    const fireEnemy2 = this.fireEnemies.create(600, 100, 'fireEnemy');
    fireEnemy2.setCollideWorldBounds(true);
    fireEnemy2.setBounce(1);
    fireEnemy2.setGravityY(-800);

    const fireEnemy3 = this.fireEnemies.create(150, -50, 'fireEnemy');
    fireEnemy3.setCollideWorldBounds(true);
    fireEnemy3.setBounce(1);
    fireEnemy3.setGravityY(-800);

    // 定期喷火
    this.time.addEvent({
      delay: 2000,
      callback: this.shootFireballs,
      callbackScope: this,
      loop: true
    });
  }

  private createEnemies() {
    this.enemies = this.physics.add.group();

    // 创建3个敌人
    const enemy1 = this.enemies.create(300, 500, 'enemy');
    enemy1.minX = 200;
    enemy1.maxX = 400;
    enemy1.direction = 1;
    enemy1.setBounce(1);
    enemy1.setCollideWorldBounds(true);

    const enemy2 = this.enemies.create(500, 420, 'enemy');
    enemy2.minX = 550;
    enemy2.maxX = 700;
    enemy2.direction = -1;
    enemy2.setBounce(1);
    enemy2.setCollideWorldBounds(true);

    const enemy3 = this.enemies.create(700, 270, 'enemy');
    enemy3.minX = 700;
    enemy3.maxX = 800;
    enemy3.direction = 1;
    enemy3.setBounce(1);
    enemy3.setCollideWorldBounds(true);
  }

  private setupCollisions() {
    // 玩家与平台碰撞
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player2, this.platforms);

    // 金币与平台碰撞
    this.physics.add.collider(this.coins, this.platforms);

    // 敌人与平台碰撞
    this.physics.add.collider(this.enemies, this.platforms);

    // 火球与平台碰撞（直接销毁）
    this.physics.add.collider(this.fireballs, this.platforms, (fireball: any) => {
      fireball.destroy();
    });

    // 玩家1与火球碰撞
    this.physics.add.overlap(
      this.player,
      this.fireballs,
      this.hitByFireball as any,
      undefined,
      this
    );

    // 玩家2与火球碰撞
    this.physics.add.overlap(
      this.player2,
      this.fireballs,
      this.hitByFireball as any,
      undefined,
      this
    );

    // 玩家1与喷火敌人碰撞
    this.physics.add.overlap(
      this.player,
      this.fireEnemies,
      this.hitFireEnemy as any,
      undefined,
      this
    );

    // 玩家2与喷火敌人碰撞
    this.physics.add.overlap(
      this.player2,
      this.fireEnemies,
      this.hitFireEnemy as any,
      undefined,
      this
    );

    // 玩家1收集金币
    this.physics.add.overlap(
      this.player,
      this.coins,
      this.collectCoin as any,
      undefined,
      this
    );

    // 玩家2收集金币
    this.physics.add.overlap(
      this.player2,
      this.coins,
      this.collectCoin as any,
      undefined,
      this
    );

    // 玩家1与敌人碰撞
    this.physics.add.collider(
      this.player,
      this.enemies,
      this.hitEnemy as any,
      undefined,
      this
    );

    // 玩家2与敌人碰撞
    this.physics.add.collider(
      this.player2,
      this.enemies,
      this.hitEnemy as any,
      undefined,
      this
    );
  }

  private createUI() {
    // 分数文字
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 4
    });

    // 生命值文字
    this.livesText = this.add.text(16, 50, 'Lives: ❤️❤️❤️', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 4
    });

    // 提示文字
    this.add.text(400, 16, 'P1: Arrows/Space | P2: WASD/Shift', {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5, 0);
  }

  private collectCoin(
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    coin: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  ) {
    coin.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);

    // 如果所有金币都收集完了，创建新的金币
    if (this.coins.countActive(true) === 0) {
      this.coins.children.entries.forEach((coin: any) => {
        coin.enableBody(true, coin.x, 0, true, true);
      });

      // 增加难度：创建更多敌人
      const x = Phaser.Math.Between(0, 800);
      const enemy = this.enemies.create(x, 0, 'enemy');
      enemy.minX = Math.max(0, x - 100);
      enemy.maxX = Math.min(800, x + 100);
      enemy.direction = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;
      enemy.setBounce(1);
      enemy.setCollideWorldBounds(true);
    }
  }

  private hitEnemy(
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    enemy: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  ) {
    // 检查玩家是否从上方跳到敌人上
    if (player.body.velocity.y > 0 && player.y < enemy.y - 10) {
      // 踩到敌人，消灭敌人
      enemy.disableBody(true, true);
      player.setVelocityY(-300);
      this.score += 20;
      this.scoreText.setText('Score: ' + this.score);
    } else {
      // 被敌人撞到
      this.loseLife();
    }
  }

  private loseLife() {
    this.lives -= 1;
    
    const hearts = '❤️'.repeat(this.lives);
    this.livesText.setText('Lives: ' + hearts);

    if (this.lives <= 0) {
      this.physics.pause();
      this.player.setTint(0xff0000);
      this.gameOver = true;

      // 显示游戏结束文字
      const gameOverText = this.add.text(400, 300, 'Game Over!', {
        fontSize: '64px',
        color: '#ff0000',
        fontFamily: 'Arial',
        stroke: '#000000',
        strokeThickness: 8
      }).setOrigin(0.5);

      const finalScoreText = this.add.text(400, 370, 'Final Score: ' + this.score, {
        fontSize: '32px',
        color: '#ffffff',
        fontFamily: 'Arial',
        stroke: '#000000',
        strokeThickness: 4
      }).setOrigin(0.5);

      const restartText = this.add.text(400, 420, 'Press R to Restart', {
        fontSize: '24px',
        color: '#ffff00',
        fontFamily: 'Arial',
        stroke: '#000000',
        strokeThickness: 4
      }).setOrigin(0.5);

      // 闪烁效果
      this.tweens.add({
        targets: restartText,
        alpha: 0,
        duration: 500,
        ease: 'Linear',
        yoyo: true,
        repeat: -1
      });

      // 添加重启按键
      this.input.keyboard!.once('keydown-R', () => {
        this.scene.restart();
        this.score = 0;
        this.lives = 3;
        this.gameOver = false;
      });
    } else {
      // 重置玩家位置
      this.player.setPosition(100, 500);
      this.player.setVelocity(0, 0);
      this.player2.setPosition(150, 500);
      this.player2.setVelocity(0, 0);
      
      // 闪烁效果表示受伤
      this.player.setAlpha(0.5);
      this.player2.setAlpha(0.5);
      this.time.delayedCall(1000, () => {
        this.player.setAlpha(1);
        this.player2.setAlpha(1);
      });
    }
  }

  private shootFireballs() {
    if (this.gameOver) return;

    this.fireEnemies.children.entries.forEach((enemy: any) => {
      if (enemy.active) {
        // 向玩家1发射火球
        const angleTo1 = Phaser.Math.Angle.Between(
          enemy.x,
          enemy.y,
          this.player.x,
          this.player.y
        );
        
        const fireball1 = this.fireballs.create(enemy.x, enemy.y, 'fireball');
        fireball1.setVelocity(
          Math.cos(angleTo1) * 150,
          Math.sin(angleTo1) * 150
        );
        fireball1.setScale(1.5);

        // 如果玩家2距离较远，也向玩家2发射
        const distanceTo2 = Phaser.Math.Distance.Between(
          enemy.x,
          enemy.y,
          this.player2.x,
          this.player2.y
        );
        
        if (distanceTo2 < 400) {
          const angleTo2 = Phaser.Math.Angle.Between(
            enemy.x,
            enemy.y,
            this.player2.x,
            this.player2.y
          );
          
          const fireball2 = this.fireballs.create(enemy.x, enemy.y, 'fireball');
          fireball2.setVelocity(
            Math.cos(angleTo2) * 150,
            Math.sin(angleTo2) * 150
          );
          fireball2.setScale(1.5);
        }
      }
    });
  }

  private hitByFireball(
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    fireball: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  ) {
    fireball.destroy();
    this.loseLife();
  }

  private hitFireEnemy(
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    fireEnemy: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  ) {
    // 检查玩家是否从上方跳到敌人上
    if (player.body.velocity.y > 0 && player.y < fireEnemy.y - 5) {
      // 踩到喷火敌人，消灭敌人
      fireEnemy.disableBody(true, true);
      player.setVelocityY(-300);
      this.score += 50; // 喷火敌人分数更高
      this.scoreText.setText('Score: ' + this.score);
    } else {
      // 被喷火敌人撞到
      this.loseLife();
    }
  }
}
