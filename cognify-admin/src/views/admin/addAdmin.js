import React, { useState } from 'react'
import { CCard, CCardBody, CCardHeader, CForm, CFormInput, CFormSelect, CButton } from '@coreui/react'

const AddAdmin = () => {
  const [adminName, setAdminName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Logic for adding admin goes here, e.g., API call to submit form
    console.log({ adminName, email, role })
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
    </CCard>
  )
}

export default AddAdmin
