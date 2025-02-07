import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const metaBaseQuery = async (args, api, extraOptions) => {
  const baseResult = await fetchBaseQuery({
    prepareHeaders: headers => {
      headers.set('Content-Type', 'application/json')
      return headers
    }
  })(args, api, extraOptions)

  return baseResult
}

export const customersApi = createApi({
  baseQuery: metaBaseQuery,
  tagTypes: ['Post'],
  endpoints: builder => ({
    getCustomers: builder.query({
      query: () => { return { url: 'https://vital-backoffice-apps-backend-development-mongodb.up.railway.app/api/customers', method: 'GET'}},
      transformResponse: (returnValue, meta) => {
        return returnValue
      }
    })
  })
})

export const { useGetCustomersQuery } = customersApi