import React from 'react'
import { CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react'

const TeacherList = () => {
  const teachers = [
    { id: 1, name: 'John Doe', status: 'Verified' },
    { id: 2, name: 'Jane Smith', status: 'Pending' },
  ]

  return (
    <CCard>
      <CCardHeader>
        <h4>Teacher List</h4>
      </CCardHeader>
      <CCardBody>
        <CTable striped>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {teachers.map((teacher) => (
              <CTableRow key={teacher.id}>
                <CTableDataCell>{teacher.id}</CTableDataCell>
                <CTableDataCell>{teacher.name}</CTableDataCell>
                <CTableDataCell>{teacher.status}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default TeacherList
