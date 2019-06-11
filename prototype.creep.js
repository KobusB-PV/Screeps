var roles = {
    harvester: require('role.harvester'),
    upgrader: require('role.upgrader'),
    builder: require('role.builder'),
    miner: require('role.miner'),    
    wallRepairer: require('role.wallRepairer'),
    donkey: require('role.donkey'),
    claimer: require('role.claimer'),
    extractor: require('role.extractor')
};

Creep.prototype.runRole = function () {
    if(roles[this.memory.role]){
        roles[this.memory.role].run(this);
    }        
};

Creep.prototype.getEnergy = function(useStorage){
    let storage;
    let container = true;
    if(useStorage && this.room.storage){
        if(this.room.storage.store[RESOURCE_ENERGY] > 2000){  
            if(!this.room.memory.storageId){
                this.room.memory.storageId = this.room.storage.id;
            }
            storage = Game.getObjectById(this.room.memory.storageId);
            if(storage){
                container = false
                if (this.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    this.moveTo(storage, { visualizePathStyle: { stroke: '#00ffff' } });
                }
            }
        }
    }
    if(useStorage && container){
        container = this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => (s.structureType === STRUCTURE_CONTAINER) &&
                             s.store[RESOURCE_ENERGY] > 0
            });
            if (container !== undefined) {
                if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(container, { visualizePathStyle: { stroke: '#00ff00' } });
                }
            }
    }
    if(!storage || !useStorage){
        let source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (this.harvest(source) === ERR_NOT_IN_RANGE) {
            this.moveTo(source, { visualizePathStyle: { stroke: '#00ff00' } });
        }
    }
};

Creep.prototype.setWorking = function(){
    if (this.memory.working === true && this.carry.energy == 0) {
        this.memory.working = false;
    }
    else if (this.memory.working == false && this.carry.energy == this.carryCapacity) {
        this.memory.working = true;
    }
    else if(!this.memory.working){
        this.memory.working = false;
    }
};

Creep.prototype.moveToTargetRoom = function(target){
    const route = Game.map.findRoute(this.room, target);
    if(route.length > 0) {
        const exit = this.pos.findClosestByRange(route[0].exit);
        this.moveTo(exit, { visualizePathStyle: { stroke: '#ff0000' } });
    }
};