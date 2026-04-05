import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { Photo, Profile, UploadPayload } from "@/types";

export const photosApi = createApi({
  reducerPath: "photosApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Photos", "UserPhotos", "Profile"],
  endpoints: (builder) => ({
    getPhotos: builder.query<Photo[], void>({
      query: () => "/photos",
      providesTags: ["Photos"],
    }),
    getUserPhotos: builder.query<Photo[], string>({
      query: (username) => `/photos?username=${encodeURIComponent(username)}`,
      providesTags: (_result, _error, username) => [{ type: "UserPhotos", id: username }],
    }),
    uploadPhoto: builder.mutation<Photo, UploadPayload>({
      query: (payload) => ({
        url: "/upload",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Photos"],
    }),
    updatePhoto: builder.mutation<Photo, { id: string; photoName: string; username: string }>({
      query: ({ id, photoName }) => ({
        url: `/photos/${id}`,
        method: "PATCH",
        body: { photoName },
      }),
      invalidatesTags: (_result, _error, { username }) => [
        "Photos",
        { type: "UserPhotos", id: username },
      ],
    }),
    deletePhoto: builder.mutation<{ success: boolean }, { id: string; username: string }>({
      query: ({ id }) => ({
        url: `/photos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { username }) => [
        "Photos",
        { type: "UserPhotos", id: username },
      ],
    }),
    getProfile: builder.query<Profile | null, void>({
      query: () => "/profile",
      providesTags: ["Profile"],
    }),
    updateDisplayName: builder.mutation<Profile, { displayName: string }>({
      query: (body) => ({
        url: "/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetPhotosQuery,
  useGetUserPhotosQuery,
  useUploadPhotoMutation,
  useUpdatePhotoMutation,
  useDeletePhotoMutation,
  useGetProfileQuery,
  useUpdateDisplayNameMutation,
} = photosApi;
