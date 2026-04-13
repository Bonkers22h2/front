import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const backendBase = process.env.BACKEND_BASE_URL ?? "http://127.0.0.1:8000";
  const url = `${backendBase}/api/verify`;

  const body = await req.text();

  const upstream = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body,
    cache: "no-store",
  });

  const contentType = upstream.headers.get("content-type") ?? "application/json";
  const responseBody = await upstream.text();

  return new NextResponse(responseBody, {
    status: upstream.status,
    headers: { "content-type": contentType },
  });
}
