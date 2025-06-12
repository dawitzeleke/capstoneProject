import React from 'react'
import { CCard, CCardHeader, CCardBody, CButton, CFormCheck, CButtonGroup, CModal, CModalHeader, CModalBody, CModalFooter } from '@coreui/react'
import { useLocation, useNavigate } from 'react-router-dom'

const ReportDetail = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const report = location.state?.report
  const [action, setAction] = React.useState('')
  const [resolving, setResolving] = React.useState(false)
  const [showModal, setShowModal] = React.useState(false)

  if (!report) {
    return <div>No report data found.</div>
  }

  return (
    <CCard style={{ maxWidth: 600, margin: '32px auto', position: 'relative' }}>
      <CCardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4>Report Detail</h4>
        <CButton
          color={action ? 'primary' : 'secondary'}
          disabled={!action || resolving}
          style={{ minWidth: 100, opacity: action ? 1 : 0.7 }}
          onClick={async () => {
            setResolving(true)
            // Simulate API call
            await new Promise(r => setTimeout(r, 1200))
            setResolving(false)
            setShowModal(true)
          }}
        >
          {resolving ? <span><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ marginRight: 8 }}></span>Resolving...</span> : 'Resolve'}
        </CButton>
      </CCardHeader>
      <CCardBody>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
          <img src={report.image} alt="avatar" style={{ width: 72, height: 72, borderRadius: 12, objectFit: 'cover' }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 18 }}>{report.contentType} <span style={{ color: '#888', fontWeight: 400 }}>({report.contentId})</span></div>
            <div style={{ fontSize: 14, color: '#555' }}>Created: {new Date(report.createdAt).toLocaleString()}</div>
            <div style={{ fontSize: 14, color: '#555' }}>Updated: {new Date(report.updatedAt).toLocaleString()}</div>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <strong>Reported by:</strong> {report.reports.map(r => r.reportedBy).join(', ')}
        </div>
        <div style={{ marginBottom: 16 }}>
          <strong>Report Types:</strong> {report.reports.map(r => r.reportType).join(', ')}
        </div>
        <div style={{ marginBottom: 16 }}>
          <strong>Status:</strong> <span style={{ color: report.isResolved ? 'green' : 'orange' }}>
            {report.isResolved ? `Resolved by ${report.resolvedBy} at ${new Date(report.resolvedAt).toLocaleString()}` : 'Unresolved'}
          </span>
        </div>
        <div style={{ marginBottom: 24 }}>
          <strong>Resolve Action:</strong>
          <CButtonGroup role="group" style={{ display: 'flex', gap: 16, marginTop: 12 }}>
            <CFormCheck
              type="radio"
              name="resolveAction"
              id="emailTeacher"
              label="Email Teacher"
              value="emailTeacher"
              checked={action === 'emailTeacher'}
              onChange={() => setAction('emailTeacher')}
            />
            <CFormCheck
              type="radio"
              name="resolveAction"
              id="deleteContent"
              label="Delete Content"
              value="deleteContent"
              checked={action === 'deleteContent'}
              onChange={() => setAction('deleteContent')}
            />
            <CFormCheck
              type="radio"
              name="resolveAction"
              id="deleteBanTeacher"
              label="Delete & Ban Teacher"
              value="deleteBanTeacher"
              checked={action === 'deleteBanTeacher'}
              onChange={() => setAction('deleteBanTeacher')}
            />
          </CButtonGroup>
        </div>
        <CButton color="secondary" onClick={() => navigate(-1)}>Back</CButton>
        <CModal visible={showModal} onClose={() => {
          setShowModal(false)
          navigate('/reports')
        }}>
          <CModalHeader onClose={() => {
            setShowModal(false)
            navigate('/reports')
          }}>
            Report Resolved
          </CModalHeader>
          <CModalBody>
            The report has been resolved successfully.
          </CModalBody>
          <CModalFooter>
            <CButton color="primary" onClick={() => {
              setShowModal(false)
              navigate('/reports')
            }}>OK</CButton>
          </CModalFooter>
        </CModal>
      </CCardBody>
    </CCard>
  )
}

export default ReportDetail
