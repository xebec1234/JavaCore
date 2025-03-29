import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { ReportIntroductionSchema } from "@/schema";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.id !== process.env.ADMIN) {
      return NextResponse.json(
        { message: "Not Authenticated", success: false },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedFields = ReportIntroductionSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          success: false,
          issues: validatedFields.error.issues,
        },
        { status: 400 }
      );
    }

    const { jobNumber, introduction } = validatedFields.data;

    const existingJob = await prisma.job.findUnique({
      where: { jobNumber },
    });

    if (!existingJob) {
      return NextResponse.json(
        { message: "Job not found", success: false },
        { status: 404 }
      );
    }

    const updatedJob = await prisma.job.update({
      where: { jobNumber },
      data: { reportIntroduction: introduction },
    });

    return NextResponse.json(
      {
        message: "Report introduction added successfully",
        success: true,
        job: updatedJob,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating report introduction", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
