import React, { useState } from "react";
import { CCard, CCardBody, CCardHeader, CButton } from "@coreui/react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import {
  cilCheckCircle,
  cilArrowLeft,
  cilCloudDownload,
  cilTrash,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { httpRequest, setAuthToken } from "../../util/httpRequest";
import { useSelector } from "react-redux";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const TeacherDetail = ({ teacher, onBack, onVerify, onDelete }) => {
  const pdfUrl = teacher.pdfUrl;
  const statusColor = teacher.status === "Verified" ? "success" : "warning";
  const statusText =
    teacher.status === "Verified" ? "Verified" : "Not Verified";
  const { authenticatedUser } = useSelector((state) => state.auth);
  const token = authenticatedUser?.token;
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState(null);

  const handleVerifyTeacher = async () => {
    setVerifyError(null);
    setVerifying(true);
    try {
      if (token) setAuthToken(token);
      await httpRequest(
        "/admin/verify-teacher",
        { TeacherId: teacher.id },
        "PATCH"
      );
      setVerifying(false);
      setTimeout(() => {
        onVerify(teacher.id || teacher._id);
        onBack();
      }, 1500);
    } catch (err) {
      setVerifying(false);
      setVerifyError("Failed to verify teacher. Please try again.");
    }
  };

  const buttonStyle = (borderColor, textColor) => ({
    border: `1px solid ${borderColor}`,
    color: textColor,
    backgroundColor: "transparent",
    fontWeight: 600,
    fontSize: 14,
    padding: "8px 24px",
    borderRadius: 999,
    letterSpacing: 0.5,
    transition: "background-color 0.3s ease",
    userSelect: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
  });

  const badgeStyle = {
    color: teacher.status === "Verified" ? "#2eb85c" : "#e55353",
    backgroundColor: "transparent",
    fontWeight: 600,
    fontSize: 14,
    userSelect: "none",
    display: "inline-block",
    letterSpacing: 0.5,
    padding: "4px 12px",
    borderRadius: 12,
    cursor: "default",
  };

  return (
    <CCard
      style={{
        maxWidth: 640,
        margin: "40px auto",
        boxShadow: "0 4px 32px rgba(60,72,100,0.08)",
        borderRadius: 18,
        background: "#f8f9fa",
        position: "relative",
      }}>
      <CCardHeader
        style={{
          background: "linear-gradient(90deg, #5e60ce 0%, #5390d9 100%)",
          color: "#fff",
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <h4 style={{ margin: 0, fontWeight: 700, letterSpacing: 0.5 }}>
          Teacher Credentials
        </h4>
      </CCardHeader>

      <CCardBody style={{ padding: "2rem 2.5rem" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
            {teacher.name}
          </div>
          <div style={{ color: "#5e60ce", fontWeight: 500, marginBottom: 8 }}>
            {teacher.email}
          </div>
          <span
            className="px-3 py-1 rounded"
            style={badgeStyle}
            onMouseEnter={(e) => {
              if (teacher.status !== "Verified")
                e.currentTarget.style.backgroundColor =
                  "rgba(229, 83, 83, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}>
            <CIcon icon={cilCheckCircle} style={{ marginRight: 6 }} />
            {statusText}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            marginBottom: 24,
          }}>
          <div style={{ minWidth: 180 }}>
            <div style={{ fontWeight: 500, color: "#495057" }}>Degree</div>
            <div style={{ fontSize: 16 }}>{teacher.degree}</div>
          </div>
          <div style={{ minWidth: 180 }}>
            <div style={{ fontWeight: 500, color: "#495057" }}>Subject</div>
            <div style={{ fontSize: 16 }}>{teacher.subject}</div>
          </div>
        </div>

        <div className="d-flex gap-3 mt-4 mb-4">
          <CButton
            color="success"
            style={{
              borderRadius: 12,
              fontWeight: 400,
              padding: "6px 20px",
              border: "1px solid #1c7ed6",
              backgroundColor: "transparent",
              color: "#1c7ed6",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(28, 126, 214, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            onClick={handleVerifyTeacher}
            disabled={verifying || teacher.status === "Verified"}>
            {verifying ? "Verifying..." : "Verify Teacher"}
          </CButton>
          <CButton
            color="secondary"
            variant="outline"
            style={{
              borderRadius: 20,
              fontWeight: 500,
              padding: "8px 24px",
              fontSize: 16,
            }}
            onClick={onBack}>
            Back
          </CButton>
        </div>
        {verifyError && (
          <div style={{ color: "red", marginBottom: 12 }}>{verifyError}</div>
        )}

        {pdfUrl ? (
          <>
            <h5 style={{ fontWeight: 600, marginTop: 32, marginBottom: 12 }}>
              Submitted Document
            </h5>
            <div
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: 12,
                padding: 18,
                background: "#fff",
                boxShadow: "0 2px 8px rgba(60,72,100,0.04)",
                marginBottom: 16,
              }}>
              <Document
                file={pdfUrl}
                onLoadError={(error) =>
                  console.error("Error while loading PDF:", error)
                }
                onLoadSuccess={({ numPages }) =>
                  console.log(`Loaded PDF with ${numPages} pages`)
                }>
                <Page pageNumber={1} width={420} />
              </Document>
              <div style={{ marginTop: 12 }}>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}>
                  <span
                    style={buttonStyle("#39f", "#39f")}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(51,153,255,0.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }>
                    <CIcon icon={cilCloudDownload} />
                    Download PDF
                  </span>
                </a>
              </div>
            </div>
          </>
        ) : (
          <p style={{ color: "#adb5bd", fontStyle: "italic", marginTop: 32 }}>
            No PDF available for this teacher.
          </p>
        )}

        {/* DELETE BUTTON BOTTOM RIGHT */}
        <div style={{ textAlign: "right", marginTop: 24 }}>
          <span
            style={{ ...buttonStyle("#e55353", "#e55353"), border: "none" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(229, 83, 83, 0.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            onClick={() => onDelete(teacher.id)}>
            <CIcon icon={cilTrash} />
            Delete
          </span>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default TeacherDetail;
