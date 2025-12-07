// MaintenanceGuard.jsx
import React, { useEffect, useState } from 'react';
import Maintenance from '../pages/maintenance/Maintenance';

export default function MaintenanceGuard({ children }) {
  // const [loading, setLoading] = useState(true);
  const [isMaint, setIsMaint] = useState(true);

  if (isMaint) {
    return <Maintenance />;
  }
  return children;
}
