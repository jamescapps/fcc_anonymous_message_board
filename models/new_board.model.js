const mongoose = require('mongoose')
const Schema = mongoose.Schema

const boardSchema = new Schema (
    {
        board: String,
        thread:[
            {
                text: String,
                created_on: {type: Date, default: Date.now},
                bumped_on: {type: Date, default: Date.now},
                reported: {type: Boolean, default: false},
                delete_password: String,
                replies:[
                    {
                        text: String,
                        delete_password: String,
                        created_on: {type: Date, default: Date.now},
                        reported: {type: Boolean, default: false},
                    }
                ]
            }
            
        ]
    }
)

const Board = mongoose.model('Board', boardSchema)

module.exports = Board