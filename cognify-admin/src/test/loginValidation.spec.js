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
    if (error.response) return error.response.data
    throw error
  }
}

describe('Login Validation', () => {
  it('should fail when email is missing', async () => {
    const loginPayload = new URLSearchParams()
    loginPayload.append('Password', '1qa2ws3ed')
    const res = await httpRequest('/auth/signin', loginPayload, 'POST', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    expect(res).toHaveProperty('status')
    expect(res.status).not.toBe('Success')
    expect(res).toHaveProperty('errors')
    expect(res.errors).toHaveProperty('Email')
  })

  it('should fail when password is missing', async () => {
    const loginPayload = new URLSearchParams()
    loginPayload.append('Email', 'dawitadmin4@gmail.com')
    const res = await httpRequest('/auth/signin', loginPayload, 'POST', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    expect(res).toHaveProperty('status')
    expect(res.status).not.toBe('Success')
    expect(res).toHaveProperty('errors')
    expect(res.errors).toHaveProperty('Password')
  })

  it('should fail when email is in invalid format', async () => {
    const loginPayload = new URLSearchParams()
    loginPayload.append('Email', 'notanemail')
    loginPayload.append('Password', '1qa2ws3ed')
    const res = await httpRequest('/auth/signin', loginPayload, 'POST', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    // Accept either validation error or invalid credentials error
    if (res.errors && res.errors.Email) {
      expect(res.errors).toHaveProperty('Email')
    } else {
      expect(res).toHaveProperty('Message', 'Invalid credentials.')
      expect(res).toHaveProperty('Status', 500)
    }
  })

  it('should fail when password is too short', async () => {
    const loginPayload = new URLSearchParams()
    loginPayload.append('Email', 'dawitadmin4@gmail.com')
    loginPayload.append('Password', '12')
    const res = await httpRequest('/auth/signin', loginPayload, 'POST', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    // Accept either validation error or invalid credentials error
    if (res.errors && res.errors.Password) {
      expect(res.errors).toHaveProperty('Password')
    } else {
      expect(res).toHaveProperty('Message', 'Invalid credentials.')
      expect(res).toHaveProperty('Status', 500)
    }
  })
})
