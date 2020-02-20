'use strict'

const BoardHandler = require('../controllers/boardHandler')

module.exports = (app) => {
  const boardHandler = new BoardHandler()
  
  app.route('/api/threads/:board')
     .post(boardHandler.postThread)
     .get(boardHandler.recentlyBumped)
     .delete(boardHandler.deleteThread)
     .put(boardHandler.reportThread)

  app.route('/api/replies/:board')
     .post(boardHandler.replyThread)
     .get(boardHandler.getThread)
     .delete(boardHandler.deleteReply)
     .put(boardHandler.reportReply)
}
