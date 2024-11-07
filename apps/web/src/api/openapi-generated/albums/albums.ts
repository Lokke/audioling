/**
 * Generated by orval v7.2.0 🍺
 * Do not edit manually.
 * Audioling API
 * OpenAPI spec version: 1.0.0
 */
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import type {
    MutationFunction,
    QueryFunction,
    QueryKey,
    UseMutationOptions,
    UseMutationResult,
    UseSuspenseQueryOptions,
    UseSuspenseQueryResult,
} from '@tanstack/react-query';
import type {
    DeleteApiLibraryIdAlbumsIdFavorite204,
    DeleteApiLibraryIdAlbumsIdFavorite401,
    DeleteApiLibraryIdAlbumsIdFavorite403,
    DeleteApiLibraryIdAlbumsIdFavorite404,
    DeleteApiLibraryIdAlbumsIdFavorite500,
    GetApiLibraryIdAlbums200,
    GetApiLibraryIdAlbums401,
    GetApiLibraryIdAlbums403,
    GetApiLibraryIdAlbums422,
    GetApiLibraryIdAlbums500,
    GetApiLibraryIdAlbumsCount401,
    GetApiLibraryIdAlbumsCount403,
    GetApiLibraryIdAlbumsCount422,
    GetApiLibraryIdAlbumsCount500,
    GetApiLibraryIdAlbumsCountParams,
    GetApiLibraryIdAlbumsId200,
    GetApiLibraryIdAlbumsId401,
    GetApiLibraryIdAlbumsId403,
    GetApiLibraryIdAlbumsId404,
    GetApiLibraryIdAlbumsId500,
    GetApiLibraryIdAlbumsIdTracks200,
    GetApiLibraryIdAlbumsIdTracks401,
    GetApiLibraryIdAlbumsIdTracks403,
    GetApiLibraryIdAlbumsIdTracks404,
    GetApiLibraryIdAlbumsIdTracks422,
    GetApiLibraryIdAlbumsIdTracks500,
    GetApiLibraryIdAlbumsIdTracksParams,
    GetApiLibraryIdAlbumsParams,
    PostApiLibraryIdAlbumsIdFavorite204,
    PostApiLibraryIdAlbumsIdFavorite401,
    PostApiLibraryIdAlbumsIdFavorite403,
    PostApiLibraryIdAlbumsIdFavorite404,
    PostApiLibraryIdAlbumsIdFavorite500,
} from '../audioling-openapi-client.schemas.ts';
import { apiInstance } from '../../api-instance.ts';
import type { ErrorType } from '../../api-instance.ts';

type SecondParameter<T extends (...args: any) => any> = Parameters<T>[1];

/**
 * @summary Get all albums
 */
export const getApiLibraryIdAlbums = (
    libraryId: string,
    params: GetApiLibraryIdAlbumsParams,
    options?: SecondParameter<typeof apiInstance>,
    signal?: AbortSignal,
) => {
    return apiInstance<GetApiLibraryIdAlbums200>(
        { url: `/api/${libraryId}/albums`, method: 'GET', params, signal },
        options,
    );
};

export const getGetApiLibraryIdAlbumsQueryKey = (
    libraryId: string,
    params: GetApiLibraryIdAlbumsParams,
) => {
    return [`/api/${libraryId}/albums`, ...(params ? [params] : [])] as const;
};

export const getGetApiLibraryIdAlbumsSuspenseQueryOptions = <
    TData = Awaited<ReturnType<typeof getApiLibraryIdAlbums>>,
    TError = ErrorType<
        | GetApiLibraryIdAlbums401
        | GetApiLibraryIdAlbums403
        | GetApiLibraryIdAlbums422
        | GetApiLibraryIdAlbums500
    >,
>(
    libraryId: string,
    params: GetApiLibraryIdAlbumsParams,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdAlbums>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
) => {
    const { query: queryOptions, request: requestOptions } = options ?? {};

    const queryKey = queryOptions?.queryKey ?? getGetApiLibraryIdAlbumsQueryKey(libraryId, params);

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiLibraryIdAlbums>>> = ({
        signal,
    }) => getApiLibraryIdAlbums(libraryId, params, requestOptions, signal);

    return {
        queryKey,
        queryFn,
        enabled: !!libraryId,
        staleTime: 10000,
        ...queryOptions,
    } as UseSuspenseQueryOptions<
        Awaited<ReturnType<typeof getApiLibraryIdAlbums>>,
        TError,
        TData
    > & { queryKey: QueryKey };
};

