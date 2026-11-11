const clone = require('clone')
const config = require('./config')

const db = {}


const defaultData = {
   attractions : [
    {
        id: 1,
        name: 'Museo del cinema di Torino',
        type: 'Museo',
        latitude: 45.0693174,
        longitude: 7.69304484,
        address: 'Via Montebello, 20 10124 Torino',
        phone: '+390118138511',
        img: config.origin + '/1.jpg'
    },
    {
        id: 2,
        name: 'Basilica di Superga',
        type: 'Costruzione storica',
        latitude: 45.070982,
        longitude: 7.685676,
        address: 'Strada Basilica di Superga, 73, 10132 Torino',
        phone: '+390118997456',
        img: config.origin + '/2.jpg'
    },
    {
        id: 3,
        name: 'Mole Antonelliana',
        type: 'Costruzione storica',
        latitude: 45.0690246,
        longitude: 7.6932346,
        address: 'Via Montebello, 10124 Torino',
        phone: '+390118138511',
        img: config.origin + '/3.jpg'
    },
    {
        id: 4,
        name: 'Piazza Castello',
        type: 'Piazza',
        latitude: 45.070982,
        longitude: 7.685676,
        address: 'Piazza Castello - 10122 Torino',
        phone: '',
        img: config.origin + '/4.jpg'
    },
    {
        id: 5,
        name: 'Planetario di Torino',
        type: 'Planetario',
        latitude: 45.039719,
        longitude: 7.761858,
        address: 'Via Osservatorio, 30 - 10025 Pino Torinese TO',
        phone: '+390118118740',
        img: config.origin + '/5.jpg'
    },
    {
        id: 6,
        name: 'Palazzo Madama',
        type: 'Costruzione storica',
        latitude: 45.070982,
        longitude: 7.685676,
        address: 'Piazza Castello - 10122 Torino',
        phone: '',
        img: config.origin + '/6.jpg'
    },
    {
        id: 7,
        name: 'Piazza Vittorio Veneto',
        type: 'Piazza',
        latitude: 45.064258,
        longitude: 7.696276,
        address: 'Piazza Vittorio Veneto - 10123 Torino',
        phone: '',
        img: config.origin + '/7.jpg'
    },
    {
        id: 8,
        name: 'Museo Egizio',
        type: 'Museo',
        latitude: 45.06843,
        longitude: 7.684304,
        address: 'Via Accademia delle Scienze, 6 - 10123 Torino',
        phone: '+390115617776',
        img: config.origin + '/8.jpg'
    },
    {
        id: 9,
        name: 'Reggia di Venaria',
        type: 'Costruzione Storica',
        latitude: 45.135972,
        longitude: 7.623365,
        address: 'Piazza della Repubblica, 4 - 10078 Venaria Reale TO',
        phone: '+390114992333',
        img: config.origin + '/9.jpg'
    },
    {
        id: 10,
        name: 'Borgo Medievale',
        type: 'Borgo',
        latitude: 45.049045,
        longitude: 7.685201,
        address: 'Viale Virgilio, 107 - 10126 Torino',
        phone: '+390114431701',
        img: config.origin + '/10.jpg'
    }
]

}

const get = (token) => {
  let data = db[token]

  if (data == null) {
    data = db[token] = clone(defaultData)
  }

  return data
}

const add = (token, attraction) => {
  if (!attraction.id) {
    attraction.id = Math.random().toString(36).substr(-8)
  }

  get(token).attractions.push(attraction)

  return attraction
}

const remove = (token, id) => {
  const data = get(token)
  const attraction = data.attractions.find(c => c.id === id)

  if (attraction) {
    data.attractions = data.attractions.filter(c => c !== attraction)
  }

  return { attraction }
}

module.exports = {
  get,
  add,
  remove
}
