const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('./config')
const attractions = require('./attractions')

const app = express()

app.use(express.static('public'))
app.use(cors())

app.get('/', (req, res) => {
  const help = `
  <pre>
    Guida alle API!

    Usare un Authorization header per lavorare con i dati:

    API disponibili:

    GET /attractions
    DELETE /attractions/:id
    POST /attractions { name, email, avatarURL }
  </pre>
  `

  res.send(help)
})

app.use((req, res, next) => {
  const token = req.get('Authorization')

  if (token) {
    req.token = token
    next()
  } else {
    res.status(403).send({
      error: 'Per favore fornisci Authorization header'
    })
  }
})

app.get('/attractions', (req, res) => {
  res.send(attractions.get(req.token))
})

app.delete('/attractions/:id', (req, res) => {
  //console.log(req.token)
  //console.log(req.params.id)
  res.send(attractions.remove(req.token, req.params.id))
})

app.post('/attractions', bodyParser.json(), (req, res) => {
  const { name, type } = req.body

  if (name && type) {
    res.send(attractions.add(req.token, req.body))
  } else {
    res.status(403).send({
      error: 'Per favore fornisci tutti i dati del posto'
    })
  }
})


app.listen(config.port, () => {
  console.log('Server listening on port %s, Ctrl+C to stop', config.port)
})
