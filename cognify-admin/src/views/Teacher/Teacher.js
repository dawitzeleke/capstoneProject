import React, { useState } from 'react'
import { CCard, CCardHeader, CCardBody, CForm, CFormInput, CFormTextarea, CButton } from '@coreui/react'

const Teacher = () => {
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ name, bio }) // Replace with actual backend call
  }

  return (
    <CCard>
      <CCardHeader>
        <h4>Add Teacher</h4>
      </CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          <CFormInput
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <CFormTextarea
            label="Short Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            required
          />
          <CButton type="submit" color="primary" className="mt-3">
            Submit
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default Teacher
