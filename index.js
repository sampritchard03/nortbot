import pkg from "mineflayer-pathfinder"
const {pathfinder, Movements, goals} = pkg
import {plugin as collectBlock} from "mineflayer-collectblock"
import {loader as autoEat} from "mineflayer-auto-eat"
import armorManager from "mineflayer-armor-manager"
import {plugin as pvp} from "mineflayer-pvp"

function bestTool(tools) {
    function scoreTool(tool) {
        if (tool.name.includes("netherite")) {
            return 6
        } else if (tool.name.includes("diamond")) {
            return 5
        } else if (tool.name.includes("iron")) {
            return 4
        } else if (tool.name.includes("stone")) {
            return 3
        } else if (tool.name.includes("golden")) {
            return 2
        } else if (tool.name.includes("wooden")) {
            return 1
        }
        return 0
    }

    var bestTool = null
    var bestToolScore = 0
    tools.forEach(tool => {
        var toolScore = scoreTool(tool)
        if (toolScore > bestToolScore) {
            bestToolScore = toolScore
            bestTool = tool
        }
    })
    return bestTool
}

export function plugin(bot) {

    bot.enemyRange = 6
    bot.groundItemRange = 32
    bot.aiInterval = 5 // number of ticks between ai calls. Too low causes stuttering
    bot.time = 0 // number of physics ticks since initialization.

    bot.loadPlugin(pathfinder)
    bot.loadPlugin(pvp)
    bot.loadPlugin(collectBlock)
    bot.loadPlugin(autoEat)
    bot.loadPlugin(armorManager)

    // getters
    {
        // getters for nearby entities
        bot.enemy = () => bot.nearestEntity(entity => entity.type == "hostile" && bot.entity.position.distanceTo(entity.position) < bot.enemyRange)
        bot.groundItem = () => bot.nearestEntity(entity => entity.name == "item" && bot.entity.position.distanceTo(entity.position) < bot.groundItemRange)

        // getters for inventory
        bot.inventory.sword = () => bestTool(Object.values(bot.inventory.slots).filter(item => item != null && item.name.includes("sword")))
    }

    // setters
    {
        bot.setHuntTarget = (entity) => {bot.huntTarget = entity}
        bot.setFollowTarget = (entity) => {bot.followTarget = entity}
    }

    bot.once("spawn", () => {
        bot.waitForChunksToLoad().then(() => {

            const movements = new Movements(bot)
            movements.allowFreeMotion = true
            bot.pathfinder.setMovements(movements)

            bot.emit("init")

            bot.on("physicsTick", () => {
                if (bot.huntTarget && !bot.huntTarget.isValid) bot.huntTarget = undefined
                if (bot.followTarget && !bot.followTarget.isValid) bot.followTarget = undefined

                if (bot.time % bot.aiInterval == 0) ai()
                bot.time++
            })
        })
    })

    function ai() { // extremely simple ai logic
        bot.emit("ai")
        let entity;
        let item;
        if (entity = bot.enemy() || bot.huntTarget) {
            bot.autoEat.disableAuto()
            if (item = bot.inventory.sword()) bot.equip(item)
            if (!entity) {
                bot.pvp.attack(bot.huntTarget)
            } else {
                bot.pvp.attack(entity)
            }
        } else {
            bot.pvp.stop()
            bot.autoEat.enableAuto()
            if (entity = bot.groundItem()) {
                item = entity.getDroppedItem()
                bot.pathfinder.setGoal(new goals.GoalFollow(entity, 0))
            } else if (bot.followTarget) {
                bot.pathfinder.setGoal(new goals.GoalFollow(bot.followTarget, 3))
            } else {
                bot.emit("idle")
            } 
        }
    }
}

