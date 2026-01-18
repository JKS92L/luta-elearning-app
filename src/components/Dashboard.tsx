import React from 'react';

export default function DashboardComponent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={`p-6 bg-white rounded-lg shadow-md ${className ?? ''}`}
      {...props}
    >
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>
        Welcome to your dashboard! Here you can manage your settings and view your activity.
      </p>
    </div>
  );
}
