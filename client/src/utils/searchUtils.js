let resources = {}
import axios from 'axios'

const makeRequestCreator = () => {
  let cancel

  return async (query) => {
    if (cancel) {
      // Cancel the previous request before making a new request
      cancel.cancel()
    }
    // Create a new CancelToken
    cancel = axios.CancelToken.source()
    try {
      if (resources[query]) {
        // Return result if it exists
        return resources[query]
      }
      const res = await axios(query, { cancelToken: cancel.token })

      const result = res.data
      console.log('res::: ', res)
      console.log('result::: ', result)
      // Store response
      resources[query] = result

      return result
    } catch (error) {
      if (axios.isCancel(error)) {
        // Handle if request was cancelled
        console.log('Request canceled', error.message)
      } else {
        console.log('Something went wrong: ', error.response.data.message)
        throw new Error(error.response.data.message)
        // Handle usual errors
      }
    }
  }
}

export const search = makeRequestCreator()
export const clearResource = () => (resources = {})
