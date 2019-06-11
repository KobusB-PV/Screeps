module.exports = {
    run: function(spawn){
        if (spawn.room.terminal) {
            let targets = spawn.room.find(FIND_MINERALS);
            let target = targets[0];
            if (target !== undefined) {
                let myType = target.mineralType;
                if (myType !== undefined) {
                    if (spawn.room.terminal.store[RESOURCE_ENERGY] >= 2000 && spawn.room.terminal.store[myType] >= 2000) {
                        var orders = Game.market.getAllOrders(order => order.resourceType === myType && order.type === ORDER_BUY && Game.market.calcTransactionCost(200, spawn.room.name, order.roomName) < 400);
                        //console.log(myType + ' buy orders found: ' + orders.length);
                        orders.sort(function (a, b) { return b.price - a.price; });
                        //console.log('Best price: ' + orders[0].price);
                        if (orders[0].price > 0.1) {
                            var result = Game.market.deal(orders[0].id, 200, spawn.room.name);
                            if (result === 0) {
                                console.log('Order completed successfully');
                            }
                        }
                    }
                }
            }
        }
    }
};