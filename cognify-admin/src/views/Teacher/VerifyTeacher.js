import React, { useState } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CButton,
} from '@coreui/react'
import TeacherDetail from './TeacherDetail'
const sampleTeachers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    degree: 'M.Ed.',
    subject: 'Math',
    status: 'pending',
    pdfUrl: 'https://example.com/path/to/teacher-certificate.pdf', // public folder
  },
]

const VerifyTeacher = () => {
  const [teachers, setTeachers] = useState(sampleTeachers)
  const [selectedTeacher, setSelectedTeacher] = useState(null)

  const handleVerify = (id) => {
    setTeachers((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'verified' } : t)))
    setSelectedTeacher(null) // Go back to list
  }

  if (selectedTeacher) {
    return (
      <TeacherDetail
        teacher={selectedTeacher}
        onBack={() => setSelectedTeacher(null)}
        onVerify={handleVerify}
      />
    )
  }

  return (
    <CCard>
      <CCardHeader>
        <h4>Verify Teachers</h4>
      </CCardHeader>
      <CCardBody>
        <CTable hover>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {teachers.map((teacher) => (
              <CTableRow key={teacher.id}>
                <CTableDataCell>{teacher.name}</CTableDataCell>
                <CTableDataCell>{teacher.email}</CTableDataCell>
                <CTableDataCell>{teacher.status}</CTableDataCell>
                <CTableDataCell>
                  <CButton size="sm" onClick={() => setSelectedTeacher(teacher)}>
                    View
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default VerifyTeacher
