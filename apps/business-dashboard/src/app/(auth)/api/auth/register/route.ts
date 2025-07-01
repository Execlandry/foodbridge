import { NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://localhost:3002/api/v1/users";
const AUTH_TOKEN =
  process.env.AUTH_TOKEN ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjZWUzNzg1Ny1jNDBjLTQ5ZWMtYWZhYS0wYTE1NDdmN2Y3MGMiLCJlbWFpbCI6InRAZ21haWwuY29tIiwicGVybWlzc2lvbnMiOiJidXNpbmVzcy1hZG1pbiIsImlhdCI6MTc0MzU3NzI0NCwiZXhwIjoxNzQzNjYzNjQ0fQ.9v_XmBUdbGKJy-vAr6SCm6eBM5__Ge1rcTI9syEzRoM";

interface UserRequestBody {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  role?: string;
}

const getHeaders = () => ({
  accept: "application/json",
  Authorization: `Bearer ${AUTH_TOKEN}`,
  "Content-Type": "application/json",
});

export async function POST(req: Request) {
  try {
    const body: UserRequestBody = await req.json();
    const { email, first_name, last_name, password, role } = body;

    if (!email || !first_name || !last_name || !password) {
      return NextResponse.json(
        { message: "Email, first name, last name, and password are required" },
        { status: 400 }
      );
    }

    // Create the user
    const userResponse = await fetch(API_URL, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, first_name, last_name, password }),
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      return NextResponse.json(
        { message: errorData.message || "User creation failed" },
        { status: userResponse.status }
      );
    }

    const user = await userResponse.json();
    console.log("User created successfully:", user);

    // Assign permissions if role is "Restaurant"
    if (role === "Restaurant" && user.id) {
      try {
        const permissionUrl = `${API_URL}/assign-permissions/${user.id}`;
        console.log("Assigning permissions at:", permissionUrl);

        const permissionResponse = await fetch(permissionUrl, {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify({ permissions: "business-admin" }), // Fixed here
        });

        if (!permissionResponse.ok) {
          const errorData = await permissionResponse.json();
          console.error("Permission assignment failed:", {
            status: permissionResponse.status,
            message: errorData.message,
            error: errorData.error,
          });

          if (permissionResponse.status === 401) {
            console.error("Unauthorized: Token may be invalid or expired");
          } else if (permissionResponse.status === 403) {
            console.error("Forbidden: Token lacks necessary permissions");
          }
        } else {
          const permissionData = await permissionResponse.json();
          console.log("Permissions assigned successfully:", permissionData);
        }
      } catch (permissionError) {
        console.error(
          "Permission assignment error:",
          permissionError instanceof Error
            ? permissionError.message
            : String(permissionError)
        );
      }
    }

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error(
      "User registration error:",
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
