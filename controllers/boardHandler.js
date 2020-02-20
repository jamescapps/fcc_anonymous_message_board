const Board = require('../models/new_board.model')

class BoardHandler {
    constructor() {
       
        this.postThread = (req, res) => {
            const { board } = req.params
            const { text, delete_password } = req.body
            const newBoard = new Board ({
                    board: board,
                    thread:[{text: text, created_on: Date.now(), bumped_on: Date.now(), reported: false, delete_password: delete_password}]
            })

            Board.findOneAndUpdate({board: board}, {$push: {thread: newBoard.thread}}, (err, result) => {
                if (err) {
                    res.send(err)
                } else if (!result) {
                    newBoard.save()
                    res.redirect('/b/' + board + '/')
                } else {
                    res.redirect('/b/' + board + '/')
                }
            }) 
        }

       this.replyThread = (req, res) => {
            const { board } = req.params
            const { thread_id, text, delete_password } = req.body
            const reply = {text: text, delete_password: delete_password, created_on: Date.now()}
 
           Board.find({"thread._id": thread_id}, (err, result) => {
                result[0].thread.forEach((item) => {
                    if (item._id == thread_id) {
                        item.replies.push(reply)
                        item.bumped_on = Date.now()
                        result[0].save()
                        res.redirect('/b/' + board + '/' + thread_id + '/')
                    } 
                })
            })
        }

        this.recentlyBumped = (req, res) => {
            const { board } = req.params
            const data = []

            Board.find({"board": board}, (err, result) => {
                if (result.length < 1) {
                    res.send('incorrect input')
                    return
                } else {
                    const sortedThreads = (result[0].thread).sort((a, b) => b.bumped_on - a.bumped_on)
                
                if (sortedThreads.length > 10) {
                    sortedThreads.length = 10
                }
                sortedThreads.forEach((item) => {
                    item.replies.reverse()
                    if (item.replies.length > 3) {
                        item.replies.length = 3 
                    }
                    item.reported = undefined
                    item.delete_password = undefined

                    item.replies.forEach((x) => {
                        x.reported = undefined
                        x.delete_password = undefined
                    })
                    data.push(item)
                })
                res.json(data)
                } 
            })
        }

        this.getThread = (req, res) => {
            const { thread_id } = req.query

            Board.find({"thread._id": thread_id}, (err, result) => {
                if (!result) {
                    res.send('incorrect input')
                } else {
                    result[0].thread.forEach((item) => {
                        item.reported = undefined
                        item.delete_password = undefined
    
                        item.replies.forEach((x) => {
                            x.reported = undefined
                            x.delete_password = undefined
                        })
                    })
                    res.send(result)
                    return
                }
            })
 
        }

        this.deleteThread = (req, res) => {
            const { board } = req.params
            const { thread_id, delete_password } = req.body
            let deleteResult = ''

            Board.find({"board": board}, (err, result) => {
                if (result.length < 1) {
                    res.send('no board found')
                    return
                }
                result[0].thread.forEach((item) => {
                    if (item._id == thread_id) {
                        if (item.delete_password === delete_password) {
                            deleteResult = 'success'
                        } else {
                            deleteResult = 'incorrect password'
                        }
                    }
                })
                if (deleteResult === 'success') {
                    Board.updateOne({"board": board}, {$pull: {"thread": {"_id": thread_id}}}, (err, result) => {
                        if (err) {
                            res.send(err)
                        }
                    }) 
                }
                if (deleteResult === '') {
                    deleteResult = 'incorrect id'
                }
                res.send(deleteResult)
            })
        }

        this.deleteReply = (req, res) => {
            const { board } = req.params
            const { thread_id, reply_id, delete_password } = req.body
            let deleteResult = ''
            Board.find({"board": board}, (err, result) => {
                if (result.length < 1) {
                    res.send('no board found')
                    return
                }
                result[0].thread.forEach((item) => {
                    if (item._id == thread_id) {
                        item.replies.forEach((x) => {
                            if (x._id == reply_id) {
                                if (x.delete_password === delete_password) {
                                    deleteResult = 'success'
                                     x.text = '[deleted]'
                                    result[0].save()
                                } else {
                                    deleteResult = 'incorrect password'
                                }
                            }
                            if (deleteResult === '') {
                                deleteResult = 'incorrect reply id'
                            }
                        })
                    } else {
                        deleteResult = 'incorrect thread id'
                    }
                })
               res.send(deleteResult)
            })
        }

        this.reportThread = (req, res) => {
            const { board } = req.params
            const { thread_id } = req.body
            let reportResult = ''

            Board.find({"board": board}, (err, result) => {
                if (result.length < 1) {
                    res.send('no board found')
                    return
                }
                result[0].thread.forEach((item) => {
                    if (item._id == thread_id) {
                        item.reported = true
                        result[0].save()
                        reportResult = 'success'
                    }
                    if (reportResult === '') {
                        reportResult = 'incorrect thread id'
                    }
                })
                res.send(reportResult)
            })
        }

        this.reportReply = (req, res) => {
            const { board } = req.params
            const { thread_id, reply_id } = req.body
            let reportResult = ''

            Board.find({"board": board}, (err, result) => {
                if (result.length < 1) {
                    res.send('no board found')
                    return
                }
                result[0].thread.forEach((item) => {
                    if (item._id == thread_id) {
                        item.replies.forEach((x) => {
                            if (x._id == reply_id) {
                                reportResult = 'success'
                                x.reported = true
                                result[0].save()
                            }
                            if (reportResult === '') {
                                reportResult = 'incorrect reply id'
                            }
                        })
                    }
                    if (reportResult === '') {
                        reportResult = 'incorrect thread id'
                    }
                })
                res.send(reportResult)
            })
        }
    }
}

module.exports = BoardHandler