const http = require('http')
const FormData = require('form-data')
const toStream = require('buffer-to-stream')
const SUPPORT_TYPE = [
    'application/json',
    'application/octet-stream',
    'multipart/form-data',
    'text/plain',
]

const dealRequest = {
    'application/json': (req, body) => {
        req.write(JSON.stringify(body))
    },
    'application/octet-stream': (req, body) => {
        if (typeof body === 'string') {
            return toStream(body)
        }
        toStream(Buffer.from(body)).pipe(req)
    },
    'multipart/form-data': (req, body) => {
        let form = new FormData()
        for (let key in body) {
            form.append(key, body[key])
        }
        form.pipe(req)
    },
    'text/plain': (req, body) => {
        req.write(body.toString())
    }
}

const getResponse = (res) => {
    
}

const fetch = async (socketPath, request) => {
    if (typeof url !== 'string') {
        throw new TypeError('url should be typeof string.')
    }

    const {
        method, path, headers, body, contentType
    } = request

    if (typeof contentType !== 'string') {
        throw new TypeError('request.contentType should be typeof string.')
    }

    contentType = contentType ? contentType : SUPPORT_TYPE[0]
    if (!SUPPORT_TYPE.includes(contentType)) {
        throw new TypeError('request.contentType not supported.')
    }

    return new Promise((resolve, reject) => {
        const req = http.request({
            socketPath,
            method, path, headers
        }, resolve(getResponse(res)))

        req.on('error', reject)
        dealRequest[contentType](req, body)
    })
}