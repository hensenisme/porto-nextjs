'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Buat Context
const DeviceContext = createContext();

// 2. Buat Hook kustom untuk mempermudah penggunaan context
export const useDevice = () => {
  return useContext(DeviceContext);
};

// 3. Buat komponen Provider
export const DeviceProvider = ({ children }) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Logika deteksi ini hanya akan berjalan sekali saat aplikasi dimuat
    const touchCheck = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(touchCheck);
  }, []);

  return (
    <DeviceContext.Provider value={{ isTouchDevice }}>
      {children}
    </DeviceContext.Provider>
  );
};
