import got from 'got'
import jsdom from 'jsdom'

const { JSDOM } = jsdom

export const scrapTrackLinkHtml = async (url) => {
    try {
        const response = await got(encodeURI(url))
        if (!response) {
            return ''
        }

        const dom = new JSDOM(response.body)
        if (!dom) {
            return ''
        }

        const nodeList = [...dom.window.document.querySelectorAll('a[data-youtube-url]')];
        if (!nodeList.length) {
            return ''
        }

        return nodeList[0].getAttribute('data-youtube-url') || ''
    } catch (error) {
        console.log('scraphtmlerr', error)
    }
}