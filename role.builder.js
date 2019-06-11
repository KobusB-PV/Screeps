var roleUpgrader = require('role.upgrader');

module.exports = {
    run: function (creep) {
        if (creep.memory.target && creep.room.name != creep.memory.target) {
            creep.moveToTargetRoom(creep.memory.target);
            return;
        }
        creep.setWorking();
        if (creep.memory.working == true) {
            // Repair most needed
            let structure;
            let structureRep2;
            let structureRep = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.hits < s.hitsMax * 1 / 3 
                                && s.structureType !== STRUCTURE_WALL
                                && s.structureType !== STRUCTURE_RAMPART
            });
            if (structureRep) {
                if (creep.repair(structureRep) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(structureRep, { visualizePathStyle: { stroke: '#b1ff86' } });
                }
            }
            if(!structureRep){
                structure = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if (structure != undefined) {
                    if (creep.build(structure) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(structure, { visualizePathStyle: { stroke: '#b1ff86' } });
                    }
                }
            }
            // Look for stuff to build
            if(!structureRep && !structure){
                structureRep2 = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => s.hits < s.hitsMax
                                    && s.structureType !== STRUCTURE_WALL
                                    && s.structureType !== STRUCTURE_RAMPART
                });
                if (structureRep2 !== undefined) {
                    if (creep.repair(structureRep2) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(structureRep2, { visualizePathStyle: { stroke: '#b1ff86' } });
                    }
                }
            }
            if(!structureRep && !structure && !structureRep2){
                roleUpgrader.run(creep);
            }
        }
        else creep.getEnergy(true);
    }
};