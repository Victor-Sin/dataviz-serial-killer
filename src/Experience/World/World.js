import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Fox from './Fox.js'
import Bullet from "./Entity/Bullet";
import EnemyHorizontal from "./Entity/Enemies/EnemyHorizontal";
import EnemyVertical from "./Entity/Enemies/EnemyVertical";
import Player from "./Entity/Player";
import Enemy from "./Entity/Enemies/Enemy";
import Block from './Entity/Block.js';
import ClickBlock from './GameUi/ClickBlock.js';

export default class World {

  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    // Wait for resources
    this.resources.on('ready', () => {
      // Setup
      this.floor = new Floor()
      this.environment = new Environment()
      this.player = new Player();
      this.initEnemies();
      this.blockPlaceholder = new Block({ opacity: 0.25 });
      this.clickBlock = new ClickBlock(this.blockPlaceholder);
    })
  }

  initEnemies() {
    this.enemyHorizontal = new EnemyHorizontal();
    this.enemyVertical = new EnemyVertical();

    Enemy.setPlayer(this.player);

    setInterval(() => {
      Enemy.shoot(this.enemyHorizontal)
    }, this.enemyHorizontal.getShootingDelay());

    setInterval(() => {
      Enemy.shoot(this.enemyVertical)
    }, this.enemyVertical.getShootingDelay());
  }

  update() {
    if (!document.hidden) {
      if (Bullet.bullets.length > 0) {
        Bullet.bullets.forEach(bullet => bullet.update()
        )
      }
      if (Block.blocks.length > 0) {
        Block.blocks.forEach(block => block.update()
        )
      }
      if (this.enemyHorizontal)
        this.enemyHorizontal.update();
      if (this.enemyVertical)
        this.enemyVertical.update();
      if (this.player)
        this.player.update();
      if (this.clickBlock)
        this.clickBlock.update();

    }

  }
}
