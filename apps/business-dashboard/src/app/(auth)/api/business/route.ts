import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(request: NextApiRequest, res: NextApiResponse) {
  const session: any = await getServerSession(authOptions);

  try {
    // fetch data from business apis from proxy
    // GET SERVER SIDE SESSION AND PASS TOKEN TO NESTJS APIS
    const response = await axios.get(
      `http://localhost:3001/api/v1/business-service/businesses/`,
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

export async function POST(request: Request) {
  const session: any = await getServerSession(authOptions);

  if (!session || !session.user?.access_token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.json(); // Properly parsing the request body

    const response = await axios.post(
      "http://localhost:3001/api/v1/business-service/businesses",
      {
        name: formData.name,
        description: formData.description,
        average_price: formData.average_price,
        latitude: formData.latitude,
        longitude: formData.longitude,
        contact_no: formData.contact_no,
        banner: formData.banner,
        delivery_options: formData.delivery_options,
        pickup_options: formData.pickup_options,
        opens_at: formData.opens_at,
        closes_at: formData.closes_at,
        address: {
          name: formData.address.name,
          city: formData.address.city,
          state: formData.address.state,
          street: formData.address.street,
          pincode: formData.address.pincode,
          country: formData.address.country,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${session.user.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data, { status: 201 });
  } catch (err) {
    console.error("Error creating business:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
