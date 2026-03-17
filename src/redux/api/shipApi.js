import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const shipmentApi = createApi({
  reducerPath: "shipmentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Shipments", "Alerts", "User"],

  endpoints: (builder) => ({
    //  Auth
    register: builder.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),

    login: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),

    getMe: builder.query({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),

    getAllUsers: builder.query({
      query: () => "/auth/users",
      providesTags: ["User"],
    }),

    // Shipments
    getShipments: builder.query({
      query: () => "/shipments/",
      providesTags: ["Shipments"],
    }),

    createShipment: builder.mutation({
      query: (body) => ({
        url: "/shipments/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Shipments"],
    }),

    deleteShipment: builder.mutation({
      query: (shipmentId) => ({
        url: `/shipments/${shipmentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Shipments"],
    }),

    // Analysis
    analyzeShipment: builder.mutation({
      query: (shipmentId) => ({
        url: `/analyze/${shipmentId}`,
        method: "POST",
      }),
      invalidatesTags: ["Shipments", "Alerts"],
    }),

    // Alerts
    getAlerts: builder.query({
      query: () => "/alerts/",
      providesTags: ["Alerts"],
    }),

    getShipmentsByUser: builder.query({
      query: (userId) => `/shipments/user/${userId}`,
      providesTags: ["Shipments"],
    }),

    // Delivery Partner endpoints
    getAllPartners: builder.query({
      query: () => "/partners/",
      providesTags: ["Partners"],
    }),

    createPartner: builder.mutation({
      query: (body) => ({
        url: "/partners/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Partners"],
    }),

    assignPartner: builder.mutation({
      query: ({ shipmentId, partnerId }) => ({
        url: `/partners/assign/${shipmentId}?partner_id=${partnerId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Shipments"],
    }),

    partnerLogin: builder.mutation({
      query: (body) => ({
        url: "/partners/login",
        method: "POST",
        body,
      }),
    }),

    getMyShipments: builder.query({
      query: () => "/partners/my-shipments",
      providesTags: ["Shipments"],
    }),

    //  Simulate
    simulateDisruption: builder.mutation({
      query: (shipmentId) => ({
        url: `/simulate/disruption/${shipmentId}`,
        method: "POST",
      }),
      invalidatesTags: ["Shipments", "Alerts"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetAllUsersQuery,
  useGetMeQuery,
  useGetShipmentsQuery,
  useCreateShipmentMutation,
  useDeleteShipmentMutation,
  useGetShipmentsByUserQuery,
  useAnalyzeShipmentMutation,
  useGetAlertsQuery,
  useSimulateDisruptionMutation,
  useGetAllPartnersQuery,
  useCreatePartnerMutation,
  useAssignPartnerMutation,
  usePartnerLoginMutation,
  useGetMyShipmentsQuery,
} = shipmentApi;
