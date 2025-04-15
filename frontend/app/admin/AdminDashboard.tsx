import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import Header from '../components/Header';
import StatCard from '.Statcard';
import UserCard from '../components/UserCard';

const AdminDashboard = () => {
  const [showStudents, setShowStudents] = useState(false);
  const [showTeachers, setShowTeachers] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showBannedUsers, setShowBannedUsers] = useState(false);

  const students = [
    { name: "Alice Johnson", role: "Student", status: "Active" },
    { name: "Sarah Kim", role: "Student", status: "Active" },
  ];

  const teachers = [
    { name: "John Doe", role: "Teacher", status: "Active" },
    { name: "Carlos Ray", role: "Teacher", status: "Active" },
  ];

  const reports = [
    { name: "John Doe", role: "Teacher", status: "Reported" },
    { name: "Maria Smith", role: "Student", status: "Reported" },
  ];

  const bannedUsers = [
    { name: "John Doe", role: "Teacher", status: "Banned" },
    { name: "Maria Smith", role: "Student", status: "Banned" },
    { name: "Carlos Ray", role: "Teacher", status: "Banned" },
  ];

  return (
    <ScrollView className="bg-primary flex-1 px-4">
      <Header title="Admin Dashboard" />

      <View className="flex-row justify-between flex-wrap mb-4">
        <TouchableOpacity
          className="bg-card p-4 rounded-2xl w-[48%] mb-3"
          onPress={() => setShowStudents(!showStudents)}
        >
          <Text className="text-gray-100 text-sm font-pregular">Total Students</Text>
          <Text className="text-white text-xl font-pbold mt-2">1200</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-card p-4 rounded-2xl w-[48%] mb-3"
          onPress={() => setShowTeachers(!showTeachers)}
        >
          <Text className="text-gray-100 text-sm font-pregular">Total Teachers</Text>
          <Text className="text-white text-xl font-pbold mt-2">80</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-card p-4 rounded-2xl w-[48%] mb-3"
          onPress={() => setShowReports(!showReports)}
        >
          <Text className="text-gray-100 text-sm font-pregular">Reports</Text>
          <Text className="text-white text-xl font-pbold mt-2">34</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-card p-4 rounded-2xl w-[48%] mb-3"
          onPress={() => setShowBannedUsers(!showBannedUsers)}
        >
          <Text className="text-gray-100 text-sm font-pregular">Banned Users</Text>
          <Text className="text-white text-xl font-pbold mt-2">15</Text>
        </TouchableOpacity>
      </View>

      <Header title="Details" />

      {showStudents && (
        <>
          <Text className="text-white text-lg mb-2">Students</Text>
          {students.map((student, index) => (
            <UserCard
              key={index}
              name={student.name}
              role={student.role}
              status={student.status}
            />
          ))}
        </>
      )}

      {showTeachers && (
        <>
          <Text className="text-white text-lg mb-2">Teachers</Text>
          {teachers.map((teacher, index) => (
            <UserCard
              key={index}
              name={teacher.name}
              role={teacher.role}
              status={teacher.status}
            />
          ))}
        </>
      )}

      {showReports && (
        <>
          <Text className="text-white text-lg mb-2">Reports</Text>
          {reports.map((report, index) => (
            <UserCard
              key={index}
              name={report.name}
              role={report.role}
              status={report.status}
            />
          ))}
        </>
      )}

      {showBannedUsers && (
        <>
          <Text className="text-white text-lg mb-2">Banned Users</Text>
          {bannedUsers.map((user, index) => (
            <UserCard
              key={index}
              name={user.name}
              role={user.role}
              status={user.status}
            />
          ))}
        </>
      )}
    </ScrollView>
  );
};

export default AdminDashboard;
