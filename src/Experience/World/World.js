import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Fox from './Fox.js'
import Bullet from "./Entity/Bullet";
import EnemyHorizontal from "./Entity/Enemies/EnemyHorizontal";
import EnemyVertical from "./Entity/Enemies/EnemyVertical";
import Player from "./Entity/Player";
import Enemy from "./Entity/Enemies/Enemy";

export default class World
{


    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.floor = new Floor()
            this.environment = new Environment()
            this.player = new Player();
            this.initEnemies();
        })
    }

    initEnemies() {

        this.enemyHorizontal = new EnemyHorizontal();
        this.enemyVertical = new EnemyVertical();

        Enemy.setPlayer(this.player);

        // setInterval(() => {
        //     Enemy.shoot(this.enemyHorizontal)
        // }, this.enemyHorizontal.getShootingDelay());
        //
        // setInterval(() => {
        //     Enemy.shoot(this.enemyVertical)
        // }, this.enemyVertical.getShootingDelay());
    }

    update()
    {
        if(Bullet.bullets.length > 0){
            Bullet.bullets.forEach(bullet =>{
                    bullet.update()
                }
            )
        }
        if(this.enemyHorizontal)
            this.enemyHorizontal.update()
        if(this.enemyVertical)
            this.enemyVertical.update()
        if(this.player)
            this.player.update()
    }
}