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

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session: any = await getServerSession(authOptions);
  const slug = params.id; // 'a', 'b', or 'c'

  try {
    const formData = await request.json();
    // fetch data from business apis from proxy
    // GET SERVER SIDE SESSION AND PASS TOKEN TO NESTJS APIS
    // ITS GET BUSINESS BY ID
    // SIMILARLY WE CAN HAVE PUT/DELETE
    const response = await axios.post(
      `http://localhost:3001/api/v1/business-service/businesses/${slug}/dish`,

      {
        name: formData.name,
        description: formData.description,
        // cuisine_type: "indian",
        // meal_type: formData.meal_type,
        // category: formData.category,
        posted_at: formData.posted_at,
        expires_at: formData.expires_at,
        notes: formData.notes,
        ingredients: formData.ingredients,
        food_type: formData.food_type,
        quantity: formData.quantity,
        status: "available",
        // price: Number(formData.price),
        thumbnails: formData.thumbnails,
      },
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
