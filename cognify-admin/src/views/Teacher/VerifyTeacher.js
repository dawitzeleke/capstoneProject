import React, { useEffect, useState, useMemo } from "react";
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
  CSpinner,
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import { useDispatch, useSelector } from "react-redux";
import TeacherDetail from "./TeacherDetail";
import { httpRequest, setAuthToken } from "../../util/httpRequest";
import {
  fetchTeachersRequest,
  fetchTeachersSuccess,
  fetchTeachersFailure,
} from "../../redux/teachersReducer";

const VerifyTeacher = () => {
  const dispatch = useDispatch();

  const { authenticatedUser } = useSelector((state) => state.auth);
  const token = authenticatedUser?.token;

  const teachersState = useSelector((state) => state.teachers);
  const { loading, error, teachers } = teachersState;

  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      dispatch(fetchTeachersRequest());
      try {
        if (token) setAuthToken(token);
        const data = await httpRequest("/admin/get-teachers", null, "GET");
        dispatch(fetchTeachersSuccess(data));
      } catch (err) {
        dispatch(
          fetchTeachersFailure(err.message || "Failed to fetch teachers")
        );
      }
    };

    fetchTeachers();
  }, [dispatch, token]);

  const unverifiedTeachers = useMemo(() => {
    return teachers?.filter((teacher) => !teacher.isVerified) || [];
  }, [teachers]);

  console.log("Unverified Teachers:", teachers, unverifiedTeachers);

  const handleVerify = (id) => {
    dispatch(
      fetchTeachersSuccess(
        teachers.map((t) =>
          t.id === id || t._id === id ? { ...t, isVerified: true } : t
        )
      )
    );
  };

  const handleDetailVerify = (id) => {
    dispatch(
      fetchTeachersSuccess(
        teachers.map((t) =>
          t.id === id || t._id === id ? { ...t, isVerified: true } : t
        )
      )
    );
    setModalVisible(true);
  };

  if (selectedTeacher) {
    return (
      <TeacherDetail
        teacher={selectedTeacher}
        onBack={() => setSelectedTeacher(null)}
        onVerify={handleDetailVerify}
      />
    );
  }

  return (
    <>
      <CModal
        alignment="center"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Teacher Verified</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div
            style={{
              fontSize: 18,
              fontWeight: 500,
              textAlign: "center",
              padding: "12px 0",
            }}>
            The teacher has been successfully verified!
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
      <CCard>
        <CCardHeader>
          <h4>Verify Teachers</h4>
        </CCardHeader>
        <CCardBody>
          {loading && (
            <div className="text-center py-4">
              <CSpinner color="primary" />
            </div>
          )}

          {error && (
            <CAlert color="danger" className="text-center">
              {error}
            </CAlert>
          )}

          {!loading && !error && (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {unverifiedTeachers.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell
                      colSpan={4}
                      className="text-center text-muted">
                      All teachers are verified.
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  unverifiedTeachers.map((teacher) => (
                    <CTableRow key={teacher._id || teacher.id}>
                      <CTableDataCell>
                        {`${teacher.firstName || ""} ${teacher.lastName || ""}`.trim()}
                      </CTableDataCell>
                      <CTableDataCell>{teacher.email}</CTableDataCell>
                      <CTableDataCell>
                        <span
                          className="px-3 py-1 rounded"
                          style={{
                            border: "1px solid #e55353",
                            color: "#e55353",
                            backgroundColor: "transparent",
                            fontWeight: 400,
                            fontSize: 14,
                            userSelect: "none",
                            display: "inline-block",
                            letterSpacing: 0.5,
                            transition: "background-color 0.3s ease",
                            cursor: "default",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "rgba(229, 83, 83, 0.2)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}>
                          Not Verified
                        </span>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          size="sm"
                          color="info"
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
                            e.currentTarget.style.backgroundColor =
                              "rgba(28, 126, 214, 0.2)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                          onClick={() => setSelectedTeacher(teacher)}>
                          View
                        </CButton>{" "}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>
    </>
  );

};

export default VerifyTeacher;
