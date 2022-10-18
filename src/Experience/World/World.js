import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Fox from './Fox.js'
import Bullet from "./Entity/Bullet";
import EnemyHorizontal from "./Entity/Enemies/EnemyHorizontal";
import EnemyVertical from "./Entity/Enemies/EnemyVertical";
import Player from "./Entity/Player";

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


        })
    }

    update()
    {
        if(this.fox)
            this.fox.update();
    }
}