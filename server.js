'use strict'

require('dotenv').config()
const express     = require('express')
const bodyParser  = require('body-parser')
const expect      = require('chai').expect
const cors        = require('cors')
const mongoose    = require('mongoose')
mongoose.set('useFindAndModify', false)
const helmet      = require('helmet')

const apiRoutes         = require('./routes/api.js')
const fccTestingRoutes  = require('./routes/fcctesting.js')
const runner            = require('./test-runner')

const app = express();

app.use(helmet.frameguard({ action: 'sameorigin' }))
app.use(helmet.dnsPrefetchControl())
app.use(helmet.referrerPolicy({ policy: 'same-origin' }))

app.use('/public', express.static(process.cwd() + '/public'))

app.use(cors({origin: '*'})) //For FCC testing purposes only

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
//mongoose.connect('mongodb://localhost/anon_board', { useUnifiedTopology: true, useNewUrlParser: true }) 

//Test connection
mongoose.connection.once('open', () => {
  console.log("Connected to database!")
})

//Sample front-end
app.route('/b/:board/')
  .get((req, res) => {
    res.sendFile(process.cwd() + '/views/board.html')
  })
app.route('/b/:board/:threadid')
  .get((req, res) => {
    res.sendFile(process.cwd() + '/views/thread.html')
  })

//Index page (static HTML)
app.route('/')
  .get((req, res) => {
    res.sendFile(process.cwd() + '/views/index.html')
  })

//For FCC testing purposes
fccTestingRoutes(app)

//Routing for API 
apiRoutes(app)

//Sample Front-end

    
//404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404)
    .type('text')
    .send('Not Found')
})

//Start our server and tests!
app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port " + process.env.PORT)
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...')
    setTimeout(() => {
      try {
        runner.run()
      } catch(e) {
        var error = e
          console.log('Tests are not valid:')
          console.log(error)
      }
    }, 1500)
  }
})

module.exports = app //for testing
