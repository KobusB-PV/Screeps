var listOfRoles = ['harvester', 'upgrader', 'builder', 'wallRepairer', 'donkey', 'miner'];

StructureSpawn.prototype.spawnEmergencyHarvester = function(){
    if(!this.spawning){
        this.createBasic();
    }
};

StructureSpawn.prototype.spawnCreepsIfNecessary = function (creepsInRoom) {
    let room = this.room;
    let numberOfCreeps = {};
    let maxEnergy = room.energyAvailable;
    let name = undefined;    
    
    let newList = _.sortBy(this.memory.roleMin, r => r.priority);
    for(let r in newList){
        //console.log(JSON.stringify(newList[r]));
    }

    for (let role of listOfRoles) {
        if(this.memory.roleMin[role]){
            console.log(JSON.stringify(this.memory.roleMin[role]));
            this.memory.roleMin[role].num = _.sum(creepsInRoom, (c) => c.memory.role == role);
            numberOfCreeps[role] = this.memory.roleMin[role].num;
        }
    }        

    let sources = room.find(FIND_SOURCES);
    for (let source of sources) {
        if (!_.some(creepsInRoom, c => c.memory.role == 'miner' && c.memory.sourceId == source.id)) {
            
            let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: s => s.structureType == STRUCTURE_CONTAINER
            });
            if (containers.length > 0) {
                
                name = this.createMiner(source.id);
                break;
            }
        }
    }


    if (name == undefined) {
        if(name === undefined){
            
            for (let role of listOfRoles) {
                let lvl = 'level' + this.room.controller.level;
                let min;
                for(var item in this.memory.roleMin[role])
                {
                    if(item === lvl)
                    {
                        min = this.memory.roleMin[role][item];
                        
                    }
                }
                if (numberOfCreeps[role] < min) {
                    //console.log('role - ' + role + ' & spawn -' + this.name);
                //    name = this.createCustomCreep(maxEnergy, role);
                    break;
                }
            }                 
        }            
    }
    if(name == undefined){
        if(this.memory.roleMin['donkey'].num < 1 && this.room.controller.level >= 5){
            name = this.createDonkey();
        }
    }

    if (name != undefined && _.isString(name)) {
        console.log(this.name + " spawned new creep: " + name + " (" + Game.creeps[name].memory.role + ")");
        for (let role of listOfRoles) {
            console.log(role + ": " + numberOfCreeps[role]);
        }
    }
};


StructureSpawn.prototype.createBasic = function (){
    return this.createCreep([MOVE,WORK,CARRY],undefined,{role:'harvester',working:false});
};

StructureSpawn.prototype.createCustomCreep = function (energy, roleName) {
    var numberOfParts = Math.floor(energy / 200);
    numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
    var body = [];
    for (let i = 0; i < numberOfParts; i++) {
        body.push(WORK);
    }
    for (let i = 0; i < numberOfParts; i++) {
        body.push(CARRY);
    }
    for (let i = 0; i < numberOfParts; i++) {            
        body.push(MOVE);
    }
    return this.createCreep(body, undefined, { role: roleName, working: false });
};

StructureSpawn.prototype.createLongDistanceHarvester = function (energy, numberOfWorkParts, home, target, sourceIndex) {
    var body = [];
    for (let i = 0; i < numberOfWorkParts; i++) {
        body.push(WORK);
    }
    energy -= 150 * numberOfWorkParts;
    var numberOfParts = Math.floor(energy / 100);
    numberOfParts = Math.min(numberOfParts, Math.floor((50 - numberOfWorkParts * 2) / 2));
    for (let i = 0; i < numberOfParts; i++) {
        body.push(CARRY);
    }
    for (let i = 0; i < numberOfParts + numberOfWorkParts; i++) {
        body.push(MOVE);
    }
    return this.createCreep(body, undefined, {
            role: 'longDistanceHarvester',
            home: home,
            target: target,
            sourceIndex: sourceIndex,
            working: false
        });
    };

StructureSpawn.prototype.createClaimer = function (target) {
    return this.createCreep([CLAIM, MOVE], undefined, { role: 'claimer', target: target });
};

StructureSpawn.prototype.createMiner = function (sourceId) {
    return this.createCreep([WORK, WORK, WORK, WORK, WORK, MOVE, CARRY], undefined, { role: 'miner', sourceId: sourceId });
};

StructureSpawn.prototype.createDonkey = function () {
    return this.createCreep([WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, { role: 'donkey' });
};

StructureSpawn.prototype.createExtractor = function () {
    return this.createCreep([WORK, WORK, WORK,MOVE,MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, { role: 'donky' });
};