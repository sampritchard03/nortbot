Work in Progress

My attempt to create a mineflayer bot with a higher level of control, more easily able to execute complex tasks. 

It is made to endure varying conditions, using:
mineflayer-pvp (https://github.com/PrismarineJS/mineflayer-pvp)
mineflayer-auto-eat (https://github.com/linkle69/mineflayer-auto-eat)
and
MineflayerArmorManager (https://github.com/PrismarineJS/MineflayerArmorManager)
to keep itself alive while attempting to reach the following goals (in order of priority):
- attack target entity (planned)
- collect ground items
- place extra items in chest (planned)
- interact with target entity (planned)
- break/interact with target block (planned)
- stand at target position (planned)
- aiTick function (inject for custom idle code, maybe wander aimlessly or follow owner)
Also adds a bunch of new methods and parameters to the base mineflayer bot.
