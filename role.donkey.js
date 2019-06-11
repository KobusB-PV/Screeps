module.exports = {
    run: function(creep) {
        creep.setWorking();
        
        if(!creep.memory.storageId && creep.room.storage){
            creep.memory.storageId = creep.room.storage.id;
        }
        if(creep.memory.storageId){
            
            let s = Game.getObjectById(creep.memory.storageId);
            if(s){
                let struct = s.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_LINK)});
                if(struct){
                    creep.memory.linkId = struct.id;
                }
            }
        }
        if (creep.memory.working == true) {
            if(!creep.memory.storageId){ 
                var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_SPAWN
                                 || s.structureType == STRUCTURE_EXTENSION
                                 || s.structureType == STRUCTURE_TOWER)
                                 && s.energy < s.energyCapacity
                });

                if (structure == undefined) {
                    structure = creep.room.storage;
                }

                if (structure != undefined) {
                    if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(structure);
                    }
                }
            }
            let s = Game.getObjectById(creep.memory.storageId);
            if(s){
                if (creep.transfer(s, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(s, { visualizePathStyle: { stroke: '#FFFFFF' } });
                }
            }
        }
        else{
            //creep.say(creep.memory.linkId);
            if(creep.memory.linkId){
                let link = Game.getObjectById(creep.memory.linkId);
                if(link){
                    if (creep.withdraw(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(link, { visualizePathStyle: { stroke: '#00ffff' } });
                    }
                }
            }
            else{
                let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
                });

                if (container == undefined) {
                    container = creep.room.storage;
                }

                if (container != undefined) {
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                }
            } 
        }
    }
};