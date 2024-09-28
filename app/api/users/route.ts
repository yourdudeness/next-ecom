import startDb from "@/app/lib/db";
import UserModel from "@/app/models/userModel";
import { NewUserRequest } from "@/app/types";
import nodemailer from "nodemailer";

import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const body = (await req.json()) as NewUserRequest;
  await startDb();

  const newUser = await UserModel.create({
    ...body,
  });

  // Looking to send emails in production? Check out our Email API/SMTP product!
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "3a867bfb5ea2b0",
      pass: "e8685b942bc29a",
    },
  });

  transport.sendMail({
    from: "verification@test.com",
    to: newUser.email,
    html: `<h1> verification your email <a href="http://localhost:3000/">link</></h1>`,
  });

  // newUser.comparePassword
  return NextResponse.json(newUser);
};
