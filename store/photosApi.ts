import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Photo, UploadPayload } from '@/types';

export const photosApi = createApi({
  reducerPath: 'photosApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Photos'],
  endpoints: (builder) => ({
    getPhotos: builder.query<Photo[], void>({
      query: () => '/photos',
      providesTags: ['Photos'],
    }),
    uploadPhoto: builder.mutation<Photo, UploadPayload>({
      query: (payload) => ({
        url: '/upload',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Photos'],
    }),
  }),
});

export const { useGetPhotosQuery, useUploadPhotoMutation } = photosApi;
