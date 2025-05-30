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

describe('Verify Teacher End-to-End', () => {
  let token = ''
  let teacherId = ''

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
    expect(token).not.toBe('')
    const headers = { Authorization: `Bearer ${token}` }
    const data = await httpRequest('/admin/get-teachers', {}, 'GET', { headers })
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
    teacherId = data[0].id
    expect(teacherId).toBeTruthy()
  })

  it('should verify the first teacher', async () => {
    expect(token).not.toBe('')
    expect(teacherId).not.toBe('')
    const headers = { Authorization: `Bearer ${token}` }
    const payload = { teacherId }
    const res = await httpRequest('/admin/verify-teacher', payload, 'PATCH', { headers })
    expect(res).toHaveProperty('status', 'Success')
    expect(res).toHaveProperty('message', 'Teacher verified successfully')
    expect(res).toHaveProperty('teacherId', teacherId)
  })
})
