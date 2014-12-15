'use strict';

var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    _ = require('underscore'),
    ConnectionCollection = require('./connection-collection');

function Room(roomId) {
    EventEmitter.call(this);
    this.roomId = roomId;
    this.connections = new ConnectionCollection();

    this.getUserIds = this.getUserIds.bind(this);

    this.addConnection = this.addConnection.bind(this);
    this.removeConnection = this.removeConnection.bind(this);
}

util.inherits(Room, EventEmitter);

Room.prototype.getUserIds = function() {
    return this.connections.getUserIds();
};

Room.prototype.addConnection = function(connection) {
    if (this.getUserIds().indexOf(connection.userId) === -1) {
        // User joining room
        this.emit('user_join', {
            roomId: this.roomId,
            userId: connection.userId
        });
    }
    this.connections.add(connection);
};

Room.prototype.removeConnection = function(connection) {
    if (this.connections.remove(connection)) {
        if (this.getUserIds().indexOf(connection.userId) === -1) {
            // Leaving room altogether
            this.emit('user_leave', {
                roomId: this.roomId,
                userId: connection.userId
            });
        }
    }
};

module.exports = Room;