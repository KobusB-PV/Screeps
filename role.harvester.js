let upgrade = require('role.upgrader');

module.exports = {
    run: function(creep) {
        creep.setWorking();
        if (creep.memory.working === true) {
            let structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_SPAWN
                             || s.structureType == STRUCTURE_EXTENSION
                             || s.structureType == STRUCTURE_TOWER)
                             && s.energy < s.energyCapacity
            });
            if(!creep.memory.storageId && creep.room.storage){
                creep.memory.storageId = creep.room.storage.id;
            }
            if (structure != undefined) {
                if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure, { visualizePathStyle: { stroke: '#FFFFFF' } });
                }
                return;
            }
            else if(!creep.memory.storageId){
                let myStorage = Game.getObjectById(creep.memory.storageId);
                if(myStorage){
                    creep.say('yey');
                    if (creep.transfer(myStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(myStorage, { visualizePathStyle: { stroke: '#FFFFFF' } });
                    }
                    return;
                }
            }
            upgrade.run(creep);
        }
        else creep.getEnergy(true);
    }
};