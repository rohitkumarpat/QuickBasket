"use client"

import RegisterForm from '@/app/component/RegisterForm';
import Welcome from '@/app/component/Welcome'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation';

function Register() {
  const [steps, setsteps] = useState(1);
  const searchParams = useSearchParams();

  useEffect(() => {
    const stepFromUrl = searchParams.get("step");

    if (stepFromUrl) {
      setsteps(Number(stepFromUrl));
      localStorage.setItem("step", stepFromUrl);
    } else {
      setsteps(1);
      localStorage.setItem("step", "1");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("step", steps.toString());
  }, [steps]);

  return (
    <div>
      {steps === 1 && <Welcome nextstep={setsteps} />}
      {steps === 2 && <RegisterForm nextstep={setsteps} />}
    </div>
  )
}

export default Register