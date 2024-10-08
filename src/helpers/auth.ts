const scope =
  'playlist-read-private user-library-modify user-top-read playlist-modify-public playlist-modify-private user-read-private user-read-email';
const spotify_client_id = process.env.SPOTIFY_CLIENT_ID as string;
const spotify_client_secret = process.env.SPOTIFY_SECRET_KEY as string;
const spotify_redirect_uri = 'bpm://callback';
export function generateSpotifyAuthUri(): string {
  const state = generateRandomString(16);
  const auth_query_paramaters = new URLSearchParams({
    response_type: 'code',
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: spotify_redirect_uri,
    state: state,
  });
  return `${process.env.SPOTIFY_AUTH_URL}?${auth_query_paramaters}`;
}

var generateRandomString = function (length: number) {
  var text = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export function getCodeFromUri(redirect_uri: string) {
  if (!redirect_uri.includes('?')) {
    return undefined;
  }
  const querysString = redirect_uri.slice(redirect_uri.indexOf('?') + 1);
  const queryItem = querysString.split('&');
  let queryParamObj: any = {};
  queryItem.forEach(query => {
    const keyValueArr = query.split('=');
    queryParamObj[keyValueArr[0]] = keyValueArr[1];
  });
  return queryParamObj;
}

const authBuffer = Buffer.from(
  spotify_client_id + ':' + spotify_client_secret,
).toString('base64');
export async function getSpotifyTokensFromCode(code: string) {
  const details: any = {
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: spotify_redirect_uri,
  };

  let formBody: string[] = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + '=' + encodedValue);
  }
  const formBodyString = formBody.join('&');

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + authBuffer,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBodyString,
    });
    return await response.json();
  } catch (err) {
    console.error('err: ', err);
  }
}

export async function refreshSpotifyAccessToken(refreshToken: string) {
  const details: any = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: spotify_client_id,
  };
  console.log('auth: ', authBuffer);
  let formBody: string[] = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + '=' + encodedValue);
  }
  const formBodyString = formBody.join('&');

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + authBuffer,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBodyString,
    });
    return await response.json();
  } catch (err) {
    console.error('err: ', err);
  }
}
