import { useState } from "react";
import { toast } from "react-toastify";
import { Poppins } from "next/font/google";
import Image from "next/image";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["500"],
});

export default function Home() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email === "user@example.com" && password === "password") {
      toast.success("Logged in!");
    } else {
      toast.error("Failed to login.");
    }
  };

  return (
    <div>
      
    </div>
  );
}
