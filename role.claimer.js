module.exports = {
    run: function(creep) {
        
        
        if (creep.room.name != creep.memory.target) {
            creep.say(1);
            var exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }
        else {
            creep.say(2);
            if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};