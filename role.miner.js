module.exports = {
    run: function (creep) {
        creep.setWorking();
        let source = Game.getObjectById(creep.memory.sourceId);
        if(creep.carryCapacity > 0){
            if(creep.memory.working == true)
            {
                let link = creep.pos.findClosestByPath(FIND_STRUCTURES,{
                    filter: s => s.structureType === STRUCTURE_LINK
                });
                if(link){
                    if(creep.transfer(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(link);
                    }
                }
                else{
                    for(const resourceType in creep.carry) {
                        creep.drop(resourceType);
                    }
                }
            }
            else{
                let container = source.pos.findInRange(FIND_STRUCTURES, 1, {
                    filter: s => s.structureType == STRUCTURE_CONTAINER
                })[0];
                if (creep.pos.isEqualTo(container.pos)) {
                    creep.harvest(source);
                }
                else creep.moveTo(container, { visualizePathStyle: { stroke: '#ffffff' } });        
            }
        }
        else{
            let container = source.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: s => s.structureType == STRUCTURE_CONTAINER
            })[0];
            if (creep.pos.isEqualTo(container.pos)) {
                creep.harvest(source);
            }
            else creep.moveTo(container, { visualizePathStyle: { stroke: '#ffffff' } });    
        }
    }
};