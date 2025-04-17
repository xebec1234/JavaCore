import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

import nodemailer from "nodemailer";

export async function GET(req: Request) {

    try {
        const session = await auth()
        
        if (!session) {
            throw new Error('Not Authenticated')
        }

        const url = new URL(req.url);
        const userAgent = url.searchParams.get("userAgent");

        if (!userAgent) {
            throw new Error("Missing device ID");
        }     

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { emailVerified: true, verifiedDevices: true },
          });
        
          if (!user?.emailVerified) {
            return NextResponse.json(
              { message: "Email not verified", success: false, errorType: "email_not_verified" },
              { status: 403 }
            );
          }

          const isDeviceVerified = user.verifiedDevices.some((device) => device.userAgent === userAgent);
      
          if (!isDeviceVerified) {
            return NextResponse.json(
              { message: "Device not verified", success: false, errorType: "device_not_verified" },
              { status: 403 }
            );
          }
        
        return NextResponse.json({ message: 'Client fetched successfully', success: true});
    } catch (error) {
        console.error('Error in route handler:', error);
        return NextResponse.json({ message: 'Internal Server Error', success: false, errorType: "server_error"}, { status: 500 });
    }
}

export async function POST(req: Request) {
    const body = await req.json()
    try {
        const session = await auth()
        
        if (!session || (session.user.id !== process.env.ADMIN)) {
            throw new Error('Not Authenticated')
        }

        const { id, email, name } = body

        await prisma.user.update({
            where: {
                id
            },
            data: {
                emailVerified: new Date()
            }
        })

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Sample',
            text: `Welcome to Java Condition Monitoring ${name}!`,
          };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'Client fetched successfully', success: true});
    } catch (error) {
        console.error('Error in route handler:', error);
        return NextResponse.json({ message: 'Internal Server Error', success: false}, { status: 500 });
    }
}