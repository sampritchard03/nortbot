Work in Progress

My attempt to create a mineflayer bot with a higher level of control, more easily able to execute complex tasks. 

It is made to endure varying conditions, using:
- mineflayer-pvp (https://github.com/PrismarineJS/mineflayer-pvp)
- mineflayer-auto-eat (https://github.com/linkle69/mineflayer-auto-eat)
- MineflayerArmorManager (https://github.com/PrismarineJS/MineflayerArmorManager)
to keep itself alive while attempting to reach the following goals (in order of priority):
- attack target entity (planned)
- collect whitelisted ground items, throw out trash if inventory full (planned)
- place extra items in chests (planned)
- mine whitelisted valuable blocks (planned)
- interact with target entity (planned)
- break/interact with target block (planned)
- stand at target position (planned)
- idleTick event (custom ai inject)
Also adds a bunch of new methods and parameters to the base mineflayer bot.

Install: npm install nortbot
