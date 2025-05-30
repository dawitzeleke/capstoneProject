const axios = require('axios')

// Setup Axios Instance
const API_BASE_URL = 'https://cognify-d5we.onrender.com/api'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
  },
})

// Auth Token Setter (optional global use, not used in this test)
const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete axiosInstance.defaults.headers.common['Authorization']
  }
}

// Local httpRequest Function
const httpRequest = async (endpoint, data = {}, method = 'POST', config = {}) => {
  try {
    const response = await axiosInstance.request({
      url: endpoint,
      method,
      data,
      ...config,
    })

    return response.data
  } catch (error) {
    console.error('Axios Error:', error.response?.data || error.message)
    throw error
  }
}

// ---------- Tests ----------
describe('Teacher List End-to-End', () => {
  let token = ''

  it('should log in and get a valid token', async () => {
    const loginPayload = new URLSearchParams()
    loginPayload.append('Email', 'dawitadmin4@gmail.com')
    loginPayload.append('Password', '1qa2ws3ed')
    let loginRes
    try {
      loginRes = await httpRequest('/auth/signin', loginPayload, 'POST', {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
    } catch (err) {
      loginRes = await httpRequest('/auth/login', loginPayload, 'POST', {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
    }
    expect(loginRes).toHaveProperty('token')
    token = loginRes.token
  })

  it('should fetch all teachers using the login token', async () => {
    expect(token).not.toBe('') // ensure login step succeeded
    const headers = { Authorization: `Bearer ${token}` }
    const data = await httpRequest('/admin/get-teachers', {}, 'GET', { headers })
    expect(Array.isArray(data)).toBe(true)
    if (data.length > 0) {
      expect(data[0]).toHaveProperty('id')
      expect(data[0]).toHaveProperty('firstName')
      expect(data[0]).toHaveProperty('lastName')
      expect(data[0]).toHaveProperty('email')
    }
  })
})
