const request = require('request')
const rp = require('request-promise')

const geocode = (address, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + address + '.json?access_token='+process.env.MAPBOX_ACCESS_TOKEN+''

    request({
        url,
        json: true
    }, (error, {
        body
    }) => {
        if (error) {
            callback('Unable to connect to location services!', undefined)
        } else if (body.features.length === 0) {
            callback('Unable to find location. Try another search.', undefined)
        } else {
            callback(undefined, {
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0],
                location: body.features[0].place_name
            })
        }
    })
}

const geocode2 = async (address) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + address + '.json?access_token='+process.env.MAPBOX_ACCESS_TOKEN+''

    const options = {
        method: `GET`,
        json: true,
        uri: url
    }

    try {
        const response = await rp(options)
        return Promise.resolve({
            latitude: response.features[0].center[1],
            longitude: response.features[0].center[0],
            location: response.features[0].place_name
        })
    } catch (error) {
        Promise.reject(error)
    }
}

module.exports = {
    geocode,
    geocode2
}