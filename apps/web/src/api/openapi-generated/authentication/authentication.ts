/**
 * Generated by orval v7.1.1 🍺
 * Do not edit manually.
 * Audioling API
 * OpenAPI spec version: 1.0.0
 */
import { useMutation } from '@tanstack/react-query';
import type {
    MutationFunction,
    UseMutationOptions,
    UseMutationResult,
} from '@tanstack/react-query';
import axios from 'axios';
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import type {
    PostAuthRegister204,
    PostAuthRegister500,
    PostAuthRegisterBody,
    PostAuthSignIn200,
    PostAuthSignIn401,
    PostAuthSignIn500,
    PostAuthSignInBody,
    PostAuthSignOut204,
    PostAuthSignOut401,
    PostAuthSignOut500,
    PostAuthSignOutBody,
} from '../audioling-openapi-client.schemas.ts';

/**
 * @summary Sign in
 */
export const postAuthSignIn = (
    postAuthSignInBody: PostAuthSignInBody,
    options?: AxiosRequestConfig,
): Promise<AxiosResponse<PostAuthSignIn200>> => {
    return axios.post(`/auth/sign-in`, postAuthSignInBody, options);
};

export const getPostAuthSignInMutationOptions = <
    TError = AxiosError<PostAuthSignIn401 | PostAuthSignIn500>,
    TContext = unknown,
>(options?: {
    axios?: AxiosRequestConfig;
    mutation?: UseMutationOptions<
        Awaited<ReturnType<typeof postAuthSignIn>>,
        TError,
        { data: PostAuthSignInBody },
        TContext
    >;
}): UseMutationOptions<
    Awaited<ReturnType<typeof postAuthSignIn>>,
    TError,
    { data: PostAuthSignInBody },
    TContext
> => {
    const { mutation: mutationOptions, axios: axiosOptions } = options ?? {};

    const mutationFn: MutationFunction<
        Awaited<ReturnType<typeof postAuthSignIn>>,
        { data: PostAuthSignInBody }
    > = (props) => {
        const { data } = props ?? {};

        return postAuthSignIn(data, axiosOptions);
    };

    return { mutationFn, ...mutationOptions };
};

export type PostAuthSignInMutationResult = NonNullable<Awaited<ReturnType<typeof postAuthSignIn>>>;
export type PostAuthSignInMutationBody = PostAuthSignInBody;
export type PostAuthSignInMutationError = AxiosError<PostAuthSignIn401 | PostAuthSignIn500>;

/**
 * @summary Sign in
 */
export const usePostAuthSignIn = <
    TError = AxiosError<PostAuthSignIn401 | PostAuthSignIn500>,
    TContext = unknown,
>(options?: {
    axios?: AxiosRequestConfig;
    mutation?: UseMutationOptions<
        Awaited<ReturnType<typeof postAuthSignIn>>,
        TError,
        { data: PostAuthSignInBody },
        TContext
    >;
}): UseMutationResult<
    Awaited<ReturnType<typeof postAuthSignIn>>,
    TError,
    { data: PostAuthSignInBody },
    TContext
> => {
    const mutationOptions = getPostAuthSignInMutationOptions(options);

    return useMutation(mutationOptions);
};
/**
 * @summary Sign out
 */
export const postAuthSignOut = (
    postAuthSignOutBody: PostAuthSignOutBody,
    options?: AxiosRequestConfig,
): Promise<AxiosResponse<PostAuthSignOut204>> => {
    return axios.post(`/auth/sign-out`, postAuthSignOutBody, options);
};

export const getPostAuthSignOutMutationOptions = <
    TError = AxiosError<PostAuthSignOut401 | PostAuthSignOut500>,
    TContext = unknown,
>(options?: {
    axios?: AxiosRequestConfig;
    mutation?: UseMutationOptions<
        Awaited<ReturnType<typeof postAuthSignOut>>,
        TError,
        { data: PostAuthSignOutBody },
        TContext
    >;
}): UseMutationOptions<
    Awaited<ReturnType<typeof postAuthSignOut>>,
    TError,
    { data: PostAuthSignOutBody },
    TContext
