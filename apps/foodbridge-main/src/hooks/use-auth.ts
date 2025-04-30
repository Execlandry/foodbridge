import { useContext, useState } from "react";
import { UserContext, UserContextType } from "./user-context";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function useAuth() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext) as UserContextType;
  const [error, setError] = useState(null);

  const signupUser = async (data: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
  }) => {
    const { email, first_name, last_name, password } = data;
    try {
      const response = await axios.post(
        "/api/v1/auth-service/users",
        {
          email,
          first_name,
          last_name,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      // setUser({
      //   id: response.data.id,
      //   email: response.data.email,
      //   first_name: response.data.first_name,
      //   last_name: response.data.last_name,
      //   created_at: response.data.created_at,
      //   updated_at: response.data.updated_at,
      // });
      navigate("/fbe/business");
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Signup failed";
      setError(errorMessage);
      console.error("Signup failed:", err.response?.data || err);
      throw new Error(errorMessage);
    }
  };

  const registerUser = async (data: any) => {
    const { username, email, password, passwordConfirm } = data;
    return axios
      .post(`/api/v1/auth-service/auth/register`, {
        username,
        email,
        password,
        passwordConfirm,
      })
      .then(async () => {
        await setUserContext();
      })
      .catch((err: any) => {
        setError(err.response.data);
      });
  };

  const setUserContext = async () => {
    return await axios
      .get("/api/v1/auth-service/users/profile")
      .then((res: any) => {
        setUser(res.data);
        navigate("/fbe/business");
      })
      .catch((err: any) => {
        setError(err.response.data);
      });
  };

  const loginUser = async (data: { email: string; password: string }) => {
    const { email, password } = data;
    return axios
      .post(`/api/v1/auth-service/auth/login`, data)
      .then(async () => {
        await setUserContext();
      })
      .catch((err) => {
        setError(err.response.data);
      });
  };

  const logoutUser = async () => {
    setUser(null);
    return axios
      .get(`/api/v1/auth-service/auth/logout`)
      .then(async () => {
        navigate("/");
      })
      .catch((err: any) => {
        setError(err.response.data);
      });
  };

  return {
    signupUser,
    loginUser,
    registerUser,
    logoutUser,
    error,
  };
}
