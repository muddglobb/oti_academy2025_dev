'use client';

import React, { Suspense } from 'react';
import Change from './reset';

const LoginPage = () => {
  return (
    <div className="relative overflow-x-hidden">
      <Suspense fallback={<div>Loading...</div>}>
        <Change />
      </Suspense>
    </div>
  );
};

export default LoginPage;
