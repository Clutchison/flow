import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';
import { YOUTUBE_CREDS } from '../config/.secrets';


// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
  process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'youtube-nodejs-quickstart.json';

const OAuth2 = google.auth.OAuth2;

export const getVideo = id => {
  authorize(fetchVideo, id);
}

export const searchForVideo = () => {
  authorize(searchVideo);
}

export const getChannel = () => {
  authorize(fetchChannel);
}

const searchVideo = (auth) => {
  const service = google.youtube({
    version: 'v3',
    auth: auth,
  });
  service.search.list({
    part: ['id, snippet'],
    maxResults: 1,
    q: 'Never gonna give you up'
  }).then(results => {
    console.log(JSON.stringify(results, null, 2));
  }).catch(err => {
    console.log(err);
  })
};
// dQw4w9WgXcQ
const fetchVideo = (auth, id) => {
  const service = google.youtube({
    version: 'v3',
    auth: auth,
  });
  service.videos.list({
    part: ['player'],
    id: [id]
  })
  .then(results => console.log(JSON.stringify(results, null, 2)))
  .catch(err => console.log(err));
}

function authorize(callback, ...args) {
  const credentials = YOUTUBE_CREDS;
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, 'utf-8', function (err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client, ...args);
    }
  });
}

function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function (code) {
    rl.close();
    oauth2Client.getToken(code, function (err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log('Token stored to ' + TOKEN_PATH);
  });
}

const fetchChannel = (auth) => {
  var service = google.youtube('v3');
  service.channels.list({
    auth: auth,
    part: ['snippet', 'contentDetails', 'statistics'],
    forUsername: 'GoogleDevelopers'
  }, (err, response) => {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var channels = response.data.items;
    if (channels.length == 0) {
      console.log('No channel found.');
    } else {
      console.log('This channel\'s ID is %s. Its title is \'%s\', and ' +
        'it has %s views.',
        channels[0].id,
        channels[0].snippet.title,
        channels[0].statistics.viewCount);
    }
  });
}
