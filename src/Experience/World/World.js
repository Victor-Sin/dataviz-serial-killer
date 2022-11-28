import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Bullet from "./Entity/Bullet";
import EnemyHorizontal from "./Entity/Enemies/EnemyHorizontal";
import EnemyVertical from "./Entity/Enemies/EnemyVertical";
import Player from "./Entity/Player";
import Enemy from "./Entity/Enemies/Enemy";
import Bomb from "./Entity/Bomb";
import Block from "./Entity/Block";
import ClickBlock from "./GameUi/ClickBlock";
import {Vector3} from "three";
import Turret from "./Entity/Enemies/Turret";
import Fox from './Fox.js';

export default class World
{


    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.resources.on('ready', () => {
          this.floor = new Floor()
          this.environment = new Environment()
          this.player = new Player();
          this.initEnemies();
          this.bomb = new Bomb(new Vector3(10,0,10));
          this.blockPlaceholder = new Block({ opacity: 0.25 });
          this.clickBlock = new ClickBlock(this.blockPlaceholder);
          
        })
  }

    initEnemies() {
        this.enemyHorizontal = new EnemyHorizontal();
        this.enemyVertical = new EnemyVertical();
        this.turret = new Turret();

        Enemy.setPlayer(this.player);

        setInterval(() => {
            Enemy.shoot(this.enemyHorizontal)
        }, this.enemyHorizontal.getShootingDelay()*3);

        setInterval(() => {
            Enemy.shoot(this.enemyVertical)
        }, this.enemyVertical.getShootingDelay()*3);

        setInterval(()=>{
            this.turret.shoot()
        },this.turret.getShootingDelay());
    }

    update()
    {
        if(!document.hidden){
            if(Bullet.bullets.length > 0){
                Bullet.bullets.forEach(bullet => bullet.update()
                )
            }
            if(Bomb.bombs.length > 0){
                Bomb.bombs.forEach(bomb => bomb.update());
            }
            if (Block.blocks.length > 0) {
                Block.blocks.forEach(block => block.update()
                )
            }
            if(this.enemyHorizontal)
                this.enemyHorizontal.update()
            if(this.enemyVertical)
                this.enemyVertical.update()
            if(this.player)
                this.player.update()
            if (this.clickBlock)
                this.clickBlock.update();
        }

    }
}