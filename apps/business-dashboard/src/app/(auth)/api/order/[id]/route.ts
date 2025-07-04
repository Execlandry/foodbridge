import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session: any = await getServerSession(authOptions);

  try {
    // fetch data from business apis from proxy
    // GET SERVER SIDE SESSION AND PASS TOKEN TO NESTJS APIS
    const response = await axios.get(
      `http://localhost:3001/api/v1/order-service/order/business/all`,
      {
        headers: {
          Authorization: `Bearer ${session?.user?.access_token}`,
        },
      }
    );
    const { data } = response;
    // we got data here successfully !!
    console.log(data);
    return new Response(JSON.stringify(data), { status: 200 });
    // return res.status(200).json(data)
  } catch (err) {
    console.log(err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

//   /api/business/2342-324-24-324323 (UUID) -- HTTP GET
