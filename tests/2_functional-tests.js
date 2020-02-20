/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const Board = require('../models/new_board.model')

chai.use(chaiHttp);

suite('Functional Tests', function() {
  //ID for testing.
  let testThreadID

  //Clear database before running tests.
  this.beforeAll((done) => {
    Board.deleteMany({}, (err) => {
      assert.ifError(err);
      console.log('Deleted all current items in database.')
      done()
    })
  })

  suite('API ROUTING FOR /api/threads/:board', () => {
    
    suite('POST',() => {
      test('Post a new thread', (done) => {
        chai.request(server)
            .post('/api/threads/test')
            .send({text:'test text', delete_password:'password'})
            .end((err, res) => {
              assert.equal(res.status, 200)
              done()
            })
      })
      
    })
    
    suite('GET', () => {
      test('Get an array of 10 most recent bumped threads with only the 3 most recent replies', (done) => {
        chai.request(server)
            .get('/api/threads/test')
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.isArray(res.body)
              assert.isBelow(res.body.length, 11)
              assert.isBelow(res.body[0].replies.length, 4)
              assert.notProperty(res.body[0], 'reported')
              assert.notProperty(res.body[0], 'delete_password')
              //Grab ID
              testThreadID = res.body[0]._id
              done()
            })
      })
    });
    
    suite('PUT', () => {
      test('Report a thread', (done) => {
        chai.request(server)
            .put('/api/threads/test')
            .send({board: 'test', thread_id: testThreadID})
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.equal(res.text, 'success')
              done()
            })
      })
    })
    
    suite('DELETE', () => {
      test('Delete a thread', (done) => {
        chai.request(server)
            .delete('/api/threads/test')
            .send({board: 'test', thread_id: testThreadID, delete_password: 'password'})
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.equal(res.text, 'success')
              done()
            })
      })
    })

  });
  
  suite('API ROUTING FOR /api/replies/:board', () => {
    //ID for testing.
    let testThreadID
    let testReplyID

    //Thread was deleted in previous test, so create a new one first.
    suite('POST', () => {
      test('Post a new thread', (done) => {
        chai.request(server)
            .post('/api/threads/test')
            .send({text: 'test text', delete_password: 'password'})
            .end((err, res) => {
              assert.equal(res.status, 200)
              done()
            })
      }) 
    })

    //Get the testThreadID for further use.
    suite('GET', () => {
      test('Get test thread id', (done) => {
        chai.request(server)
            .get('/api/threads/test')
            .end((err, res) => {
              assert.equal(res.status, 200)
              //Grab ID
              testThreadID = res.body[0]._id
              done()
            })
      })
    })
    
    //Continue with reply tests.
    suite('POST', () => {
      test('Reply to a thread', (done) => {
        chai.request(server)
        .post('/api/replies/test')
        .send({board: 'test', thread_id: testThreadID, delete_password: 'password'})
        .end((err, res) => {
          assert.equal(res.status, 200)
          done()
        })
      })
    })
    
    suite('GET', () => {
      test('Get entire thread with all replies', (done) => {
        chai.request(server)
        .get('/api/replies/test?thread_id=' + testThreadID)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.notProperty(res.body[0], 'reported')
          assert.notProperty(res.body[0], 'delete_password')
          assert.isArray(res.body[0].thread[0].replies)
          assert.notProperty(res.body[0].thread[0].replies[0], 'reported')
          assert.notProperty(res.body[0].thread[0].replies[0], 'delete_password')
          //Grab reply id
          testReplyID = res.body[0].thread[0].replies[0]._id
          done()
        })
      })
    })
    
    suite('PUT', () => {
      test('Report a reply', (done) => {
        chai.request(server)
            .put('/api/replies/test')
            .send({board: 'test', thread_id: testThreadID, reply_id: testReplyID})
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.equal(res.text, 'success')
              done()
            })
      })
    })
    
    suite('DELETE', () => {
      test('Delete a reply', (done) => {
        chai.request(server)
            .delete('/api/replies/test')
            .send({board: 'test', thread_id: testThreadID, reply_id: testReplyID, delete_password: 'password'})
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.equal(res.text, 'success')
              done()
            })
      })
    })
    
  })

})
