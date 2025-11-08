import mineflayer from "mineflayer"
import pkg from "mineflayer-pathfinder"
const {pathfinder, Movements, goals} = pkg
import {plugin as collectBlock} from "mineflayer-collectblock"
import {loader as autoEat} from "mineflayer-auto-eat"
import armorManager from "mineflayer-armor-manager"
import {plugin as pvp} from "mineflayer-pvp"

export function plugin(bot) {

    bot.ownerName = "Slaals" // default to me >:) you have to change it manually
    bot.enemyRange = 24
    bot.groundItemRange = 6
    bot.aiTick = () => {}

    // getters for nearest enemy, nearest ground item, and the owner entity.
    Object.defineProperty(bot, 'enemy', {
        get: function() {
            return bot.nearestEntity(entity => entity.type == "hostile" && bot.entity.position.distanceTo(entity.position) < bot.enemyRange);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(bot, 'groundItem', {
        get: function() {
            const entity = bot.nearestEntity(entity => entity.name == "item" && bot.entity.position.distanceTo(entity.position) < bot.groundItemRange);
            if (!entity) return undefined
            return {
                entity: entity,
                data: entity.getDroppedItem()
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(bot, 'owner', {
        get: function() {
            return bot.nearestEntity(entity => entity.username == bot.ownerName);
        },
        enumerable: true,
        configurable: true
    });

    bot.loadPlugin(pathfinder)
    bot.loadPlugin(pvp)
    bot.loadPlugin(collectBlock)
    bot.loadPlugin(autoEat)
    bot.loadPlugin(armorManager)

    bot.once("spawn", () => {
        bot.waitForChunksToLoad().then(() => {
            bot.autoEat.enableAuto()

            // more initialization stuff
        })
    })

    var time = 0
    bot.on("physicTick", () => { // extremely simple ai logic
        if (bot.enemy) {
            if (time % 5 == 0) bot.pvp.attack(bot.enemy)
        } else {
            bot.pvp.stop()
            if (bot.groundItem) {
                if (time % 5 == 0) bot.pathfinder.setGoal(new goals.GoalFollow(bot.groundItem.entity, 0))
            } else {
                bot.aiTick()
            }
            
        }

        time++
    })
}


const bot = mineflayer.createBot({username:"Goku", version:"1.21.8"})

bot.loadPlugin(plugin)