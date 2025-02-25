import type { OpenSubsonicApiClient } from '@audioling/open-subsonic-api-client';
import { initOpenSubsonicApiClient } from '@audioling/open-subsonic-api-client';
import { AlbumListSortOptions, LibraryType } from '@repo/shared-types';
import axios from 'axios';
import dayjs from 'dayjs';
import md5 from 'md5';
import { adapterHelpers } from '@/adapters/adapter-helpers.js';
import { subsonicHelpers } from '@/adapters/subsonic/subsonic-adapter-helpers.js';
import type { AdapterAlbumListQuery } from '@/adapters/types/adapter-album-types.js';
import type {
    AdapterArtist,
    AdapterArtistListQuery,
} from '@/adapters/types/adapter-artist-types.js';
import type { AdapterGenre } from '@/adapters/types/adapter-genre-types.js';
import type {
    AdapterPlaylist,
    AdapterPlaylistListQuery,
    AdapterPlaylistTrack,
    AdapterPlaylistTrackListQuery,
} from '@/adapters/types/adapter-playlist-types.js';
import type { AdapterAuthenticationResponse } from '@/adapters/types/adapter-server-types.js';
import type { AdapterTrack, AdapterTrackListQuery } from '@/adapters/types/adapter-track-types.js';
import type { AdapterApi, AdapterAuthentication, RemoteAdapter } from '@/adapters/types/index.js';
import { CONSTANTS } from '@/constants.js';
import type { AppDatabase } from '@/database/init-database.js';
import type { DbLibrary } from '@/database/library-database.js';
import { writeLog } from '@/middlewares/logger-middleware.js';
import { utils } from '@/utils/index.js';
import { generateRandomString } from '@/utils/random-string.js';

