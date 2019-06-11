module.exports = {
    run: function(creep) {
        creep.setWorking();
        //creep.say(123);
        if (creep.memory.working == true) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#b1ff86' } });
            }
        }
        else creep.getEnergy(true);
    }
};