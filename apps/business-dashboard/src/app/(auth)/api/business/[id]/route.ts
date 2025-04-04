import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session: any = await getServerSession(authOptions);
  const slug = params.id; // 'a', 'b', or 'c'

  try {
    // fetch data from business apis from proxy
    // GET SERVER SIDE SESSION AND PASS TOKEN TO NESTJS APIS
    // ITS GET BUSINESS BY ID
    // SIMILARLY WE CAN HAVE PUT/DELETE
    const response = await axios.get(
      `http://localhost:3001/api/v1/business-service/businesses/${slug}`,
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session: any = await getServerSession(authOptions);
  const slug = params.id; // 'a', 'b', or 'c'

  try {
    // fetch data from business apis from proxy
    // GET SERVER SIDE SESSION AND PASS TOKEN TO NESTJS APIS
    // ITS GET BUSINESS BY ID
    // SIMILARLY WE CAN HAVE PUT/DELETE
    const response = await axios.put(
      `http://localhost:3001/api/v1/business-service/businesses/${slug}`,
      {
        headers: {
          Authorization: `Bearer ${session?.user?.access_token}`,
        },
      }
    );
    const { data } = response;
    // we got data here successfully !!
    console.log(data);
    return new Response(data);
  } catch (err) {
    return new Response(`error just to debug, send 500 from here `);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session: any = await getServerSession(authOptions);
  const slug = params.id; // 'a', 'b', or 'c'

  try {
    // fetch data from business apis from proxy
    // GET SERVER SIDE SESSION AND PASS TOKEN TO NESTJS APIS
    // ITS GET BUSINESS BY ID
    // SIMILARLY WE CAN HAVE PUT/DELETE
    const response = await axios.delete(
      `http://localhost:3001/api/v1/business-service/businesses/${slug}`,
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