> => {
    const { mutation: mutationOptions, axios: axiosOptions } = options ?? {};

    const mutationFn: MutationFunction<
        Awaited<ReturnType<typeof postAuthSignOut>>,
        { data: PostAuthSignOutBody }
    > = (props) => {
        const { data } = props ?? {};

        return postAuthSignOut(data, axiosOptions);
    };

    return { mutationFn, ...mutationOptions };
};

export type PostAuthSignOutMutationResult = NonNullable<
    Awaited<ReturnType<typeof postAuthSignOut>>
>;
export type PostAuthSignOutMutationBody = PostAuthSignOutBody;
export type PostAuthSignOutMutationError = AxiosError<PostAuthSignOut401 | PostAuthSignOut500>;

/**
 * @summary Sign out
 */
export const usePostAuthSignOut = <
    TError = AxiosError<PostAuthSignOut401 | PostAuthSignOut500>,
    TContext = unknown,
>(options?: {
    axios?: AxiosRequestConfig;
    mutation?: UseMutationOptions<
        Awaited<ReturnType<typeof postAuthSignOut>>,
        TError,
        { data: PostAuthSignOutBody },
        TContext
    >;
}): UseMutationResult<
    Awaited<ReturnType<typeof postAuthSignOut>>,
    TError,
    { data: PostAuthSignOutBody },
    TContext
> => {
    const mutationOptions = getPostAuthSignOutMutationOptions(options);

    return useMutation(mutationOptions);
};
/**
 * @summary Register
 */
export const postAuthRegister = (
    postAuthRegisterBody: PostAuthRegisterBody,
    options?: AxiosRequestConfig,
): Promise<AxiosResponse<PostAuthRegister204>> => {
    return axios.post(`/auth/register`, postAuthRegisterBody, options);
};

export const getPostAuthRegisterMutationOptions = <
    TError = AxiosError<PostAuthRegister500>,
    TContext = unknown,
>(options?: {
    axios?: AxiosRequestConfig;
    mutation?: UseMutationOptions<
        Awaited<ReturnType<typeof postAuthRegister>>,
        TError,
        { data: PostAuthRegisterBody },
        TContext
    >;
}): UseMutationOptions<
    Awaited<ReturnType<typeof postAuthRegister>>,
    TError,
    { data: PostAuthRegisterBody },
    TContext
> => {
    const { mutation: mutationOptions, axios: axiosOptions } = options ?? {};

    const mutationFn: MutationFunction<
        Awaited<ReturnType<typeof postAuthRegister>>,
        { data: PostAuthRegisterBody }
    > = (props) => {
        const { data } = props ?? {};

        return postAuthRegister(data, axiosOptions);
    };

    return { mutationFn, ...mutationOptions };
};

export type PostAuthRegisterMutationResult = NonNullable<
    Awaited<ReturnType<typeof postAuthRegister>>
>;
export type PostAuthRegisterMutationBody = PostAuthRegisterBody;
export type PostAuthRegisterMutationError = AxiosError<PostAuthRegister500>;

/**
 * @summary Register
 */
export const usePostAuthRegister = <
    TError = AxiosError<PostAuthRegister500>,
    TContext = unknown,
>(options?: {
    axios?: AxiosRequestConfig;
    mutation?: UseMutationOptions<
        Awaited<ReturnType<typeof postAuthRegister>>,
        TError,
        { data: PostAuthRegisterBody },
        TContext
    >;
}): UseMutationResult<
    Awaited<ReturnType<typeof postAuthRegister>>,
    TError,
    { data: PostAuthRegisterBody },
    TContext
> => {
    const mutationOptions = getPostAuthRegisterMutationOptions(options);

    return useMutation(mutationOptions);
};
