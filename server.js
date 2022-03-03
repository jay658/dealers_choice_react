const Sequelize = require ("sequelize")
const db = new Sequelize(process.env.DATABASEURL || "postgres://localhost/dealers_choice_react")
const express = require('express')
const app = express()
const path = require('path')

const Game = db.define("game", {
    name:{
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },

    genre:{
        type: Sequelize.ENUM('rpg', 'rts', 'moba', 'fps'),
        allowNull:false,
        validate:{
            notEmpty:true
        }
    }
})

app.use(express.json())

app.get('/', (req, res)=>res.sendFile(path.join(__dirname, 'index.html')))

app.post('/api/games', async(req, res, next)=>{
    try{
        console.log(`here is the req.body: ${req.body}`)
        const game = await Game.create({name:req.body.name, genre:req.body.genre})
        res.send(await Game.findAll())
    }catch(ex){
        next(ex)
    }
})

app.delete('/api/games/:id', async(req, res, next)=>{
    try{
        const game = await Game.findByPk(req.params.id)
        await game.destroy()
        res.sendStatus(204)
    }catch(err){
        next(err)
    }
})

app.get('/api/games/:id', async(req, res, next)=>{
    try{
        const game = await Game.findByPk(req.params.id)
        res.send(game)
    }catch(err){
        next(err)
    }
})

app.get('/api/games', async(req, res, next)=>{
    try{
        const games = await Game.findAll()
        res.send(games)
    }catch(err){
        next(err)
    }
})

const init = async()=>{
    await db.sync({force:true})
    await Game.create({name:'diablo', genre: "rpg"})
    await Game.create({name:'world of warcraft', genre: "rpg"})
    await Game.create({name:'command & conquer', genre: "rts"})
    await Game.create({name:'starcraft', genre: "rts"})
    await Game.create({name:'league of legends', genre: "moba"})
    await Game.create({name:'dota', genre: "moba"})
    await Game.create({name:'call of duty', genre: "fps"})
    await Game.create({name:'counter strike', genre: "fps"})
    const port = process.env.PORT || 3000
    app.listen(port, ()=>{
        console.log(`listening on port ${port}`)
    })
}

init()