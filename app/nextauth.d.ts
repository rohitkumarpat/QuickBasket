import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    role: "user" | "deliveryboy" | "admin";
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: "user" | "deliveryboy" | "admin";
    };
  }
}

export {};