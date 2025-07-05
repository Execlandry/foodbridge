// File: app/api/business/[id]/route.ts

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route"; // adjust if needed
import axios from "axios";

// Dynamic route for GET /api/business/:id
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const slug = params.id;
    console.log("slug:", slug);

    const response = await axios.get(
      `http://localhost:3001/api/v1/order-service/order/business/all/${slug}`,
      {
        headers: {
          Authorization: `Bearer ${session?.user?.access_token}`,
        },
      }
    );

    const data = response.data;
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error("Error fetching business order:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
