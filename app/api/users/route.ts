import startDb from "@/app/lib/db";
import UserModel from "@/app/models/userModel";
import { NewUserRequest } from "@/app/types";
import nodemailer from "nodemailer";

import { NextResponse } from "next/server";
import EmailVerificationToken from "@/app/models/emailVerificationToken";
import crypto from 'crypto'

export const POST = async (req: Request) => {
  const body = (await req.json()) as NewUserRequest;
  await startDb();

  const newUser = await UserModel.create({
    ...body,
  });

  const token = crypto.randomBytes(36).toString('hex')

  await EmailVerificationToken.create({
    user:newUser._id,
    token,
  })

  // Looking to send emails in production? Check out our Email API/SMTP product!
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "3a867bfb5ea2b0",
      pass: "e8685b942bc29a",
    },
  });

  const verificationUrl = `http://localhost:3000/verify?token=${token}&userId=${newUser._id}`

  transport.sendMail({
    from: "verification@test.com",
    to: newUser.email,
    html: `<h1> verification your email <a href="${verificationUrl}">link</></h1>`,
  });

  // newUser.comparePassword
  return NextResponse.json({message: 'Please check your email'});
};
