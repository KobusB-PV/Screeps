module.exports = {
    run : function(){
        runSpawnVisual();
        
        function runSpawnVisual(){
            for (let spawnName in Game.spawns) {
                if (Game.spawns[spawnName].spawning) {
                    var spawningCreep = Game.creeps[Game.spawns[spawnName].spawning.name];
                    var Percentage = (((Game.spawns[spawnName].spawning.needTime - Game.spawns[spawnName].spawning.remainingTime) / Game.spawns[spawnName].spawning.needTime) * 100).toFixed(2);
                    var symbol = '\uD83D\uDEA7';
                    Game.spawns[spawnName].room.visual.text(
                        symbol + spawningCreep.memory.role + ' ' + Percentage + '%',
                        Game.spawns[spawnName].pos.x + 1.5,
                        Game.spawns[spawnName].pos.y,
                        { size: '0.4', align: 'left', opacity: 0.5, 'backgroundColor': '#040404', color: 'lime' });
                }
            }
        }
    }
};