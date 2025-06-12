import React, { useState, useEffect } from 'react'
import { CCard, CCardHeader, CCardBody, CFormSelect, CListGroup, CListGroupItem, CButton, CSpinner, CAlert } from '@coreui/react'
import { httpRequest } from '../../util/httpRequest'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const REPORT_TYPES = [
  { key: "Spam", label: "Spam", desc: "Unwanted or repetitive content", icon: "report" },
  { key: "HateSpeech", label: "Hate Speech", desc: "Offensive or hateful language", icon: "report" },
  { key: "Violence", label: "Violence", desc: "Violent or graphic content", icon: "report" },
  { key: "InappropriateContent", label: "Inappropriate Content", desc: "Sexual, abusive, or otherwise inappropriate", icon: "report" },
  { key: "Misinformation", label: "Misinformation", desc: "False or misleading information", icon: "report" },
  { key: "WrongAnswer", label: "Wrong Answer", desc: "The answer provided is wrong", icon: "error" },
  { key: "OutOfContext", label: "Out of Context", desc: "Question is out of context", icon: "subject" },
  { key: "OutOfGrade", label: "Out of Grade", desc: "Not suitable for this grade", icon: "school" },
  { key: "Other", label: "Other", desc: "Other issue", icon: "report" },
]

const Reports = () => {
  const [selectedType, setSelectedType] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fetchedReports, setFetchedReports] = useState([])
  const { authenticatedUser } = useSelector((state) => state.auth)
  const token = authenticatedUser?.token
  const navigate = useNavigate()

  // Mock report data
  const reportData = [
    {
      contentId: "683380bf7b7ab6a25341da56",
      reports: [
        { reportedBy: "user_001", reportType: "HateSpeech" },
        { reportedBy: "user_002", reportType: "Spam" }
      ],
      isResolved: false,
      resolvedBy: null,
      resolvedAt: null,
      contentType: "Question",
      id: "report_001",
      createdAt: "2025-05-29T19:36:09.622Z",
      updatedAt: "2025-05-29T19:37:17.213Z",
      updatedBy: null,
      image: "https://i.pravatar.cc/150?img=1"
    },
    {
      contentId: "683380bf7b7ab6a25341da57",
      reports: [
        { reportedBy: "user_003", reportType: "InappropriateContent" }
      ],
      isResolved: true,
      resolvedBy: "admin_01",
      resolvedAt: "2025-05-30T10:00:00.000Z",
      contentType: "Answer",
      id: "report_002",
      createdAt: "2025-05-28T12:15:00.000Z",
      updatedAt: "2025-05-30T10:00:00.000Z",
      updatedBy: "admin_01",
      image: "https://i.pravatar.cc/150?img=2"
    },
    {
      contentId: "683380bf7b7ab6a25341da58",
      reports: [
        { reportedBy: "user_004", reportType: "Harassment" },
        { reportedBy: "user_005", reportType: "HateSpeech" }
      ],
      isResolved: false,
      resolvedBy: null,
      resolvedAt: null,
      contentType: "Video",
      id: "report_003",
      createdAt: "2025-05-27T09:00:00.000Z",
      updatedAt: "2025-05-27T09:15:00.000Z",
      updatedBy: null,
      image: "https://i.pravatar.cc/150?img=3"
    }
  ]

  // Fetch all reports on initial load
  useEffect(() => {
    const fetchAllReports = async () => {
      setLoading(true)
      setError(null)
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const data = await httpRequest('/Report', null, 'GET', { headers })
        setFetchedReports(data)
      } catch (err) {
        setError('Failed to fetch reports')
      } finally {
        setLoading(false)
      }
    }
    fetchAllReports()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const handleFilter = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = selectedType ? `?contentTypes=${selectedType}` : ''
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const data = await httpRequest(`/Report${params}`, null, 'GET', { headers })
      setFetchedReports(data)
    } catch (err) {
      setError('Failed to fetch reports')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CCard>
      <CCardHeader>
        <h4>Reports</h4>
      </CCardHeader>
      <CCardBody>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
          <CFormSelect
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            style={{ maxWidth: 260 }}
          >
            <option value="">All Report Types</option>
            {REPORT_TYPES.map(type => (
              <option key={type.key} value={type.key}>{type.label}</option>
            ))}
          </CFormSelect>
          <CButton color="primary" onClick={handleFilter} disabled={loading}>
            Filter
          </CButton>
        </div>
        {/* {loading && <CSpinner color="primary" />}
        {error && <CAlert color="danger">{error}</CAlert>} */}
        <CListGroup>
          {reportData.map((report, idx) => (
            <CListGroupItem key={report.id} action style={{ cursor: 'pointer' }} onClick={() => navigate(`/reports/${report.id}`, { state: { report } })}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <img src={report.image} alt="avatar" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{report.contentType} <span style={{ color: '#888', fontWeight: 400 }}>({report.contentId})</span></div>
                  <div style={{ fontSize: 14, color: '#555' }}>Reported by: {report.reports.map(r => r.reportedBy).join(', ')}</div>
                  <div style={{ fontSize: 14, color: '#555' }}>Types: {report.reports.map(r => r.reportType).join(', ')}</div>
                  <div style={{ fontSize: 13, color: report.isResolved ? 'green' : 'orange' }}>
                    {report.isResolved ? `Resolved by ${report.resolvedBy} at ${new Date(report.resolvedAt).toLocaleString()}` : 'Unresolved'}
                  </div>
                  <div style={{ fontSize: 12, color: '#aaa' }}>Created: {new Date(report.createdAt).toLocaleString()}</div>
                </div>
              </div>
            </CListGroupItem>
          ))}
        </CListGroup>
      </CCardBody>
    </CCard>
  )
}

export default Reports
