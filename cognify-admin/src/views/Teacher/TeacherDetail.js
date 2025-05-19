import React from 'react'
import { CCard, CCardBody, CCardHeader, CButton } from '@coreui/react'
import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
const TeacherDetail = ({ teacher, onBack, onVerify }) => {
  const pdfUrl = teacher.pdfUrl // The URL to the PDF file (make sure it's accessible)

  return (
    <CCard>
      <CCardHeader>
        <h4>Teacher Credentials</h4>
      </CCardHeader>
      <CCardBody>
        <p>
          <strong>Name:</strong> {teacher.name}
        </p>
        <p>
          <strong>Email:</strong> {teacher.email}
        </p>
        <p>
          <strong>Degree:</strong> {teacher.degree}
        </p>
        <p>
          <strong>Subject:</strong> {teacher.subject}
        </p>
        <p>
          <strong>Status:</strong> {teacher.status}
        </p>

        <div className="d-flex gap-2 mt-3 mb-4">
          <CButton color="success" onClick={() => onVerify(teacher.id)}>
            Verify Teacher
          </CButton>
          <CButton color="secondary" onClick={onBack}>
            Back
          </CButton>
        </div>

        {/* Check if there's a PDF URL to load */}
        {pdfUrl ? (
          <>
            <h5 className="mb-2">Submitted Document</h5>
            <div style={{ border: '1px solid #ddd', padding: '10px' }}>
              <Document
                file={pdfUrl}
                onLoadError={(error) => console.error('Error while loading PDF:', error)}
                onLoadSuccess={({ numPages }) => console.log(`Loaded PDF with ${numPages} pages`)}
              >
                <Page pageNumber={1} />
              </Document>
            </div>
          </>
        ) : (
          <p>No PDF available for this teacher.</p>
        )}
      </CCardBody>
    </CCard>
  )
}

export default TeacherDetail