export const initSubsonicAdapter: RemoteAdapter = (library: DbLibrary, db: AppDatabase) => {
    const username = library.scanUsername;
    const password = library.scanCredential;

    if (!username || !password) {
        const errMessage = `Credentials are missing: ${library.displayName || library.baseUrl}@${library.id}`;
        writeLog.error(errMessage);
        throw new Error(errMessage);
    }

    const splitCredentials = utils.delimiter.reverseCredential(password);
    const saltOrPassword = splitCredentials[0] as string;
    const token = splitCredentials[1] as string | undefined;

    const baseApiClientOptions = {
        baseUrl: library.baseUrl,
        clientName: CONSTANTS.APP_NAME,
        username: username,
    };

    let apiClient: OpenSubsonicApiClient;

    if (token) {
        apiClient = initOpenSubsonicApiClient({
            ...baseApiClientOptions,
            salt: saltOrPassword,
            token,
        });
    } else {
        apiClient = initOpenSubsonicApiClient({
            ...baseApiClientOptions,
            password: saltOrPassword,
        });
    }

    type AlbumSortType = Parameters<
        (typeof apiClient.getAlbumList2.os)['1']['get']
    >[0]['query']['type'];

    const adapter: AdapterApi = {
        _getCoverArtUrl: (args) => {
            const { id, size } = args;

            const credentialParams = token
                ? `t=${token}&s=${saltOrPassword}`
                : `p=${saltOrPassword}`;

            return (
                `${library.baseUrl}/rest/getCoverArt.view` +
                `?id=${id}` +
                `&${credentialParams}` +
                `&u=${username}` +
                '&v=1.16.1' +
                `&c=${CONSTANTS.APP_NAME}` +
                `&size=${size}`
            );
        },
        _getLibrary: () => library,
        _getStreamUrl: (args) => {
            const { id } = args;

            const credentialParams = token
                ? `t=${token}&s=${saltOrPassword}`
                : `p=${saltOrPassword}`;

            return (
                `${library.baseUrl}/rest/stream.view` +
                `?id=${id}` +
                `&${credentialParams}` +
                `&u=${username}` +
                '&v=1.16.1' +
                `&c=${CONSTANTS.APP_NAME}`
            );
        },
        _getType: () => LibraryType.SUBSONIC,
        addToPlaylist: async (request, fetchOptions) => {
            const { query, body } = request;

            const trackIds: string[] = [];
            const albumIds: string[] = [];

            for (const item of body.entry) {
                if (item.type === 'track') {
                    trackIds.push(item.id);
                } else if (item.type === 'album') {
                    albumIds.push(item.id);
                }
            }

            const albumPromises = [];

            for (const albumId of albumIds) {
                albumPromises.push(
                    apiClient.getAlbum.os['1'].get({ fetchOptions, query: { id: albumId } }),
                );
            }

            const albumResponses = await Promise.all(albumPromises);

            for (const albumResponse of albumResponses) {
                if (albumResponse.status === 200) {
                    const tracks = albumResponse.body['subsonic-response'].album.song;

                    tracks?.forEach((track) => {
                        trackIds.push(track.id);
                    });
                } else {
                    return [
                        {
                            code: albumResponse.status,
                            message: albumResponse.body as string,
                        },
                        null,
                    ];
                }
            }

            const result = await apiClient.updatePlaylist.os['1'].get({
                fetchOptions,
                query: {
                    playlistId: query.id,
                    songIdToAdd: trackIds,
                },
            });

            if (result.status !== 200) {
                writeLog.error(adapterHelpers.adapterErrorMessage(library, 'addToPlaylist'));
                return [
                    {
                        code: result.status,
                        message: result.body as string,
                    },
                    null,
                ];
            }

            return [null, null];
        },
        clearPlaylist: async (request, fetchOptions) => {
            const { query } = request;

            const result = await apiClient.updatePlaylist.os['1'].get({
                fetchOptions,
                query: {
                    playlistId: query.id,
                    songIdToRemove: [],
                },
            });

            if (result.status !== 200) {
                writeLog.error(adapterHelpers.adapterErrorMessage(library, 'clearPlaylist'));
                return [
                    {
                        code: result.status,
                        message: result.body as string,
                    },
                    null,
                ];
            }

            return [null, null];
        },
        createPlaylist: async (request, fetchOptions) => {
            const { body } = request;

            const result = await apiClient.createPlaylist.os['1'].get({
                fetchOptions,
                query: {
                    name: body.name,
                    songId: [],
                },
            });

            if (result.status !== 200) {
                writeLog.error(adapterHelpers.adapterErrorMessage(library, 'createPlaylist'));
                return [
                    {
                        code: result.status,
                        message: result.body as string,
                    },
                    null,
                ];
            }

            return [null, null];
        },
        deletePlaylist: async (request, fetchOptions) => {
            const { query } = request;

            await apiClient.deletePlaylist.os['1'].get({
                fetchOptions,
                query: {
                    id: query.id,
                },
            });

            return [null, null];
        },
        getAlbumArtistAlbumList: async (request, fetchOptions) => {
            const { query } = request;

            const result = await apiClient.getArtist.os['1'].get({
                fetchOptions,
                query: {
                    id: query.id,
                },
            });

            if (result.status !== 200) {
                writeLog.error(
                    adapterHelpers.adapterErrorMessage(library, 'getAlbumArtistAlbumList'),
                );
                return [
                    {
                        code: result.status,
                        message: result.body as string,
                    },
                    null,
                ];
            }

            const albums = (result.body['subsonic-response'].artist.album || []).map(
                subsonicHelpers.converter.albumToAdapter,
            );

            const sorted = adapterHelpers.sortBy.album(albums, query.sortBy, query.sortOrder);
            const paginated = adapterHelpers.paginate(sorted, query.offset, query.limit);

            return [
                null,
                {
                    items: paginated.items,
                    limit: paginated.limit,
                    offset: paginated.offset,
                    totalRecordCount: albums.length,
                },
            ];
        },
        getAlbumArtistDetail: async (request, fetchOptions) => {
            const { query } = request;

            const result = await apiClient.getArtist.os['1'].get({
                fetchOptions,
                query: {
                    id: query.id,
                },
            });

            if (result.status !== 200) {
                writeLog.error(adapterHelpers.adapterErrorMessage(library, 'getAlbumArtistDetail'));
                return [
                    {
                        code: result.status,
                        message: result.body as string,
                    },
                    null,
                ];
            }

            return [
                null,
                subsonicHelpers.converter.artistToAdapter(result.body['subsonic-response'].artist),
            ];
        },
        getAlbumArtistList: async (request, fetchOptions) => {
            const { query } = request;

            const clientParams = {
                fetchOptions,
                query: {
                    musicFolderId: query.folderId ? Number(query.folderId[0]) : undefined,
                    offset: query.offset,
                    size: query.limit,
                },
            };

            const result = await apiClient.getArtists.os['1'].get({
                ...clientParams,
            });

            if (result.status !== 200) {
                writeLog.error(adapterHelpers.adapterErrorMessage(library, 'getAlbumArtistList'));

                return [
                    {
                        code: result.status,
                        message: result.body as string,
                    },
                    null,
                ];
            }

            const artists = result.body['subsonic-response'].artists.index.flatMap((artist) => {
                return (artist.artist || []).map(subsonicHelpers.converter.artistToAdapter);
            });

            if (query.searchTerm) {
                const searchedItems = adapterHelpers.search(artists, query.searchTerm, ['name']);
                const sorted = adapterHelpers.sortBy.artist(
                    searchedItems,
                    query.sortBy,
                    query.sortOrder,
                );
                const paginated = adapterHelpers.paginate(sorted, query.offset, query.limit);

                return [
                    null,
                    {
                        items: paginated.items,
                        limit: paginated.limit,
                        offset: paginated.offset,
                        totalRecordCount: searchedItems.length,
                    },
                ];
            }

            const sorted = adapterHelpers.sortBy.artist(artists, query.sortBy, query.sortOrder);
            const paginated = adapterHelpers.paginate(sorted, query.offset, query.limit);

            return [
                null,
                {
                    items: paginated.items,
                    limit: paginated.limit,
                    offset: paginated.offset,
                    totalRecordCount: artists.length,
                },
            ];
        },
        getAlbumArtistListCount: async (request, fetchOptions) => {
            const { query } = request;

            const sanitizedQuery: Pick<AdapterArtistListQuery, 'folderId' | 'searchTerm'> = {
                folderId: query.folderId,
                searchTerm: query.searchTerm,
            };

            const totalRecordCountFromDb = adapterHelpers.db.getCountWithoutFetch(db, {
                libraryId: library.id,
                query: sanitizedQuery,
                type: 'artist',
            });

            if (totalRecordCountFromDb) {
                return [null, totalRecordCountFromDb];
            }

            const result = await apiClient.getArtists.os['1'].get({
                fetchOptions,
                query: {
                    musicFolderId: query.folderId ? Number(query.folderId[0]) : undefined,
                },
            });

            if (result.status !== 200) {
                writeLog.error(
                    adapterHelpers.adapterErrorMessage(library, 'getAlbumArtistListCount'),
                );
                return [{ code: result.status, message: result.body as string }, null];
            }

            const artistCount = result.body['subsonic-response'].artists.index.reduce(
                (acc, artist) => {
                    if (query.searchTerm) {
                        acc += (artist.artist || []).filter((artist) =>
                            artist.name.toLowerCase().includes(query.searchTerm!.toLowerCase()),
                        ).length;
                    } else {
                        acc += (artist.artist || []).length;
                    }

                    return acc;
                },
                0,
            );

            adapterHelpers.db.setCount(db, {
                count: artistCount,
                expiration: 1440,
                libraryId: library.id,
                query: sanitizedQuery,
                type: 'artist',
            });

            return [null, artistCount];
        },
        getAlbumArtistTrackList: async (request, fetchOptions) => {
            const { query } = request;

            const result = await apiClient.getArtist.os['1'].get({
                fetchOptions,
                query: {
                    id: query.id,
                },
            });

            if (result.status !== 200) {
                writeLog.error(
                    adapterHelpers.adapterErrorMessage(library, 'getAlbumArtistTrackList'),
                );
                return [{ code: result.status, message: result.body as string }, null];
            }

            const albumIds = (result.body['subsonic-response'].artist.album || []).map(
                (album) => album.id,
            );

            const albumPromises = albumIds.map((albumId) =>
                apiClient.getAlbum.os['1'].get({
                    fetchOptions,
                    query: { id: albumId },
                }),
            );

            const albumResponses = await Promise.all(albumPromises);

            if (albumResponses.some((album) => album.status !== 200)) {
                writeLog.error(
                    adapterHelpers.adapterErrorMessage(library, 'getAlbumArtistTrackList'),
                );
                return [{ code: 500, message: 'Failed to get album details' }, null];
            }

            type AlbumResponse = Extract<
                Awaited<ReturnType<(typeof apiClient.getAlbum.os)['1']['get']>>,
                { status: 200 }
            >['body'];

            const tracksResponse = albumResponses.flatMap(
                (album) => (album.body as AlbumResponse)['subsonic-response'].album.song || [],
            );

            const tracks = tracksResponse.map(subsonicHelpers.converter.trackToAdapter);
            const sorted = adapterHelpers.sortBy.track(tracks, query.sortBy, query.sortOrder);
            const paginated = adapterHelpers.paginate(sorted, query.offset, query.limit);

            return [
                null,
                {
                    items: paginated.items,
                    limit: paginated.limit,
                    offset: paginated.offset,
                    totalRecordCount: tracks.length,
                },
            ];
        },
        getAlbumDetail: async (request, fetchOptions) => {
            const { query } = request;

            const result = await apiClient.getAlbum.os['1'].get({
                fetchOptions,
                query: {
                    id: query.id,
                },
            });

            if (result.status !== 200) {
                writeLog.error(adapterHelpers.adapterErrorMessage(library, 'getAlbumDetail'));
                return [
                    {
                        code: result.status,
                        message: result.body as string,
                    },
                    null,
                ];
            }

            const album = subsonicHelpers.converter.albumToAdapter(
                result.body['subsonic-response'].album,
            );

            return [null, album];
        },
        getAlbumList: async (request, fetchOptions) => {
            const { query } = request;

            const [err, totalRecordCount] = await initSubsonicAdapter(
                library,
                db,
            ).getAlbumListCount({
                query,
            });

            if (err) {
                return [err, null];
            }

            if (query.searchTerm) {
                if (query.limit === -1) {
                    const fetcher = async (page: number, limit: number) => {
                        const result = await apiClient.search3.os['1'].get({
                            fetchOptions,
                            query: {
                                albumCount: limit,
                                albumOffset: page * limit,
                                artistCount: 0,
                                artistOffset: 0,
                                query: query.searchTerm,
                                songCount: 0,
                                songOffset: 0,
                            },
                        });

                        if (result.status !== 200) {
                            throw new Error(JSON.stringify(result.body));
                        }

                        return result.body['subsonic-response'].searchResult3.album || [];
                    };

                    const results = await adapterHelpers.fetchAllRecords(fetcher, query.limit);
                    const items = results.map(subsonicHelpers.converter.albumToAdapter);
                    const sorted = adapterHelpers.sortBy.album(
                        items,
                        query.sortBy,
                        query.sortOrder,
                    );
                    const paginated = adapterHelpers.paginate(sorted, query.offset, query.limit);

                    return [
                        null,
                        {
                            items: paginated.items,
                            limit: paginated.limit,
                            offset: paginated.offset,
                            totalRecordCount: results.length,
                        },
                    ];
                }

                const result = await apiClient.search3.os['1'].get({
                    fetchOptions,
                    query: {
                        albumCount: query.limit,
                        albumOffset: query.offset,
                        artistCount: 0,
                        artistOffset: 0,
                        query: query.searchTerm,
                        songCount: 0,
                        songOffset: 0,
                    },
                });

                if (result.status !== 200) {
                    writeLog.error(adapterHelpers.adapterErrorMessage(library, 'getAlbumList'));
                    return [{ code: result.status, message: result.body as string }, null];
                }

                const items = (result.body['subsonic-response'].searchResult3.album || []).map(
                    subsonicHelpers.converter.albumToAdapter,
                );

                return [
                    null,
                    {
                        items,
                        limit: query.limit,
                        offset: query.offset,
                        totalRecordCount,
                    },
                ];
            }

            let sortType: AlbumSortType = 'alphabeticalByName';

            let offset: number = query.offset;
            let reverseResult: boolean = false;
            let fromYear: number | undefined = undefined;
            let toYear: number | undefined = undefined;
            switch (query.sortBy) {
                case AlbumListSortOptions.ALBUM_ARTIST:
                    // Default is ascending
                    sortType = 'alphabeticalByArtist';

                    if (query.sortOrder === 'desc') {
                        offset = totalRecordCount - query.offset - query.limit;
                        reverseResult = true;
                    }

                    break;
                case AlbumListSortOptions.DATE_ADDED:
                    // Default is descending
                    sortType = 'newest';

                    if (query.sortOrder === 'desc') {
                        offset = totalRecordCount - query.offset - query.limit;
                        reverseResult = true;
                    }

                    break;
                case AlbumListSortOptions.DATE_PLAYED:
                    // Default is descending
                    sortType = 'recent';

                    if (query.sortOrder === 'asc') {
                        offset = totalRecordCount - query.offset - query.limit;
                        reverseResult = true;
                    }

                    break;
                case AlbumListSortOptions.IS_FAVORITE:
                    // Default is ascending
                    sortType = 'starred';

                    if (query.sortOrder === 'desc') {
                        offset = totalRecordCount - query.offset - query.limit;
                        reverseResult = true;
                    }

                    break;
                case AlbumListSortOptions.NAME:
                    // Default is ascending
                    sortType = 'alphabeticalByName';

                    if (query.sortOrder === 'desc') {
                        offset = totalRecordCount - query.offset - query.limit;
                        reverseResult = true;
                    }

                    break;
                case AlbumListSortOptions.PLAY_COUNT:
                    // Default is descending
                    sortType = 'frequent';

                    if (query.sortOrder === 'asc') {
                        offset = totalRecordCount - query.offset - query.limit;
                        reverseResult = true;
                    }

                    break;
                case AlbumListSortOptions.RANDOM:
                    sortType = 'random';
                    break;
                case AlbumListSortOptions.RATING:
                    // Default is ascending
                    sortType = 'highest';

                    if (query.sortOrder === 'desc') {
                        offset = totalRecordCount - query.offset - query.limit;
                        reverseResult = true;
                    }

                    break;
                case AlbumListSortOptions.YEAR:
                    sortType = 'byYear';

                    break;
                default:
                    sortType = 'alphabeticalByName';
                    break;
            }

            if (sortType === 'byYear') {
                const currentYear = dayjs().year();
                if (query.sortOrder === 'asc') {
                    fromYear = 0;
                    toYear = currentYear;
                } else {
                    fromYear = currentYear;
                    toYear = 0;
                }
            }

            if (query.limit === -1) {
                const fetcher = async (page: number, limit: number) => {
                    const result = await apiClient.getAlbumList2.os['1'].get({
                        fetchOptions,
                        query: {
                            fromYear,
                            musicFolderId: query.folderId ? Number(query.folderId[0]) : undefined,
                            offset: page * limit,
                            size: limit,
                            toYear,
                            type: sortType,
                        },
                    });

                    if (result.status !== 200) {
                        throw new Error(JSON.stringify(result.body));
                    }

                    return result.body['subsonic-response'].albumList2.album || [];
                };

                const results = await adapterHelpers.fetchAllRecords(fetcher, query.limit);
                const items = results.map(subsonicHelpers.converter.albumToAdapter);
                const sorted = adapterHelpers.sortBy.album(items, query.sortBy, query.sortOrder);
                const paginated = adapterHelpers.paginate(sorted, query.offset, query.limit);

                return [
                    null,
                    {
                        items: paginated.items,
                        limit: paginated.limit,
                        offset: paginated.offset,
                        totalRecordCount: results.length,
                    },
                ];
            }

            const result = await apiClient.getAlbumList2.os['1'].get({
                fetchOptions,
                query: {
                    fromYear,
                    musicFolderId: query.folderId ? Number(query.folderId[0]) : undefined,
                    offset,
                    size: query.limit,
                    toYear,
                    type: sortType,
                },
            });

            if (result.status !== 200) {
                writeLog.error(adapterHelpers.adapterErrorMessage(library, 'getAlbumList'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            let items = (result.body['subsonic-response'].albumList2.album || []).map(
                subsonicHelpers.converter.albumToAdapter,
            );

            if (reverseResult) {
                items = items.reverse();
            }

            return [
                null,
                {
                    items,
                    limit: query.limit,
                    offset: query.offset,
                    totalRecordCount,
                },
            ];
        },
        getAlbumListCount: async (request, fetchOptions) => {
            const { query } = request;

            const sanitizedQuery: Pick<
                AdapterAlbumListQuery,
                'folderId' | 'searchTerm' | 'sortBy'
            > = {
                folderId: query.folderId,
                searchTerm: query.searchTerm,
                sortBy: query.sortBy,
            };

            async function getPageItemCount(page: number, limit: number): Promise<number> {
                const result = await apiClient.getAlbumList2.os['1'].get({
                    fetchOptions,
                    query: {
                        musicFolderId: query.folderId ? Number(query.folderId[0]) : undefined,
                        offset: page * limit,
                        size: limit,
                        type: subsonicHelpers.sortByMap[query.sortBy] as AlbumSortType,
                    },
                });

                if (result.status !== 200) {
                    throw new Error(JSON.stringify(result.body));
                }

                return result.body['subsonic-response'].albumList2.album?.length || 0;
            }

            async function getSearchPageItemCount(page: number, limit: number): Promise<number> {
                const result = await apiClient.search3.os['1'].get({
                    fetchOptions,
                    query: {
                        albumCount: limit,
                        albumOffset: page * limit,
                        artistCount: 0,
                        artistOffset: 0,
                        query: query.searchTerm,
                        songCount: 0,
                        songOffset: 0,
                    },
                });

                if (result.status !== 200) {
                    throw new Error(JSON.stringify(result.body));
                }

                return result.body['subsonic-response'].searchResult3.album?.length || 0;
            }

            const pageItemCountFn = query.searchTerm ? getSearchPageItemCount : getPageItemCount;

            try {
                const totalRecordCount = await adapterHelpers.db.getCount(db, pageItemCountFn, {
                    expiration: 1440,
                    libraryId: library.id,
                    query: sanitizedQuery,
                    type: 'album',
                });

                return [null, totalRecordCount];
            } catch (err) {
                writeLog.error(adapterHelpers.adapterErrorMessage(library, 'getAlbumListCount'));
                return [{ code: 500, message: err as string }, null];
            }
        },
        getAlbumTrackList: async (request, fetchOptions) => {
            const { query } = request;

            const result = await apiClient.getAlbum.os['1'].get({
                fetchOptions,
                query: {
                    id: query.id,
                },
            });

            if (result.status !== 200) {
                writeLog.error(adapterHelpers.adapterErrorMessage(library, 'getAlbumTrackList'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            const results = (result.body['subsonic-response'].album.song || []).map(
                subsonicHelpers.converter.trackToAdapter,
            );

            const sorted = adapterHelpers.sortBy.track(results, query.sortBy, query.sortOrder);
            const paginated = adapterHelpers.paginate(sorted, query.offset, query.limit);

            return [
                null,
                {
                    items: paginated.items,
                    limit: paginated.limit,
                    offset: paginated.offset,
                    totalRecordCount: results.length,
                },
            ];
        },
        getArtistList: async (request, fetchOptions) => {
            return initSubsonicAdapter(library, db).getAlbumArtistList(request, fetchOptions);
        },
        getArtistListCount: async (request, fetchOptions) => {
            return initSubsonicAdapter(library, db).getAlbumArtistListCount(request, fetchOptions);
        },
        getFavoriteAlbumList: async (request, fetchOptions) => {
            const { query } = request;

            const result = await apiClient.getStarred2.os['1'].get({
                fetchOptions,
                query: {
                    musicFolderId: query.folderId ? Number(query.folderId[0]) : undefined,
                },
            });

            if (result.status !== 200) {
                writeLog.error(adapterHelpers.adapterErrorMessage(library, 'getFavoriteAlbumList'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            const items = (result.body['subsonic-response'].starred2?.album || []).map(
                subsonicHelpers.converter.albumToAdapter,
            );

            const sorted = adapterHelpers.sortBy.album(items, query.sortBy, query.sortOrder);
            const paginated = adapterHelpers.paginate(sorted, query.offset, query.limit);

            return [
                null,
                {
                    items: paginated.items,
                    limit: paginated.limit,
                    offset: paginated.offset,
                    totalRecordCount: (result.body['subsonic-response'].starred2?.album || [])
                        .length,
                },
            ];
        },
        getFavoriteArtistList: async (request, fetchOptions) => {
            const { query } = request;

            const result = await apiClient.getStarred2.os['1'].get({
                fetchOptions,
                query: {
                    musicFolderId: query.folderId ? Number(query.folderId[0]) : undefined,
                },
            });

            if (result.status !== 200) {
                writeLog.error(
                    adapterHelpers.adapterErrorMessage(library, 'getFavoriteArtistList'),
                );
                return [{ code: result.status, message: result.body as string }, null];
            }

            const items: AdapterArtist[] = (
                result.body['subsonic-response'].starred2?.artist || []
            ).map(subsonicHelpers.converter.artistToAdapter);

            const sorted = adapterHelpers.sortBy.artist(items, query.sortBy, query.sortOrder);
            const paginated = adapterHelpers.paginate(sorted, query.offset, query.limit);

            return [
                null,
                {
                    items: paginated.items,
                    limit: paginated.limit,
                    offset: paginated.offset,
                    totalRecordCount: (result.body['subsonic-response'].starred2?.artist || [])
                        .length,
                },
            ];
        },
        getFavoriteTrackList: async (request, fetchOptions) => {
            const { query } = request;

            const result = await apiClient.getStarred2.os['1'].get({
                fetchOptions,
                query: {
                    musicFolderId: query.folderId ? Number(query.folderId[0]) : undefined,
                },
            });

            if (result.status !== 200) {
                writeLog.error(adapterHelpers.adapterErrorMessage(library, 'getFavoriteTrackList'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            const items: AdapterTrack[] = (
                result.body['subsonic-response'].starred2?.song || []
            ).map(subsonicHelpers.converter.trackToAdapter);

            const sorted = adapterHelpers.sortBy.track(items, query.sortBy, query.sortOrder);
            const paginated = adapterHelpers.paginate(sorted, query.offset, query.limit);

            return [
                null,
                {
                    items: paginated.items,
                    limit: paginated.limit,
                    offset: paginated.offset,
                    totalRecordCount: (result.body['subsonic-response'].starred2.song || []).length,
                },
            ];
        },
        getGenreCount: async (request, fetchOptions) => {
            const { query } = request;

            const result = await apiClient.getGenres.os['1'].get({
                fetchOptions,
                query,
            });

            if (result.status !== 200) {
                writeLog.error(adapterHelpers.adapterErrorMessage(library, 'getGenreCount'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            let items: AdapterGenre[] = (result.body['subsonic-response'].genres.genre || []).map(
                (genre) => ({
                    albumCount: genre.albumCount ?? null,
                    id: genre.value,
                    imageUrl: null,
                    name: genre.value,
                    trackCount: genre.songCount ?? null,
                }),
            );

            if (query.searchTerm) {
                items = items.filter((item) =>
                    item.name.toLowerCase().includes(query.searchTerm!.toLowerCase()),
                );
            }

            return [null, items.length];
        },
        getGenreList: async (request, fetchOptions) => {
            const { query } = request;

            const result = await apiClient.getGenres.os['1'].get({
                fetchOptions,
                query: {},
            });

            if (result.status !== 200) {
                writeLog.error(adapterHelpers.adapterErrorMessage(library, 'getGenreList'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            let items: AdapterGenre[] = (result.body['subsonic-response'].genres.genre || []).map(
                (genre) => ({
                    albumCount: genre.albumCount ?? null,
                    id: genre.value,
                    imageUrl: null,
                    name: genre.value,
                    trackCount: genre.songCount ?? null,
                }),
            );

            if (query.searchTerm) {
                items = items.filter((item) =>
                    item.name.toLowerCase().includes(query.searchTerm!.toLowerCase()),
                );
            }

            const sorted = adapterHelpers.sortBy.genre(items, query.sortBy, query.sortOrder);
            const paginated = adapterHelpers.paginate(sorted, query.offset, query.limit);

            return [
                null,
                {
                    items: paginated.items,
                    limit: paginated.limit,
                    offset: paginated.offset,
                    totalRecordCount: (result.body['subsonic-response'].genres.genre || []).length,
                },
            ];
        },
        getGenreTrackList: async (request, fetchOptions) => {
            const { query } = request;

            const tracks = [];

            if (query.limit === -1) {
                const fetcher = async (page: number, limit: number) => {
                    const result = await apiClient.getSongsByGenre.os['1'].get({
                        fetchOptions,
                        query: {
                            count: limit,
                            genre: query.id,
                            musicFolderId: query.folderId ? Number(query.folderId[0]) : undefined,
                            offset: page * limit,
                        },
                    });

                    if (result.status !== 200) {
                        throw new Error(JSON.stringify(result.body));
                    }

                    return result.body['subsonic-response'].songsByGenre.song || [];
                };

                const results = await adapterHelpers.fetchAllRecords(fetcher);
                tracks.push(...results);
            } else {
                const result = await apiClient.getSongsByGenre.os['1'].get({
                    fetchOptions,
                    query: {
                        count: query.limit,
                        genre: query.id,
                        musicFolderId: query.folderId ? Number(query.folderId[0]) : undefined,
                        offset: query.offset,
                    },
                });

                if (result.status !== 200) {
                    writeLog.error(
                        adapterHelpers.adapterErrorMessage(library, 'getGenreTrackList'),
                    );
                    return [{ code: result.status, message: result.body as string }, null];
                }

                tracks.push(...(result.body['subsonic-response'].songsByGenre.song || []));
            }

            const items = tracks.map(subsonicHelpers.converter.trackToAdapter);
            const sorted = adapterHelpers.sortBy.track(items, query.sortBy, query.sortOrder);
            const paginated = adapterHelpers.paginate(sorted, query.offset, query.limit);

            const [err, totalRecordCount] = await initSubsonicAdapter(
                library,
                db,
            ).getGenreTrackListCount({
                query,
            });

            if (err) {
                return [err, null];
            }

            return [
                null,
                {
                    items: paginated.items,
                    limit: paginated.limit,
                    offset: paginated.offset,
                    totalRecordCount,
                },
            ];
        },
        getGenreTrackListCount: async (request, fetchOptions) => {
            const { query } = request;

            const sanitizedQuery: Pick<
                AdapterTrackListQuery,
                'folderId' | 'searchTerm' | 'genreId'
            > = {
                folderId: query.folderId,
                genreId: query.id,
            };

            const getPageItemCount = async (page: number, limit: number): Promise<number> => {
                const result = await apiClient.getSongsByGenre.os['1'].get({
                    fetchOptions,
                    query: {
                        count: limit,
                        genre: query.id,
                        musicFolderId: query.folderId ? Number(query.folderId[0]) : undefined,
                        offset: page * limit,
                    },
                });

                if (result.status !== 200) {
                    throw new Error(JSON.stringify(result.body));
                }

                return (result.body['subsonic-response'].songsByGenre.song || []).length;
            };

            try {
                const totalRecordCount = await adapterHelpers.db.getCount(db, getPageItemCount, {
                    expiration: 1440,
                    libraryId: library.id,
                    query: sanitizedQuery,
                    type: 'track',
                });

                return [null, totalRecordCount];
            } catch (err) {
                writeLog.error(
                    adapterHelpers.adapterErrorMessage(library, 'getGenreTrackListCount'),
                );
                return [{ code: 500, message: err as string }, null];
            }
        },
        getMusicFolderList: async (request, fetchOptions) => {
            const { query } = request;

            const result = await apiClient.getMusicFolders.os['1'].get({
                ...fetchOptions,
            });

            if (result.status !== 200) {
                writeLog.error(adapterHelpers.adapterErrorMessage(library, 'getMusicFolderList'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            const items = (result.body['subsonic-response'].musicFolders?.musicFolder || []).map(
                (folder) => ({
                    id: folder.id.toString(),
                    name: folder.name || '',
                }),
            );

            return [
                null,
                {
                    items,
                    limit: query.limit,
                    offset: query.offset,
                    totalRecordCount: (
                        result.body['subsonic-response'].musicFolders?.musicFolder || []
                    ).length,
                },
            ];
        },
        getPlaylistDetail: async (request, fetchOptions) => {
            const { query } = request;

            const result = await apiClient.getPlaylist.os['1'].get({
                fetchOptions,
                query,
            });

            if (result.status !== 200) {
                writeLog.error(adapterHelpers.adapterErrorMessage(library, 'getPlaylistDetail'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            const item = subsonicHelpers.converter.playlistToAdapter(
                result.body['subsonic-response'].playlist,
            );

            return [null, item];
        },
        getPlaylistList: async (request, fetchOptions) => {
            const { query } = request;

            const result = await apiClient.getPlaylists.os['1'].get({
                fetchOptions,
                query: {
                    username: query.userId,
                },
            });

            if (result.status !== 200) {
                writeLog.error(adapterHelpers.adapterErrorMessage(library, 'getPlaylistList'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            let playlists: AdapterPlaylist[] = (
                result.body['subsonic-response'].playlists.playlist || []
            ).map(subsonicHelpers.converter.playlistToAdapter);

            if (query.searchTerm) {
                playlists = playlists.filter((playlist) => {
                    return playlist.name.toLowerCase().includes(query.searchTerm!.toLowerCase());
                });
            }

            const sorted = adapterHelpers.sortBy.playlist(playlists, query.sortBy, query.sortOrder);
            const paginated = adapterHelpers.paginate(sorted, query.offset, query.limit);

            const [err, totalRecordCount] = await initSubsonicAdapter(
                library,
                db,
            ).getPlaylistListCount({
                query,
            });

            if (err) {
                return [err, null];
            }

            return [
                null,
                {
                    items: paginated.items,
                    limit: paginated.limit,
                    offset: paginated.offset,
                    totalRecordCount,
                },
            ];
        },
        getPlaylistListCount: async (request, fetchOptions) => {
            const { query } = request;

            const sanitizedQuery: Pick<AdapterPlaylistListQuery, 'userId'> = {
                userId: query.userId,
            };

            const totalRecordCountFromDb = adapterHelpers.db.getCountWithoutFetch(db, {
                libraryId: library.id,
                query: sanitizedQuery,
                type: 'playlist',
            });

            if (totalRecordCountFromDb) {
                return [null, totalRecordCountFromDb];
            }

            const result = await apiClient.getPlaylists.os['1'].get({
                fetchOptions,
                query: {
                    username: query.userId,
                },
            });

            if (result.status !== 200) {
                writeLog.error(adapterHelpers.adapterErrorMessage(library, 'getPlaylistListCount'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            return [null, (result.body['subsonic-response'].playlists.playlist || []).length];
        },
        getPlaylistTrackList: async (request, fetchOptions) => {
            const { query } = request;

            const result = await apiClient.getPlaylist.os['1'].get({
                fetchOptions,
                query: {
                    id: query.id,
                },
            });

            if (result.status !== 200) {
                writeLog.error(adapterHelpers.adapterErrorMessage(library, 'getPlaylistSongList'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            let tracks: AdapterPlaylistTrack[] = (
                result.body['subsonic-response'].playlist.entry || []
            ).map(subsonicHelpers.converter.playlistTrackToAdapter);

            if (query.searchTerm) {
                tracks = tracks.filter((track) => {
                    return track.name.toLowerCase().includes(query.searchTerm!.toLowerCase());
                });
            }

            const sorted = adapterHelpers.sortBy.track(
                tracks,
                query.sortBy,
                query.sortOrder || 'asc',
            ) as AdapterPlaylistTrack[];

            const paginated = adapterHelpers.paginate(sorted, query.offset, query.limit);

            const [err, totalRecordCount] = await initSubsonicAdapter(
                library,
                db,
            ).getPlaylistTrackListCount({
                query,
            });

            if (err) {
                return [err, null];
            }

            return [
                null,
                {
                    items: paginated.items,
                    limit: paginated.limit,
                    offset: paginated.offset,
                    totalRecordCount,
                },
            ];
        },
        getPlaylistTrackListCount: async (request, fetchOptions) => {
            const { query } = request;

            const sanitizedQuery: Pick<AdapterPlaylistTrackListQuery, 'id'> = {
                id: query.id,
            };

            const totalRecordCountFromDb = adapterHelpers.db.getCountWithoutFetch(db, {
                libraryId: library.id,
                query: sanitizedQuery,
                type: 'playlistDetail',
            });

            if (totalRecordCountFromDb) {
                return [null, totalRecordCountFromDb];
            }

            const result = await apiClient.getPlaylist.os['1'].get({
                fetchOptions,
                query,
            });

            if (result.status !== 200) {
                writeLog.error(
                    adapterHelpers.adapterErrorMessage(library, 'getPlaylistTrackListCount'),
                );
                return [{ code: result.status, message: result.body as string }, null];
            }

            return [null, (result.body['subsonic-response'].playlist.entry || []).length];
        },
        getTrackDetail: async (request, fetchOptions) => {
            const { query } = request;

            const result = await apiClient.getSong.os['1'].get({
                fetchOptions,
                query,
            });

            if (result.status !== 200) {
                writeLog.error(adapterHelpers.adapterErrorMessage(library, 'getTrackDetail'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            const item = subsonicHelpers.converter.trackToAdapter(
                result.body['subsonic-response'].song,
            );

            return [null, item];
        },
        getTrackList: async (request, fetchOptions) => {
            const { query } = request;

            if (query.limit === -1) {
                const fetcher = async (page: number, limit: number) => {
                    const result = await apiClient.search3.os['1'].get({
                        fetchOptions,
                        query: {
                            musicFolderId: query.folderId ? Number(query.folderId[0]) : undefined,
                            query: query.searchTerm || '',
                            songCount: limit,
                            songOffset: page * limit,
                        },
                    });

                    if (result.status !== 200) {
                        throw new Error(JSON.stringify(result.body));
                    }

                    return result.body['subsonic-response'].searchResult3.song || [];
                };

                const results = await adapterHelpers.fetchAllRecords(fetcher, query.limit);
                const items = results.map(subsonicHelpers.converter.trackToAdapter);
                const sorted = adapterHelpers.sortBy.track(items, query.sortBy, query.sortOrder);
                const paginated = adapterHelpers.paginate(sorted, query.offset, query.limit);

                return [
                    null,
                    {
                        items: paginated.items,
                        limit: paginated.limit,
                        offset: paginated.offset,
                        totalRecordCount: results.length,
                    },
                ];
            }

            const result = await apiClient.search3.os['1'].get({
                fetchOptions,
                query: {
                    musicFolderId: query.folderId ? Number(query.folderId[0]) : undefined,
                    query: query.searchTerm || '',
                    songCount: query.limit,
                    songOffset: query.offset,
                },
            });

            if (result.status !== 200) {
                writeLog.error(adapterHelpers.adapterErrorMessage(library, 'getTrackList'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            const items: AdapterTrack[] = (
                result.body['subsonic-response'].searchResult3.song || []
            ).map(subsonicHelpers.converter.trackToAdapter);

            const [err, totalRecordCount] = await initSubsonicAdapter(
                library,
                db,
            ).getTrackListCount({
                query,
            });

            if (err) {
                return [err, null];
            }

            return [
                null,
                {
                    items,
                    limit: query.limit,
                    offset: query.offset,
                    totalRecordCount,
                },
            ];
        },
        getTrackListCount: async (request, fetchOptions) => {
            const { query } = request;

            const sanitizedQuery: Pick<
                AdapterTrackListQuery,
                'folderId' | 'searchTerm' | 'genreId'
            > = {
                folderId: query.folderId,
                genreId: query.genreId,
                searchTerm: query.searchTerm,
            };

            const getPageItemCount = async (page: number, limit: number): Promise<number> => {
                const result = await apiClient.search3.os['1'].get({
                    fetchOptions,
                    query: {
                        musicFolderId: query.folderId ? Number(query.folderId[0]) : undefined,
                        query: '',
                        songCount: limit,
                        songOffset: page * limit,
                    },
                });

                if (result.status !== 200) {
                    throw new Error(JSON.stringify(result.body));
                }

                return (result.body['subsonic-response'].searchResult3.song || []).length;
            };

            const getPageItemCountWithGenre = async (
                page: number,
                limit: number,
            ): Promise<number> => {
                const result = await apiClient.getSongsByGenre.os['1'].get({
                    fetchOptions,
                    query: {
                        count: limit,
                        genre: query.genreId || '',
                        musicFolderId: query.folderId ? Number(query.folderId[0]) : undefined,
                        offset: page * limit,
                    },
                });

                if (result.status !== 200) {
                    throw new Error(JSON.stringify(result.body));
                }

                return (result.body['subsonic-response'].songsByGenre.song || []).length;
            };

            try {
                const fetcherFn = query.genreId ? getPageItemCountWithGenre : getPageItemCount;

                const totalRecordCount = await adapterHelpers.db.getCount(db, fetcherFn, {
                    expiration: 1440,
                    libraryId: library.id,
                    query: sanitizedQuery,
                    type: 'track',
                });

                return [null, totalRecordCount];
            } catch (err) {
                writeLog.error(adapterHelpers.adapterErrorMessage(library, 'getTrackListCount'));
                return [{ code: 500, message: err as string }, null];
            }
        },
        removeFromPlaylist: async (request, fetchOptions) => {
            const { query, body } = request;

            const result = await apiClient.updatePlaylist.os['1'].get({
                fetchOptions,
                query: {
                    playlistId: query.id,
                    songIdToRemove: body.entry,
                },
            });

            if (result.status !== 200) {
                writeLog.error(adapterHelpers.adapterErrorMessage(library, 'removeFromPlaylist'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            return [null, null];
        },
        scrobble: async (request, fetchOptions) => {
            const { query } = request;
            const result = await apiClient.scrobble.os['1'].get({
                fetchOptions,
                query: {
                    id: query.id,
                    submission: true,
                },
            });

            if (result.status !== 200) {
                writeLog.error(adapterHelpers.adapterErrorMessage(library, 'scrobble'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            return [null, null];
        },
        setFavorite: async (request, fetchOptions) => {
            const { body } = request;

            const trackIds = { add: [] as string[], remove: [] as string[] };
            const albumIds = { add: [] as string[], remove: [] as string[] };
            const artistIds = { add: [] as string[], remove: [] as string[] };

            for (const entry of body.entry) {
                switch (entry.type) {
                    case 'album': {
                        entry.favorite
                            ? albumIds.add.push(entry.id)
                            : albumIds.remove.push(entry.id);
                        break;
                    }
                    case 'artist': {
                        entry.favorite
                            ? artistIds.add.push(entry.id)
                            : artistIds.remove.push(entry.id);
                        break;
                    }
                    case 'track': {
                        entry.favorite
                            ? trackIds.add.push(entry.id)
                            : trackIds.remove.push(entry.id);
                        break;
                    }
                }
            }

            const shouldAdd =
                albumIds.add.length > 0 || artistIds.add.length > 0 || trackIds.add.length > 0;

            const shouldRemove =
                albumIds.remove.length > 0 ||
                artistIds.remove.length > 0 ||
                trackIds.remove.length > 0;

            if (shouldAdd) {
                const result = await apiClient.star.os['1'].get({
                    fetchOptions,
                    query: {
                        albumId: albumIds.add,
                        artistId: artistIds.add,
                        id: trackIds.add,
                    },
                });

                if (result.status !== 200) {
                    writeLog.error(adapterHelpers.adapterErrorMessage(library, 'setFavorite'));
                    return [{ code: result.status, message: result.body as string }, null];
                }
            }

            if (shouldRemove) {
                const result = await apiClient.unstar.os['1'].get({
                    fetchOptions,
                    query: {
                        albumId: albumIds.remove,
                        artistId: artistIds.remove,
                        id: trackIds.remove,
                    },
                });

                if (result.status !== 200) {
                    writeLog.error(adapterHelpers.adapterErrorMessage(library, 'setFavorite'));
                    return [{ code: result.status, message: result.body as string }, null];
                }
            }

            return [null, null];
        },
        setRating: async (request, fetchOptions) => {
            const { body } = request;

            for (const entry of body.entry) {
                const result = await apiClient.setRating.os['1'].get({
                    fetchOptions,
                    query: {
                        id: entry.id,
                        rating: entry.rating,
                    },
                });

                if (result.status !== 200) {
                    writeLog.error(adapterHelpers.adapterErrorMessage(library, 'setRating'));
                    return [{ code: result.status, message: result.body as string }, null];
                }
            }

            return [null, null];
        },
        updatePlaylist: async (request, fetchOptions) => {
            const { body, query } = request;

            const result = await apiClient.updatePlaylist.os['1'].get({
                fetchOptions,
                query: {
                    comment: body.comment,
                    name: body.name,
                    playlistId: query.id,
                    public: body.public,
                },
            });

            if (result.status !== 200) {
                writeLog.error(adapterHelpers.adapterErrorMessage(library, 'updatePlaylist'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            return [null, null];
        },
    };

    return adapter;
};

type SubsonicAuthenticationResponse = {
    'subsonic-response': {
        status: string;
        version: string;
    };
};

type SubsonicMusicFolderListResponse = {
    'subsonic-response': {
        musicFolders: {
            musicFolder: {
                id: string;
                name: string;
            }[];
        };
        status: string;
        version: string;
    };
};

export const subsonicAuthenticationAdapter: AdapterAuthentication = {
    authenticate: async (url, body) => {
        const cleanServerUrl = url.replace(/\/$/, '');

        const authenticationUrl = `${cleanServerUrl}/rest/ping`;

        const salt = generateRandomString(12);
        const token = md5(body.password + salt);

        let result: AdapterAuthenticationResponse | null = null;

        // Attempt to authenticate with salt and hash
        const { data: hashAuth } = await axios.get<SubsonicAuthenticationResponse>(
            authenticationUrl,
            {
                params: {
                    c: CONSTANTS.APP_NAME,
                    f: 'json',
                    s: salt,
                    t: token,
                    u: body.username,
                    v: '1.16.0',
                },
            },
        );

        if (hashAuth['subsonic-response'].status === 'ok') {
            result = {
                auth: {
                    credential: utils.delimiter.credential([salt, token]),
                    username: body.username,
                },
                folders: [],
            };
        } else {
            // Attempt to authenticate with password
            const { data: plainAuth } = await axios.get<SubsonicAuthenticationResponse>(
                authenticationUrl,
                {
                    params: {
                        c: CONSTANTS.APP_NAME,
                        f: 'json',
                        p: body.password,
                        s: salt,
                        t: token,
                        u: body.username,
                        v: '1.16.0',
                    },
                },
            );

            if (plainAuth['subsonic-response'].status === 'ok') {
                result = {
                    auth: {
                        credential: body.password,
                        username: body.username,
                    },
                    folders: [],
                };
            }
        }

        if (result?.auth) {
            const musicFolderListUrl = `${cleanServerUrl}/rest/getMusicFolders`;

            const { data: musicFolderListResponse } =
                await axios.get<SubsonicMusicFolderListResponse>(musicFolderListUrl, {
                    params: {
                        c: CONSTANTS.APP_NAME,
                        f: 'json',
                        p: body.password,
                        s: salt,
                        t: token,
                        u: body.username,
                        v: '1.16.0',
                    },
                });

            if (musicFolderListResponse['subsonic-response'].status === 'ok') {
                result.folders = musicFolderListResponse[
                    'subsonic-response'
                ].musicFolders.musicFolder.map((folder) => ({
                    id: folder.id,
                    name: folder.name,
                }));
            }

            return result;
        }

        return null;
    },
    ping: async () => {
        return true;
    },
};
