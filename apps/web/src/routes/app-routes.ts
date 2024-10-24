export const APP_ROUTE = {
    DASHBOARD: '/dashboard',
    DASHBOARD_ALBUMS: '/dashboard/:libraryId/albums',
    DASHBOARD_ALBUMS_DETAIL: '/dashboard/:libraryId/albums/:albumId',
    DASHBOARD_ALBUM_ARTISTS: '/dashboard/:libraryId/album-artists',
    DASHBOARD_ALBUM_ARTISTS_DETAIL: '/dashboard/:libraryId/album-artists/:albumArtistId',
    DASHBOARD_ALBUM_DETAIL: '/dashboard/:libraryId/albums/:albumId',
    DASHBOARD_ARTISTS: '/dashboard/:libraryId/artists',
    DASHBOARD_ARTISTS_DETAIL: '/dashboard/:libraryId/artists/:artistId',
    DASHBOARD_HOME: '/dashboard/:libraryId/home',
    DASHBOARD_LIBRARY: '/dashboard/:libraryId',
    DASHBOARD_LIBRARY_ADD: '/dashboard/library/add',
    DASHBOARD_LIBRARY_AUTH: '/dashboard/library/:libraryId/auth',
    DASHBOARD_LIBRARY_EDIT: '/dashboard/library/:libraryId/edit',
    DASHBOARD_LIBRARY_SELECT: '/dashboard/library',
    DASHBOARD_PLAYLISTS: '/dashboard/:libraryId/playlists',
    DASHBOARD_PLAYLISTS_DETAIL: '/dashboard/:libraryId/playlists/:playlistId',
    DASHBOARD_TRACKS: '/dashboard/:libraryId/tracks',
    DASHBOARD_TRACKS_DETAIL: '/dashboard/:libraryId/tracks/:trackId',
    NOW_PLAYING: '/dashboard/:libraryId/now-playing',
    SEARCH: '/dashboard/:libraryId/search',
    SIGN_IN: '/',
    SIGN_UP: '/sign-up',
};
