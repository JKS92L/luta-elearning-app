// Dashboard page
import React from 'react';
import DashboardComponent from '../../components/Dashboard';

export default function Dashboard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-4xl">
        <DashboardComponent />
      </div>
    </div>
  );
}