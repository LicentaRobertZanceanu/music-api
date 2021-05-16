import request from "request"

export const callApi = (options) => {
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) {
                reject({
                    statusCode: 500,
                    body: {
                        message: "Internal server error!"
                    }
                })
                return
            }
            if (!response) {
                reject({
                    statusCode: 400,
                    body: { message: 'No response' },
                })
                return
            }
            let responseBody = body

            if (!responseBody) {
                resolve(null)
                return
            }

            if (typeof body === 'string') {
                responseBody = JSON.parse(body)
            }
            if (response.statusCode >= 400) {
                reject({
                    statusCode: response.statusCode,
                    body: responseBody,
                })
                return
            }
            resolve(responseBody)
            return
        })
    })
}