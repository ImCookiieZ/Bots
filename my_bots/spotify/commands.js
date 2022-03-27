import SpotifyClient from 'spotify-web-api-node'
import { get_access_token, get_refresh_token } from '../db/index.mjs'
import { refresh_function } from './index.mjs'

export const getClient = async (channel_name) => {
    try {
        var client = new SpotifyClient({
            clientId: process.env.SPOTIFY_ID,
            clientSecret: process.env.SPOTIFY_SECRET,
            redirectUri: 'http://localhost:8085/spotify/callback'
        })
        var refresh_token = await get_refresh_token('spotify', channel_name)
        await refresh_function(refresh_token)
        var access_token = await get_access_token('spotify', channel_name)
        client.setAccessToken(access_token)
        return client
    } catch (err) {
        console.log(err.stack)
    }
}


export const addSongToQueue = async (channel, song_link) => {
    try {
        var client = await getClient(channel)
            var prefix = "https://open.spotify.com/track/"
            var end = song_link.indexOf('?')
            var track_uri = "spotify:track:"
            var track_id = ""
            var trackinfo = null
            if (end != -1)
                track_id = song_link.substring(song_link.indexOf(prefix) + prefix.length, end)
            else
                track_id = song_link.substring(song_link.indexOf(prefix) + prefix.length)
            track_uri += track_id
            try {
                await client.addToQueue([track_uri])
                trackinfo = await client.getTrack(track_id)
            } catch (err) {
                // console.log(typeof(err.body.error.message))
                if (err.body.error.message.startsWith('Invalid track uri:'))
                    return "Invalid songlink"
                console.log(err)
                return err.body.error.message
            }
            var artists = "'" + trackinfo.body.artists[0].name + "'"
            for (var i = 1; i < trackinfo.body.artists.length; i ++) {   
                if (i === trackinfo.body.artists.length - 1) { 
                    artists += " and '" + trackinfo.body.artists[i].name + "'"
                } else {
                    artists += ", '" + trackinfo.body.artists[i].name + "'"
                }
            }
            return `'${trackinfo.body.name}' by ${artists} added to queue`
    } catch (err) {
        console.log(err.stack)
        return "An error accured :O"
    }
}

export const skipSong = async (channel) => {
    try {
        var client = await getClient(channel)
        try {
        await client.skipToNext()
        return "skipped song"
        } catch (err) {
            if (err.body.error.message.startsWith('Invalid track uri:'))
                    return "Invalid songlink"
                console.log(err)
                return err.body.error.message
        }
    } catch (err) {
        console.log(err.stack)
        return "An error accured :O"
    }
}