import request from 'request';
import querystring from 'querystring';
import { Router } from 'express'
import { add_tokens, update_tokens } from '../db/index.mjs';
import axios from 'axios';
export const router = Router();
const redirect_uri = 'http://localhost:8085/spotify/callback'
const client_id = process.env.SPOTIFY_ID
const client_secret = process.env.SPOTIFY_SECRET


const getRedirect = async () => {
    var my_ip = await axios.get('https://checkip.amazonaws.com')
    my_ip = my_ip.data
    return my_ip + ':8085/spotify/callbac'
}
router.get('/spotify/sub/:channel_id', async (req, res) => {

    var state = req.params.channel_id
    var scope = 'playlist-modify-private playlist-modify-public playlist-read-private, user-modify-playback-state user-read-playback-state';
    // var my_ip = await axios.get('checkip.amazonaws.com')
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: process.env.SPOTIFY_ID,
            scope: scope,
            redirect_uri: await getRedirect(),
            state: state
        }))
});


router.get('/spotify/callback', async (req, res) => {
    try {
        var code = req.query.code || null;
        var state = req.query.state || null;

        if (state === null || code === null) {
            console.log("state and/or code is null")
        } else {
            var authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                form: {
                    code: code,
                    redirect_uri: await getRedirect(),
                    grant_type: 'authorization_code'
                },
                headers: {
                    'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
                },
                json: true
            };
            request.post(authOptions, async (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    var access_token = body.access_token,
                        refresh_token = body.refresh_token,
                        expires_in = body.expires_in;
                    res.send(await add_tokens(access_token, refresh_token, expires_in, 'spotify', state))
                } else {
                    if (typeof err != "undefined") {
                        console.log(err.stack)
                    } else {
                        console.log(response.statusCode)
                    }
                }
            });
        }
    } catch (err) {
        console.log(err.stack)
    }
})

export const refresh_function = async (refresh_token) => {
    try {
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                refresh_token: refresh_token,
                grant_type: 'refresh_token'
            },
            headers: {
                'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            json: true
        };
        var respon = await axios.post(authOptions.url, querystring.stringify(authOptions.form), {headers: authOptions.headers})
        var body = respon.data
        var access_token = body.access_token;
        refresh_token = body.refresh_token || refresh_token;
        var expires_at = Math.round(((new Date()).getTime()) / 1000) + body.expires_in - 2
        await update_tokens(access_token, refresh_token, expires_at)
        return true

    } catch (err) {
        console.log(err.stack)
        return false
    }
}