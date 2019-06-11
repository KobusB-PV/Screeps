class MyRole{
    constructor(name, min1, min2, min3, min4, min5, min6, min7, min8, spawn, priority){
        this.name  = name
        this.level1  = min1
        this.level2  = min2
        this.level3  = min3
        this.level4  = min4
        this.level5  = min5
        this.level6  = min6
        this.level7  = min7
        this.level8  = min8
        this.num = 0
        this.lastTick = Game.time
        this.spawn = spawn,
        this.priority = priority
    };

    setNum(){
        if(this.lastTick !== Game.time){
            let room = Game.spawns[spawn].room;
            let creepsInRoom = room.find(FIND_MY_CREEPS);
            this.num = _.sum(creepsInRoom, (c) => c.memory.role == this.name);
        }
    };

    setLevelMin(level,min){
        let lvl = 'level' + level;
        this['lvl'].min = min;
    }
}
    
module.exports = {
    run: function(spawn){
        if(!spawn.memory.lastLevel || spawn.memory.lastLevel !== spawn.room.controller.level){
            delete spawn.memory.roleMin;
            spawn.memory.lastLevel = spawn.room.controller.level;
        }
        if(!spawn.memory.roleMin){
            spawn.memory.roleMin =  {
                harvester: new MyRole('harvester', 2, 2, 4, 4, 4, 4, 4, 4, 0),
                upgrader: new MyRole('upgrader', 2, 2, 3, 3, 2, 2, 2, 2, 0),
                builder: new MyRole('builder', 0, 1, 2, 2, 2, 1, 1, 1, 1),
                claimer: new MyRole('claimer', 0, 0, 0, 0, 0, 0, 0, 0, 3),
                wallRepairer: new MyRole('wallRepairer', 0, 0, 0, 1, 1, 1, 1, 1, 3),
                donkey: new MyRole('donkey', 0, 0, 0, 0, 1, 1, 1, 1, 2),
                extractor: new MyRole('extractor', 0, 0, 0, 0, 0, 0, 0, 0, 3)
            };
            console.log(spawn.name + ' - memory min role set.');
        }
    },
    
    linkTransfer: function(spawn){
        if(!spawn.memory.storageId && spawn.room.storage){
            spawn.memory.storageId = spawn.room.storage.id;
        }
        if(spawn.memory.storageId){
            let s = Game.getObjectById(spawn.memory.storageId);
            if(s){
                if(!spawn.memory.mainLinkId){
                    let struct = s.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                        filter: (s) => (s.structureType == STRUCTURE_LINK)
                    });
                    if(struct){
                        spawn.memory.mainLinkId = struct.id;
                    }
                }
                if(spawn.memory.mainLinkId){
                    let items = spawn.room.find(FIND_MY_STRUCTURES, {
                        filter: (s) => s.structureType === STRUCTURE_LINK && 
                                        s.id !== spawn.memory.mainLinkId &&
                                        s.energy > 0
                    });
                    let mainL = Game.getObjectById(spawn.memory.mainLinkId);
                    for(let i in items){
                        let secL = items[i];
                        secL.transferEnergy(mainL);
                    }
                }
            }
        }
    }
};