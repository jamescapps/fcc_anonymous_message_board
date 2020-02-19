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
    
    suite('POST', function() {
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
    
    suite('GET', function() {
      test('Get an array of 10 most recent bumped threads with only the 3 most recent replies', (done) => {
        chai.request(server)
            .get('/api/threads/test')
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.isArray(res.body)
              assert.isBelow(res.body.length, 11)
              assert.isBelow(res.body[0].replies.length, 4)
              //Grab ID
              testThreadID = res.body[0]._id
              done()
            })
      })
    });
    
    suite('PUT', function() {
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
    
    suite('DELETE', function() {
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
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    //ID for testing.
    let testThreadID

    //Thread was deleted in previous test, so create a new one first.
    suite('POST', function() {
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
    
    suite('POST', function() {
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
    
    suite('GET', function() {
      test('Get entire thread with all replies', (done) => {
        chai.request(server)
        .get(`/api/replies/test?thread_id=testThreadID`)
        //.query({thread_id: testThreadID})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isArray(res.body.replies)
          done()
        })
      })
    });
    
    suite('PUT', function() {
      
    });
    
    suite('DELETE', function() {
      
    });
    
  });

});
