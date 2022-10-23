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
            // this.fox = new Fox()
            this.environment = new Environment()
            this.enemyHorizontal = new EnemyHorizontal();
            this.enemyVertical = new EnemyVertical();
            this.player = new Player();
            // setInterval(() => {
            //     Enemy.shoot(this.enemyHorizontal)
            //     // Enemy.shoot(this.enemyVertical)
            // }, 2*1000);



        })
    }

    update()
    {
        if(this.fox)
            this.fox.update();
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