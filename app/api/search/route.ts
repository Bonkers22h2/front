import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentNo = searchParams.get("student_no") ?? "";

  const backendBase = process.env.BACKEND_BASE_URL ?? "http://127.0.0.1:8000";
  const url = `${backendBase}/api/search?student_no=${encodeURIComponent(studentNo)}`;

  const upstream = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
    cache: "no-store",
  });

  const contentType = upstream.headers.get("content-type") ?? "application/json";
  const body = await upstream.text();

  return new NextResponse(body, {
    status: upstream.status,
    headers: { "content-type": contentType },
  });
}
