'use strict'

var expect = require('chai').expect;
var BoardHandler = require('../controllers/boardHandler')

module.exports = function (app) {
  var boardHandler = new BoardHandler()
  
  app.route('/api/threads/:board')
     .post(boardHandler.postThread)
     .get(boardHandler.recentlyBumped)
     .delete(boardHandler.deleteThread)
     .put(boardHandler.reportThread)

  app.route('/api/replies/:board')
     .post(boardHandler.replyThread)
     .delete(boardHandler.deleteReply)
     .put(boardHandler.reportReply)
}
