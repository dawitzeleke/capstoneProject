import React, { useState } from 'react'
import { CCard, CCardBody, CCardHeader, CForm, CFormInput, CFormSelect, CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react'
import { httpRequest } from '../../util/httpRequest'
import { useSelector } from 'react-redux'

const AddAdmin = () => {
  const [adminName, setAdminName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [modalError, setModalError] = useState(false)

  const { authenticatedUser } = useSelector((state) => state.auth)
  const token = authenticatedUser?.token

  const handleSubmit = async (e) => {
    e.preventDefault()
    setModalError(false)
    try {
      const payload = {
        firstName: adminName.split(' ')[0] || '',
        lastName: adminName.split(' ').slice(1).join(' ') || '',
        email,
        phoneNumber,
        role,
      }
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await httpRequest('/admin/invite-admin', payload, 'POST', { headers })
      setModalMessage('Admin invited successfully!')
      setModalVisible(true)
    } catch (err) {
      setModalMessage('Failed to invite admin. Please try again.')
      setModalError(true)
      setModalVisible(true)
    }
  }

  return (
    <CCard>
      <CCardHeader>
        <h4>Add New Admin</h4>
      </CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          <CFormInput
            type="text"
            label="Admin Name"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            required
          />
          <CFormInput
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <CFormInput
            type="text"
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <CFormSelect
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="superAdmin">Super Admin</option>
          </CFormSelect>
          <CButton color="primary" type="submit" className="mt-3">
            Add Admin
          </CButton>
        </CForm>
      </CCardBody>
      <CModal alignment="center" visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>{modalError ? 'Error' : 'Success'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {modalMessage}
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  )
}

export default AddAdmin
