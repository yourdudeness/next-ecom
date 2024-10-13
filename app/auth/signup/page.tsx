"use client";
import React from "react";
import AuthFormContainer from "@/components/AuthFormContainer";
import { Button, Input } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import * as yup from "yup";
import FormikHelperErrorList from "@/app/utils/FormikHelper";
import { toast } from "react-toastify";
import Link from "next/link";

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
    onSubmit: async (values, action) => {
      action.setSubmitting(true);
      await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(values),
      }).then(async (res) => {
        if (res.ok) {
          const { message } = (await res.json()) as { message: string };
          toast.success(message);
        }
        action.setSubmitting(false);
      });
    },
  });

  const { email, name, password } = values;

  type valueKeys = keyof typeof values;

  const error = (name: valueKeys) => {
    return errors[name] && touched[name] ? true : false;
  };

  const formErrors: string[] = FormikHelperErrorList(errors, touched, values);

  return (
    <AuthFormContainer title="Create New Account" onSubmit={handleSubmit}>
      <Input
        name="name"
        label="Name"
        onChange={handleChange}
        value={name}
        onBlur={handleBlur}
        error={error('name')}
      />
      <Input
        name="email"
        label="Email"
        onChange={handleChange}
        value={email}
        onBlur={handleBlur}
        error={error('email')}
      />
      <Input
        name="password"
        label="Password"
        type="password"
        onChange={handleChange}
        value={password}
        onBlur={handleBlur}
        error={error('password')}
      />
      <Button disabled={isSubmitting} type="submit" className="w-full">
        Sign up
      </Button>

      <div className="flex items-center justify-between">
        <Link href="/auth/signin">Sign in</Link>
        <Link href="/auth/forget-password">Forget password</Link>
      </div>

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