export type GetApiLibraryIdAlbumsSuspenseQueryResult = NonNullable<
    Awaited<ReturnType<typeof getApiLibraryIdAlbums>>
>;
export type GetApiLibraryIdAlbumsSuspenseQueryError = ErrorType<
    | GetApiLibraryIdAlbums401
    | GetApiLibraryIdAlbums403
    | GetApiLibraryIdAlbums422
    | GetApiLibraryIdAlbums500
>;

export function useGetApiLibraryIdAlbumsSuspense<
    TData = Awaited<ReturnType<typeof getApiLibraryIdAlbums>>,
    TError = ErrorType<
        | GetApiLibraryIdAlbums401
        | GetApiLibraryIdAlbums403
        | GetApiLibraryIdAlbums422
        | GetApiLibraryIdAlbums500
    >,
>(
    libraryId: string,
    params: GetApiLibraryIdAlbumsParams,
    options: {
        query: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdAlbums>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: QueryKey };
export function useGetApiLibraryIdAlbumsSuspense<
    TData = Awaited<ReturnType<typeof getApiLibraryIdAlbums>>,
    TError = ErrorType<
        | GetApiLibraryIdAlbums401
        | GetApiLibraryIdAlbums403
        | GetApiLibraryIdAlbums422
        | GetApiLibraryIdAlbums500
    >,
>(
    libraryId: string,
    params: GetApiLibraryIdAlbumsParams,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdAlbums>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: QueryKey };
export function useGetApiLibraryIdAlbumsSuspense<
    TData = Awaited<ReturnType<typeof getApiLibraryIdAlbums>>,
    TError = ErrorType<
        | GetApiLibraryIdAlbums401
        | GetApiLibraryIdAlbums403
        | GetApiLibraryIdAlbums422
        | GetApiLibraryIdAlbums500
    >,
>(
    libraryId: string,
    params: GetApiLibraryIdAlbumsParams,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdAlbums>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: QueryKey };
/**
 * @summary Get all albums
 */

export function useGetApiLibraryIdAlbumsSuspense<
    TData = Awaited<ReturnType<typeof getApiLibraryIdAlbums>>,
    TError = ErrorType<
        | GetApiLibraryIdAlbums401
        | GetApiLibraryIdAlbums403
        | GetApiLibraryIdAlbums422
        | GetApiLibraryIdAlbums500
    >,
>(
    libraryId: string,
    params: GetApiLibraryIdAlbumsParams,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdAlbums>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: QueryKey } {
    const queryOptions = getGetApiLibraryIdAlbumsSuspenseQueryOptions(libraryId, params, options);

    const query = useSuspenseQuery(queryOptions) as UseSuspenseQueryResult<TData, TError> & {
        queryKey: QueryKey;
    };

    query.queryKey = queryOptions.queryKey;

    return query;
}

/**
 * @summary Get all albums count
 */
export const getApiLibraryIdAlbumsCount = (
    libraryId: string,
    params: GetApiLibraryIdAlbumsCountParams,
    options?: SecondParameter<typeof apiInstance>,
    signal?: AbortSignal,
) => {
    return apiInstance<number>(
        { url: `/api/${libraryId}/albums/count`, method: 'GET', params, signal },
        options,
    );
};

export const getGetApiLibraryIdAlbumsCountQueryKey = (
    libraryId: string,
    params: GetApiLibraryIdAlbumsCountParams,
) => {
    return [`/api/${libraryId}/albums/count`, ...(params ? [params] : [])] as const;
};

export const getGetApiLibraryIdAlbumsCountSuspenseQueryOptions = <
    TData = Awaited<ReturnType<typeof getApiLibraryIdAlbumsCount>>,
    TError = ErrorType<
        | GetApiLibraryIdAlbumsCount401
        | GetApiLibraryIdAlbumsCount403
        | GetApiLibraryIdAlbumsCount422
        | GetApiLibraryIdAlbumsCount500
    >,
>(
    libraryId: string,
    params: GetApiLibraryIdAlbumsCountParams,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdAlbumsCount>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
) => {
    const { query: queryOptions, request: requestOptions } = options ?? {};

    const queryKey =
        queryOptions?.queryKey ?? getGetApiLibraryIdAlbumsCountQueryKey(libraryId, params);

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiLibraryIdAlbumsCount>>> = ({
        signal,
    }) => getApiLibraryIdAlbumsCount(libraryId, params, requestOptions, signal);

    return {
        queryKey,
        queryFn,
        enabled: !!libraryId,
        staleTime: 10000,
        ...queryOptions,
    } as UseSuspenseQueryOptions<
        Awaited<ReturnType<typeof getApiLibraryIdAlbumsCount>>,
        TError,
        TData
    > & { queryKey: QueryKey };
};

export type GetApiLibraryIdAlbumsCountSuspenseQueryResult = NonNullable<
    Awaited<ReturnType<typeof getApiLibraryIdAlbumsCount>>
>;
export type GetApiLibraryIdAlbumsCountSuspenseQueryError = ErrorType<
    | GetApiLibraryIdAlbumsCount401
    | GetApiLibraryIdAlbumsCount403
    | GetApiLibraryIdAlbumsCount422
    | GetApiLibraryIdAlbumsCount500
>;

export function useGetApiLibraryIdAlbumsCountSuspense<
    TData = Awaited<ReturnType<typeof getApiLibraryIdAlbumsCount>>,
    TError = ErrorType<
        | GetApiLibraryIdAlbumsCount401
        | GetApiLibraryIdAlbumsCount403
        | GetApiLibraryIdAlbumsCount422
        | GetApiLibraryIdAlbumsCount500
    >,
>(
    libraryId: string,
    params: GetApiLibraryIdAlbumsCountParams,
    options: {
        query: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdAlbumsCount>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: QueryKey };
export function useGetApiLibraryIdAlbumsCountSuspense<
    TData = Awaited<ReturnType<typeof getApiLibraryIdAlbumsCount>>,
    TError = ErrorType<
        | GetApiLibraryIdAlbumsCount401
        | GetApiLibraryIdAlbumsCount403
        | GetApiLibraryIdAlbumsCount422
        | GetApiLibraryIdAlbumsCount500
    >,
>(
    libraryId: string,
    params: GetApiLibraryIdAlbumsCountParams,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdAlbumsCount>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: QueryKey };
export function useGetApiLibraryIdAlbumsCountSuspense<
    TData = Awaited<ReturnType<typeof getApiLibraryIdAlbumsCount>>,
    TError = ErrorType<
        | GetApiLibraryIdAlbumsCount401
        | GetApiLibraryIdAlbumsCount403
        | GetApiLibraryIdAlbumsCount422
        | GetApiLibraryIdAlbumsCount500
    >,
>(
    libraryId: string,
    params: GetApiLibraryIdAlbumsCountParams,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdAlbumsCount>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: QueryKey };
/**
 * @summary Get all albums count
 */

export function useGetApiLibraryIdAlbumsCountSuspense<
    TData = Awaited<ReturnType<typeof getApiLibraryIdAlbumsCount>>,
    TError = ErrorType<
        | GetApiLibraryIdAlbumsCount401
        | GetApiLibraryIdAlbumsCount403
        | GetApiLibraryIdAlbumsCount422
        | GetApiLibraryIdAlbumsCount500
    >,
>(
    libraryId: string,
    params: GetApiLibraryIdAlbumsCountParams,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdAlbumsCount>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: QueryKey } {
    const queryOptions = getGetApiLibraryIdAlbumsCountSuspenseQueryOptions(
        libraryId,
        params,
        options,
    );

    const query = useSuspenseQuery(queryOptions) as UseSuspenseQueryResult<TData, TError> & {
        queryKey: QueryKey;
    };

    query.queryKey = queryOptions.queryKey;

    return query;
}

/**
 * @summary Get album by id
 */
export const getApiLibraryIdAlbumsId = (
    libraryId: string,
    id: string,
    options?: SecondParameter<typeof apiInstance>,
    signal?: AbortSignal,
) => {
    return apiInstance<GetApiLibraryIdAlbumsId200>(
        { url: `/api/${libraryId}/albums/${id}`, method: 'GET', signal },
        options,
    );
};

export const getGetApiLibraryIdAlbumsIdQueryKey = (libraryId: string, id: string) => {
    return [`/api/${libraryId}/albums/${id}`] as const;
};

export const getGetApiLibraryIdAlbumsIdSuspenseQueryOptions = <
    TData = Awaited<ReturnType<typeof getApiLibraryIdAlbumsId>>,
    TError = ErrorType<
        | GetApiLibraryIdAlbumsId401
        | GetApiLibraryIdAlbumsId403
        | GetApiLibraryIdAlbumsId404
        | GetApiLibraryIdAlbumsId500
    >,
>(
    libraryId: string,
    id: string,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdAlbumsId>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
) => {
    const { query: queryOptions, request: requestOptions } = options ?? {};

    const queryKey = queryOptions?.queryKey ?? getGetApiLibraryIdAlbumsIdQueryKey(libraryId, id);

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiLibraryIdAlbumsId>>> = ({
        signal,
    }) => getApiLibraryIdAlbumsId(libraryId, id, requestOptions, signal);

    return {
        queryKey,
        queryFn,
        enabled: !!(libraryId && id),
        staleTime: 10000,
        ...queryOptions,
    } as UseSuspenseQueryOptions<
        Awaited<ReturnType<typeof getApiLibraryIdAlbumsId>>,
        TError,
        TData
    > & { queryKey: QueryKey };
};

export type GetApiLibraryIdAlbumsIdSuspenseQueryResult = NonNullable<
    Awaited<ReturnType<typeof getApiLibraryIdAlbumsId>>
>;
export type GetApiLibraryIdAlbumsIdSuspenseQueryError = ErrorType<
    | GetApiLibraryIdAlbumsId401
    | GetApiLibraryIdAlbumsId403
    | GetApiLibraryIdAlbumsId404
    | GetApiLibraryIdAlbumsId500
>;

export function useGetApiLibraryIdAlbumsIdSuspense<
    TData = Awaited<ReturnType<typeof getApiLibraryIdAlbumsId>>,
    TError = ErrorType<
        | GetApiLibraryIdAlbumsId401
        | GetApiLibraryIdAlbumsId403
        | GetApiLibraryIdAlbumsId404
        | GetApiLibraryIdAlbumsId500
    >,
>(
    libraryId: string,
    id: string,
    options: {
        query: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdAlbumsId>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: QueryKey };
export function useGetApiLibraryIdAlbumsIdSuspense<
    TData = Awaited<ReturnType<typeof getApiLibraryIdAlbumsId>>,
    TError = ErrorType<
        | GetApiLibraryIdAlbumsId401
        | GetApiLibraryIdAlbumsId403
        | GetApiLibraryIdAlbumsId404
        | GetApiLibraryIdAlbumsId500
    >,
>(
    libraryId: string,
    id: string,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdAlbumsId>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: QueryKey };
export function useGetApiLibraryIdAlbumsIdSuspense<
    TData = Awaited<ReturnType<typeof getApiLibraryIdAlbumsId>>,
    TError = ErrorType<
        | GetApiLibraryIdAlbumsId401
        | GetApiLibraryIdAlbumsId403
        | GetApiLibraryIdAlbumsId404
        | GetApiLibraryIdAlbumsId500
    >,
>(
    libraryId: string,
    id: string,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdAlbumsId>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: QueryKey };
/**
 * @summary Get album by id
 */

export function useGetApiLibraryIdAlbumsIdSuspense<
    TData = Awaited<ReturnType<typeof getApiLibraryIdAlbumsId>>,
    TError = ErrorType<
        | GetApiLibraryIdAlbumsId401
        | GetApiLibraryIdAlbumsId403
        | GetApiLibraryIdAlbumsId404
        | GetApiLibraryIdAlbumsId500
    >,
>(
    libraryId: string,
    id: string,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdAlbumsId>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: QueryKey } {
    const queryOptions = getGetApiLibraryIdAlbumsIdSuspenseQueryOptions(libraryId, id, options);

    const query = useSuspenseQuery(queryOptions) as UseSuspenseQueryResult<TData, TError> & {
        queryKey: QueryKey;
    };

    query.queryKey = queryOptions.queryKey;

    return query;
}

/**
 * @summary Get album tracks by id
 */
export const getApiLibraryIdAlbumsIdTracks = (
    libraryId: string,
    id: string,
    params: GetApiLibraryIdAlbumsIdTracksParams,
    options?: SecondParameter<typeof apiInstance>,
    signal?: AbortSignal,
) => {
    return apiInstance<GetApiLibraryIdAlbumsIdTracks200>(
        { url: `/api/${libraryId}/albums/${id}/tracks`, method: 'GET', params, signal },
        options,
    );
};

export const getGetApiLibraryIdAlbumsIdTracksQueryKey = (
    libraryId: string,
    id: string,
    params: GetApiLibraryIdAlbumsIdTracksParams,
) => {
    return [`/api/${libraryId}/albums/${id}/tracks`, ...(params ? [params] : [])] as const;
};

export const getGetApiLibraryIdAlbumsIdTracksSuspenseQueryOptions = <
    TData = Awaited<ReturnType<typeof getApiLibraryIdAlbumsIdTracks>>,
    TError = ErrorType<
        | GetApiLibraryIdAlbumsIdTracks401
        | GetApiLibraryIdAlbumsIdTracks403
        | GetApiLibraryIdAlbumsIdTracks404
        | GetApiLibraryIdAlbumsIdTracks422
        | GetApiLibraryIdAlbumsIdTracks500
    >,
>(
    libraryId: string,
    id: string,
    params: GetApiLibraryIdAlbumsIdTracksParams,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdAlbumsIdTracks>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
) => {
    const { query: queryOptions, request: requestOptions } = options ?? {};

    const queryKey =
        queryOptions?.queryKey ?? getGetApiLibraryIdAlbumsIdTracksQueryKey(libraryId, id, params);

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiLibraryIdAlbumsIdTracks>>> = ({
        signal,
    }) => getApiLibraryIdAlbumsIdTracks(libraryId, id, params, requestOptions, signal);

    return {
        queryKey,
        queryFn,
        enabled: !!(libraryId && id),
        staleTime: 10000,
        ...queryOptions,
    } as UseSuspenseQueryOptions<
        Awaited<ReturnType<typeof getApiLibraryIdAlbumsIdTracks>>,
        TError,
        TData
    > & { queryKey: QueryKey };
};

export type GetApiLibraryIdAlbumsIdTracksSuspenseQueryResult = NonNullable<
    Awaited<ReturnType<typeof getApiLibraryIdAlbumsIdTracks>>
>;
export type GetApiLibraryIdAlbumsIdTracksSuspenseQueryError = ErrorType<
    | GetApiLibraryIdAlbumsIdTracks401
    | GetApiLibraryIdAlbumsIdTracks403
    | GetApiLibraryIdAlbumsIdTracks404
    | GetApiLibraryIdAlbumsIdTracks422
    | GetApiLibraryIdAlbumsIdTracks500
>;

export function useGetApiLibraryIdAlbumsIdTracksSuspense<
    TData = Awaited<ReturnType<typeof getApiLibraryIdAlbumsIdTracks>>,
    TError = ErrorType<
        | GetApiLibraryIdAlbumsIdTracks401
        | GetApiLibraryIdAlbumsIdTracks403
        | GetApiLibraryIdAlbumsIdTracks404
        | GetApiLibraryIdAlbumsIdTracks422
        | GetApiLibraryIdAlbumsIdTracks500
    >,
>(
    libraryId: string,
    id: string,
    params: GetApiLibraryIdAlbumsIdTracksParams,
    options: {
        query: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdAlbumsIdTracks>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: QueryKey };
export function useGetApiLibraryIdAlbumsIdTracksSuspense<
    TData = Awaited<ReturnType<typeof getApiLibraryIdAlbumsIdTracks>>,
    TError = ErrorType<
        | GetApiLibraryIdAlbumsIdTracks401
        | GetApiLibraryIdAlbumsIdTracks403
        | GetApiLibraryIdAlbumsIdTracks404
        | GetApiLibraryIdAlbumsIdTracks422
        | GetApiLibraryIdAlbumsIdTracks500
    >,
>(
    libraryId: string,
    id: string,
    params: GetApiLibraryIdAlbumsIdTracksParams,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdAlbumsIdTracks>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: QueryKey };
export function useGetApiLibraryIdAlbumsIdTracksSuspense<
    TData = Awaited<ReturnType<typeof getApiLibraryIdAlbumsIdTracks>>,
    TError = ErrorType<
        | GetApiLibraryIdAlbumsIdTracks401
        | GetApiLibraryIdAlbumsIdTracks403
        | GetApiLibraryIdAlbumsIdTracks404
        | GetApiLibraryIdAlbumsIdTracks422
        | GetApiLibraryIdAlbumsIdTracks500
    >,
>(
    libraryId: string,
    id: string,
    params: GetApiLibraryIdAlbumsIdTracksParams,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdAlbumsIdTracks>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: QueryKey };
/**
 * @summary Get album tracks by id
 */

export function useGetApiLibraryIdAlbumsIdTracksSuspense<
    TData = Awaited<ReturnType<typeof getApiLibraryIdAlbumsIdTracks>>,
    TError = ErrorType<
        | GetApiLibraryIdAlbumsIdTracks401
        | GetApiLibraryIdAlbumsIdTracks403
        | GetApiLibraryIdAlbumsIdTracks404
        | GetApiLibraryIdAlbumsIdTracks422
        | GetApiLibraryIdAlbumsIdTracks500
    >,
>(
    libraryId: string,
    id: string,
    params: GetApiLibraryIdAlbumsIdTracksParams,
    options?: {
        query?: Partial<
            UseSuspenseQueryOptions<
                Awaited<ReturnType<typeof getApiLibraryIdAlbumsIdTracks>>,
                TError,
                TData
            >
        >;
        request?: SecondParameter<typeof apiInstance>;
    },
): UseSuspenseQueryResult<TData, TError> & { queryKey: QueryKey } {
    const queryOptions = getGetApiLibraryIdAlbumsIdTracksSuspenseQueryOptions(
        libraryId,
        id,
        params,
        options,
    );

    const query = useSuspenseQuery(queryOptions) as UseSuspenseQueryResult<TData, TError> & {
        queryKey: QueryKey;
    };

    query.queryKey = queryOptions.queryKey;

    return query;
}

/**
 * @summary Add album favorite by id
 */
export const postApiLibraryIdAlbumsIdFavorite = (
    libraryId: string,
    id: string,
    options?: SecondParameter<typeof apiInstance>,
) => {
    return apiInstance<PostApiLibraryIdAlbumsIdFavorite204>(
        { url: `/api/${libraryId}/albums/${id}/favorite`, method: 'POST' },
        options,
    );
};

export const getPostApiLibraryIdAlbumsIdFavoriteMutationOptions = <
    TError = ErrorType<
        | PostApiLibraryIdAlbumsIdFavorite401
        | PostApiLibraryIdAlbumsIdFavorite403
        | PostApiLibraryIdAlbumsIdFavorite404
        | PostApiLibraryIdAlbumsIdFavorite500
    >,
    TContext = unknown,
>(options?: {
    mutation?: UseMutationOptions<
        Awaited<ReturnType<typeof postApiLibraryIdAlbumsIdFavorite>>,
        TError,
        { libraryId: string; id: string },
        TContext
    >;
    request?: SecondParameter<typeof apiInstance>;
}): UseMutationOptions<
    Awaited<ReturnType<typeof postApiLibraryIdAlbumsIdFavorite>>,
    TError,
    { libraryId: string; id: string },
    TContext
> => {
    const { mutation: mutationOptions, request: requestOptions } = options ?? {};

    const mutationFn: MutationFunction<
        Awaited<ReturnType<typeof postApiLibraryIdAlbumsIdFavorite>>,
        { libraryId: string; id: string }
    > = (props) => {
        const { libraryId, id } = props ?? {};

        return postApiLibraryIdAlbumsIdFavorite(libraryId, id, requestOptions);
    };

    return { mutationFn, ...mutationOptions };
};

export type PostApiLibraryIdAlbumsIdFavoriteMutationResult = NonNullable<
    Awaited<ReturnType<typeof postApiLibraryIdAlbumsIdFavorite>>
>;

export type PostApiLibraryIdAlbumsIdFavoriteMutationError = ErrorType<
    | PostApiLibraryIdAlbumsIdFavorite401
    | PostApiLibraryIdAlbumsIdFavorite403
    | PostApiLibraryIdAlbumsIdFavorite404
    | PostApiLibraryIdAlbumsIdFavorite500
>;

/**
 * @summary Add album favorite by id
 */
export const usePostApiLibraryIdAlbumsIdFavorite = <
    TError = ErrorType<
        | PostApiLibraryIdAlbumsIdFavorite401
        | PostApiLibraryIdAlbumsIdFavorite403
        | PostApiLibraryIdAlbumsIdFavorite404
        | PostApiLibraryIdAlbumsIdFavorite500
    >,
    TContext = unknown,
>(options?: {
    mutation?: UseMutationOptions<
        Awaited<ReturnType<typeof postApiLibraryIdAlbumsIdFavorite>>,
        TError,
        { libraryId: string; id: string },
        TContext
    >;
    request?: SecondParameter<typeof apiInstance>;
}): UseMutationResult<
    Awaited<ReturnType<typeof postApiLibraryIdAlbumsIdFavorite>>,
    TError,
    { libraryId: string; id: string },
    TContext
> => {
    const mutationOptions = getPostApiLibraryIdAlbumsIdFavoriteMutationOptions(options);

    return useMutation(mutationOptions);
};
/**
 * @summary Remove album favorite by id
 */
export const deleteApiLibraryIdAlbumsIdFavorite = (
    libraryId: string,
    id: string,
    options?: SecondParameter<typeof apiInstance>,
) => {
    return apiInstance<DeleteApiLibraryIdAlbumsIdFavorite204>(
        { url: `/api/${libraryId}/albums/${id}/favorite`, method: 'DELETE' },
        options,
    );
};

export const getDeleteApiLibraryIdAlbumsIdFavoriteMutationOptions = <
    TError = ErrorType<
        | DeleteApiLibraryIdAlbumsIdFavorite401
        | DeleteApiLibraryIdAlbumsIdFavorite403
        | DeleteApiLibraryIdAlbumsIdFavorite404
        | DeleteApiLibraryIdAlbumsIdFavorite500
    >,
    TContext = unknown,
>(options?: {
    mutation?: UseMutationOptions<
        Awaited<ReturnType<typeof deleteApiLibraryIdAlbumsIdFavorite>>,
        TError,
        { libraryId: string; id: string },
        TContext
    >;
    request?: SecondParameter<typeof apiInstance>;
}): UseMutationOptions<
    Awaited<ReturnType<typeof deleteApiLibraryIdAlbumsIdFavorite>>,
    TError,
    { libraryId: string; id: string },
    TContext
> => {
    const { mutation: mutationOptions, request: requestOptions } = options ?? {};

    const mutationFn: MutationFunction<
        Awaited<ReturnType<typeof deleteApiLibraryIdAlbumsIdFavorite>>,
        { libraryId: string; id: string }
    > = (props) => {
        const { libraryId, id } = props ?? {};

        return deleteApiLibraryIdAlbumsIdFavorite(libraryId, id, requestOptions);
    };

    return { mutationFn, ...mutationOptions };
};

export type DeleteApiLibraryIdAlbumsIdFavoriteMutationResult = NonNullable<
    Awaited<ReturnType<typeof deleteApiLibraryIdAlbumsIdFavorite>>
>;

export type DeleteApiLibraryIdAlbumsIdFavoriteMutationError = ErrorType<
    | DeleteApiLibraryIdAlbumsIdFavorite401
    | DeleteApiLibraryIdAlbumsIdFavorite403
    | DeleteApiLibraryIdAlbumsIdFavorite404
    | DeleteApiLibraryIdAlbumsIdFavorite500
>;

/**
 * @summary Remove album favorite by id
 */
export const useDeleteApiLibraryIdAlbumsIdFavorite = <
    TError = ErrorType<
        | DeleteApiLibraryIdAlbumsIdFavorite401
        | DeleteApiLibraryIdAlbumsIdFavorite403
        | DeleteApiLibraryIdAlbumsIdFavorite404
        | DeleteApiLibraryIdAlbumsIdFavorite500
    >,
    TContext = unknown,
>(options?: {
    mutation?: UseMutationOptions<
        Awaited<ReturnType<typeof deleteApiLibraryIdAlbumsIdFavorite>>,
        TError,
        { libraryId: string; id: string },
        TContext
    >;
    request?: SecondParameter<typeof apiInstance>;
}): UseMutationResult<
    Awaited<ReturnType<typeof deleteApiLibraryIdAlbumsIdFavorite>>,
    TError,
    { libraryId: string; id: string },
    TContext
> => {
    const mutationOptions = getDeleteApiLibraryIdAlbumsIdFavoriteMutationOptions(options);

    return useMutation(mutationOptions);
};
