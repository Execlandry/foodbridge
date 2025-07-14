import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(
  request: NextApiRequest,
  res: NextApiResponse,
  { params }: { params: { id: string } }
) {
  const session: any = await getServerSession(authOptions);
  const slug = params.id;
  try {
    // fetch data from business apis from proxy
    // GET SERVER SIDE SESSION AND PASS TOKEN TO NESTJS APIS
    const response = await axios.get(
      `http://localhost:3001/api/v1/order-service/order/business/all/${slug}`
      // 'http://localhost:3001/api/v1/order-service/businesses',
      // {
      //   headers: {
      //     Authorization: `Bearer ${session?.user?.access_token}`,
      //   },
      // }
    );

    // we got data here successfully !!
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
