import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthToken, httpRequest } from "../../util/httpRequest";
import {
  fetchTeachersRequest,
  fetchTeachersSuccess,
  fetchTeachersFailure,
} from "../../redux/teachersReducer";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
} from "@coreui/react";

const TeacherList = () => {
  const dispatch = useDispatch();
  const { teachers, loading, error } = useSelector((state) => state.teachers);
  const authenticatedUser = useSelector(
    (state) => state.auth.authenticatedUser
  );
  const token = authenticatedUser ? authenticatedUser.token : null;

  useEffect(() => {
    const fetchTeachers = async () => {
      dispatch(fetchTeachersRequest());

      try {
        if (token) setAuthToken(token); // ✅ set the token in axiosInstance globally

        const data = await httpRequest("/admin/get-teachers", null, "GET");
        dispatch(fetchTeachersSuccess(data));

        console.log("Fetched Teachers:", data);
      } catch (err) {
        dispatch(fetchTeachersFailure(err.message || "Something went wrong"));
      }
    };

    fetchTeachers();
  }, [dispatch, token]);

  return (
    <CCard>
      <CCardHeader>
        <h4>Teacher List</h4>
      </CCardHeader>
      <CCardBody>
        {loading ? (
          <CSpinner color="primary" />
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : (
          <CTable striped>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Phone</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Username</CTableHeaderCell>
                <CTableHeaderCell>Subjects</CTableHeaderCell>
                <CTableHeaderCell>Profile</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {teachers && teachers.length > 0 ? (
                teachers.map((teacher, index) => (
                  <CTableRow key={teacher.id || teacher._id}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>
                      {`${teacher.firstName || ""} ${teacher.lastName || ""}`.trim()}
                    </CTableDataCell>
                    <CTableDataCell>{teacher.email || "N/A"}</CTableDataCell>
                    <CTableDataCell>
                      {teacher.phoneNumber || "N/A"}
                    </CTableDataCell>
                    <CTableDataCell>
                      <span
                        style={{
                          backgroundColor: teacher.isVerified
                            ? "#d4edda"
                            : "#f8d7da", // light green or light red
                          color: teacher.isVerified ? "#155724" : "#721c24", // dark green or dark red
                          padding: "2px 5px",
                          borderRadius: "12px",
                          fontWeight: "400",
                          display: "inline-block",
                          minWidth: "100px",
                          textAlign: "center",
                        }}>
                        {teacher.isVerified ? "Verified" : "Not Verified"}
                      </span>
                    </CTableDataCell>

                    <CTableDataCell>{teacher.userName || "N/A"}</CTableDataCell>
                    <CTableDataCell>{teacher.subjects || "N/A"}</CTableDataCell>
                    <CTableDataCell>
                      {teacher.profilePictureUrl ? (
                        <img
                          src={teacher.profilePictureUrl}
                          alt="Profile"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                          }}
                        />
                      ) : (
                        "N/A"
                      )}
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={8}>
                    No teachers found.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>
    </CCard>
  );
};

export default TeacherList;
