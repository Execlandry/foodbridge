import axios from "axios";

export class ExternalApis {
  // proxy gateway url
  public static url = "http://localhost:3000/api/v1";
  static sleep() {
    return new Promise((a, b) => {
      setTimeout(() => {
        a(null);
      }, 2000);
    });
  }
  static async fetchCart() {
    const url = `${this.url}/cart-service/cart`;
    // cookies have token
    const response = await axios.get(url);
    return response.data;
  }
  static async addCartItems(payload: any) {
    const url = `${this.url}/cart-service/cart`;
    console.log("payload : ", payload);
    const response = await axios.post(url, payload);
    return response.data;
  }

  static async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("filename", file);
    try {
      const response = await fetch("http://localhost:3008/api/v1/files", {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Image upload failed! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("data:", data);
      if (!data[0].url) {
        throw new Error("No URL returned from image upload");
      }

      return data[0].url;
    } catch (error: any) {
      throw new Error(`Error uploading image: ${error.message}`);
    }
  }

  static async removeCartItems(payload: any) {
    const url = `${this.url}/cart-service/cart`;
    const response = await axios.put(url, payload);
    return response.data;
  }

  static async EmptyCart() {
    const url = `${this.url}/cart-service/cart/clear`;
    const response = await axios.delete(url);
    console.log("Cart Emptied", response.data);
    return response.data;
  }

  static async fetchAddress(id: any) {
    const url = `/api/v1/auth-service/users/address/${id}`;
    const response = await axios.get(url);
    return response.data;
  }

  static async createAddress(id: any, payload: any) 
  {
    const url = `/api/v1/auth-service/users/address/${id}`;
    const response = await axios.post(url, payload);
    return response.data;
  }

  static async FetchDeliveryOrder(id: any) {
    const url = `/api/v1/delivery-service/delivery/fetchOrder/${id}`;
    const response = await axios.get(url);
    return response.data;
  }
  static async createPayment({ cart }: any) {
    const response = await axios.post("/api/v1/payment-service/payments", cart);
    return response.data;
  }

  static async updatePayment({ cart }: any) {
    const response = await axios.put(
      "/api/v1/payment-service/payments/confirm-payment",
      cart
    );
    return response.data;
  }

  static async updatePaymentStatusSuccess({ cart }: any) {
    const response = await axios.put("/api/v1/payments", {
      status: "success",
      ...cart,
    });
    return response.data;
  }

  static async updatePaymentStatusFailed({ cart }: any) {
    const response = await axios.put("/api/v1/payments", {
      status: "failure",
      ...cart,
    });
    return response.data;
  }

  static async createOrder(data: any) {
    console.log("order", data);
    const response = await axios.post("/api/v1/order-service/order", data);
    console.log(response.data);
    return response.data;
  }
  

  static async fetchAllOrders() {
    const response = await axios.get("/api/v1/order-service/order/all");
    return response.data;
  }

  static async UpdateDishStatus(data: any) {
    const status = { status: data.status };
    const response = await axios.put(
      `/api/v1/business-service/businesses/${data.business}/dish/${data.dish}`,
      status
    );
    console.log(response.data);
    return response.data;
  }

  static async fetchLatestOrder() {
    const response = await axios.get("/api/v1/order-service/order");
    return response.data;
  }
  static async confirmOrder(id: string) {
    const response = await axios.patch(
      `/api/v1/order-service/order/${id}?status=success`
    );
    return response.data;
  }
  static async confirmPayment(id: string) {
    const response = await axios.patch(
      `/api/v1/payment-service/payments/${id}?status=success`
    );
    return response.data;
  }
  static async cancelOrder(id: string) {
    const response = await axios.patch(
      `/api/v1/order-service/order/${id}?status=failure`
    );
    return response.data;
  }
  static async cancelPayment(id: string) {
    const response = await axios.patch(
      `/api/v1/payment-service/payments/${id}?status=failure`
    );
    return response.data;
  }
}
