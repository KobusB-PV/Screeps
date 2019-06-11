require('prototype.creep');
require('prototype.tower');
require('prototype.spawn');
let admin = require('role.admin');
let doVisual = require('my.visuals'); 
let doTerminal = require('my.terminal');

module.exports.loop = function() {
    for (let name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            delete Memory.creeps[name];
        }
    }
    for (let name in Game.creeps) {
        Game.creeps[name].runRole();
    }
    
    var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    for (let tower of towers) {
        tower.defend();
    }

    for (let spawnName in Game.spawns) {
        admin.run(Game.spawns[spawnName]);
        if(Game.time % 5 === 0){
            admin.linkTransfer(Game.spawns[spawnName]);
        }
        let creepsInRoom = Game.spawns[spawnName].room.find(FIND_MY_CREEPS);
        let harvesters = _.sum(creepsInRoom, (c) => c.memory.role === 'harvester');
        if(harvesters < 2){
            Game.spawns[spawnName].spawnEmergencyHarvester();
        }
        else{
            if(!Game.spawns[spawnName].spawning){
                Game.spawns[spawnName].spawnCreepsIfNecessary(creepsInRoom);       
            }
        }
        doTerminal.run(Game.spawns[spawnName]);
    }    
    doVisual.run();
};