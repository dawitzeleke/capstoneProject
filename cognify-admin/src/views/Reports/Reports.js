import React from 'react'
import { CCard, CCardHeader, CCardBody, CListGroup, CListGroupItem } from '@coreui/react'

const Reports = () => {
  const reports = [
    'Monthly Teacher Summary',
    'Admin Login Report',
    'Partnership Trends Report',
  ]

  return (
    <CCard>
      <CCardHeader>
        <h4>Reports</h4>
      </CCardHeader>
      <CCardBody>
        <CListGroup>
          {reports.map((report, index) => (
            <CListGroupItem key={index}>{report}</CListGroupItem>
          ))}
        </CListGroup>
      </CCardBody>
    </CCard>
  )
}

export default Reports
