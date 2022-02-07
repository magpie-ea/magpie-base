import fetch from "node-fetch";
import FormData from "form-data";

exports.magpieConfig = {
    serverUrl: typeof process.env.MAGPIE_BACKEND_HOST !== 'undefined'? 'http://'+process.env.MAGPIE_BACKEND_HOST+'/' : 'https://magpie-refactored-2.herokuapp.com/',
    socketUrl: typeof process.env.MAGPIE_BACKEND_HOST !== 'undefined'? 'ws://'+process.env.MAGPIE_BACKEND_HOST+'/socket' : 'wss://magpie-refactored-2.herokuapp.com/socket',
    contactEmail: 'test@random.com'
}

exports.createInteractiveExperiment = async (players = 1) => {
    let res = await fetch('http://' + process.env.MAGPIE_BACKEND_HOST + '/experiments/new')
    const text = await res.text()
    const match = text.match(/<input name="_csrf_token" type="hidden" value="(.*?)">/)
    const csrfToken = match[1]
    const cookie = res.headers.get('Set-Cookie').split(';')[0]
    const body = new FormData()
    body.append('_csrf_token', csrfToken)
    body.append('experiment[active]', 'true')
    body.append('experiment[name]', 'name')
    body.append('experiment[author]', 'author')
    body.append('experiment[is_interactive]', 'true')
    body.append('experiment[num_players]', ''+players)
    res = await fetch('http://' + process.env.MAGPIE_BACKEND_HOST + '/experiments', {
        method: 'POST',
        body,
        headers: {
            Cookie: cookie
        }
    })
    const experimentId = res.url.match(/\/experiments\/([0-9]+)\/edit/)[1]
    return experimentId
}
