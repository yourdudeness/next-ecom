"use client";
import React, { useMemo } from "react";
import AuthFormContainer from "@/components/AuthFormContainer";
import { Button, Input } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import * as yup from "yup";
import FormikHelperErrorList from "@/app/utils/FormikHelper";



const validationForm = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required(),
});

export default function SignUp() {
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    errors,
    touched,
  } = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: validationForm,
    onSubmit: (values) => {
      fetch("/api/users", {
        method: "POST",
        body:JSON.stringify(values),
      }).then(async(res) =>{
        if(res.ok){
          const result = await res.json();
          console.log(result)
        }
      })
    },
  });

  const { email, name, password } = values;

 const formErrors :string[] = FormikHelperErrorList(errors,touched,values)

  return (
    <AuthFormContainer title="Create New Account" onSubmit={handleSubmit}>
      <Input
        name="name"
        label="Name"
        onChange={handleChange}
        value={name}
        onBlur={handleBlur}
      />
      <Input
        name="email"
        label="Email"
        onChange={handleChange}
        value={email}
        onBlur={handleBlur}
      />
      <Input
        name="password"
        label="Password"
        type="password"
        onChange={handleChange}
        value={password}
        onBlur={handleBlur}
      />
      <Button type="submit" className="w-full">
        Sign up
      </Button>
      <div className="">
        {formErrors.map((err) => {
          return (
            <div key={err} className="space-x-1 flex items-center text-red-500">
              <XMarkIcon className="w-4 h-4" />
              <p className="text-xs">{err}</p>
            </div>
          );
        })}
      </div>
    </AuthFormContainer>
  );
}
