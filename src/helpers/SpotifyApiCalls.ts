import {TrackObject} from '../Types';

export async function GetSpotifyPlaylistsIds(
  accessToken: string,
  limit = 30,
  offset = 0,
) {
  const url = 'https://api.spotify.com/v1/me/playlists';
  const queryProps = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });
  try {
    const response = await fetch(`${url}?${queryProps}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      //   console.log(response);
      const responseObj = await response.json();
      return responseObj.items.map((item: {id: string}) => item.id) as string[];
    }
  } catch (error) {
    console.error(error);
  }
  return undefined;
}

export async function GetSpotifyFavoriteSongs(
  accessToken: string,
  limit = 30,
  offset = 0,
) {
  const url = 'https://api.spotify.com/v1/me/tracks';
  const queryProps = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });
  try {
    const response = await fetch(`${url}?${queryProps}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      // console.log(response);
      return await response.json();
    }
  } catch (error) {
    console.error(error);
  }
  return undefined;
}

export async function getSpotifyPlaylistTrackIds(
  accessToken: string,
  playlistId: string,
  limit = 30,
  offset = 0,
) {
  const url = 'https://api.spotify.com/v1/playlists';
  const queryProps = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });
  try {
    const response = await fetch(`${url}/${playlistId}/tracks?${queryProps}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      const responseObj = await response.json();
      return responseObj.items.map(
        (item: {track: {id: string}}) => item.track.id,
      );
    }
  } catch (error) {
    console.error(error);
  }
  return undefined;
}

export async function getTrackBPM(accessToken: string, id: string) {
  const url = 'https://api.spotify.com/v1/audio-features';
  try {
    const response = await fetch(`${url}/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      return (await response.json()).tempo;
    }
  } catch (error) {
    console.error(error);
  }
  return undefined;
}

type artist = {
  name: string;
  id: string;
};
export async function getSpotifyTrackInfo(
  trackId: string,
  accessToken: string,
) {
  const url = 'https://api.spotify.com/v1/tracks';
  try {
    const response = await fetch(`${url}/${trackId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      const responseObj = await response.json();
      const tempArtistsObj: string[] = responseObj.artists.map(
        (artist: artist) => artist.name,
      );
      return {
        id: responseObj.id,
        name: responseObj.name,
        thumbnail: responseObj.album.images[0].url,
        artistNames: tempArtistsObj,
      } as Omit<TrackObject, 'bpm'>;
    }
  } catch (error) {
    console.error(error);
  }
  return undefined;
}

export async function getCurrentUserId(accessToken: string) {
  const url = 'https://api.spotify.com/v1/me';
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      const responseObj = await response.json();
      const userId: string = responseObj.id;
      return userId;
    }
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export async function createPlaylist(accessToken: string, userId: string) {
  const url = `https://api.spotify.com/v1/users/${userId}/playlists`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'New Playlist',
        description: 'New playlist description',
        public: false,
      }),
    });
    if (response.ok) {
      const responseObj = await response.json();
      return {
        id: responseObj.id,
        name: responseObj.name,
        uri: responseObj.uri,
      } as {
        name: string;
        id: string;
        uri: string;
      };
    }
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export async function addItemsToPlaylist(
  accessToken: string,
  playlistId: string,
  uris: string[],
) {
  const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  const queryProps = new URLSearchParams({
    uris: uris.join(','),
  });
  try {
    const response = await fetch(`${url}?${queryProps}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uris: ['string'],
        position: 0,
      }),
    });
    if (response.ok) {
      const responseObj = await response.json();
      return responseObj;
    } else {
      console.error('add item to playlist: ', await response.json());
    }
    return response.status;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
