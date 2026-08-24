import React, { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AttendancePage } from './pages/AttendancePage';
import { AuditPage } from './pages/AuditPage';
import { BranchesPage } from './pages/BranchesPage';
import { CarnetsPage } from './pages/CarnetsPage';
import { DashboardPage } from './pages/DashboardPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { MyAttendancePage } from './pages/MyAttendancePage';
import { OvertimePage } from './pages/OvertimePage';
import { PunchClockPage } from './pages/PunchClockPage';
import { ReportsPage } from './pages/ReportsPage';
import { SchedulesPage } from './pages/SchedulesPage';
import { SettingsPage } from './pages/SettingsPage';
import { UsersPage } from './pages/UsersPage';

const MainRouter: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const { currentRole } = useAuth();

  // If in kiosk punch mode, render standalone
  if (currentPath === '/marcar') {
    return (
      <PunchClockPage
        onBackToDashboard={() => {
          if (currentRole === 'EMPLOYEE') {
            setCurrentPath('/mi-asistencia');
          } else {
            setCurrentPath('/dashboard');
          }
        }}
      />
    );
  }

  const renderPage = () => {
    switch (currentPath) {
      case '/dashboard':
        return currentRole === 'EMPLOYEE' ? (
          <MyAttendancePage onNavigate={setCurrentPath} />
        ) : (
          <DashboardPage onNavigate={setCurrentPath} />
        );
      case '/asistencia':
        return <AttendancePage />;
      case '/empleados':
        return <EmployeesPage />;
      case '/horarios':
        return <SchedulesPage />;
      case '/horas-extras':
        return <OvertimePage />;
      case '/incidencias':
        return <IncidentsPage />;
      case '/carnets':
        return <CarnetsPage />;
      case '/reportes':
        return <ReportsPage />;
      case '/mi-asistencia':
        return <MyAttendancePage onNavigate={setCurrentPath} />;
      case '/departamentos':
        return <DepartmentsPage />;
      case '/sedes':
        return <BranchesPage />;
      case '/usuarios':
        return <UsersPage />;
      case '/auditoria':
        return <AuditPage />;
      case '/configuracion':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={setCurrentPath} />;
    }
  };

  return (
    <AppLayout currentPath={currentPath} onNavigate={setCurrentPath}>
      {renderPage()}
    </AppLayout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainRouter />
      </AppProvider>
    </AuthProvider>
  );
}
