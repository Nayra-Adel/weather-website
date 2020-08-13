const path    = require('path')
const express = require('express')
const hbs     = require('hbs')
const geocode = require('./utils/geocode')
const forcast = require('./utils/forcast')

const app     = express()

// Define paths for Express Config
const publicDirPath = path.join(__dirname, '../public')
const viewPath      = path.join(__dirname, '../templates/views')
const partialPath   = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialPath)

// Setup static directory to serve
app.use(express.static(publicDirPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Nayra Adel'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Nayra Adel'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Nayra Adel'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'You must provide an address.'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if(error) {
            return res.send( {error} )
        }

        forcast(latitude, longitude, (error, forcastData) => {
            if(error) {
                return res.send( {error} )
            }

            res.send({
                forecast: forcastData,
                location,      
                address: req.query.address  
            })
        })
    })
})

app.get('/products', (req, res) => {
    if(!req.query.search) {
        return res.send({
            error: 'You must provide a search term.'
        })
    }

    res.send({
        products: []      
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        errorMsg: 'Help artical not found!',
        title: '404',
        name: 'Nayra Adel'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        errorMsg: 'Oops, looks like the page is lost.',
        title: '404',
        name: 'Nayra Adel'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})