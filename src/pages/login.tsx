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
    <section
      className={
        "min-h-screen flex flex-col justify-center items-center text-center bg-[#2E4F4F] p-16 " +
        poppins.className
      }
    >
      <Image
        className="mx-auto"
        src={"/logo.png"}
        alt="Logo"
        width={400}
        height={400}
      />
      <form
        className="bg-white px-7 py-12 rounded-3xl md:w-[500px]"
        onSubmit={handleLogin}
      >
        <h1 className="mb-5">Login to your account</h1>
        <input
          className="bg-[#CBE4DE] px-6 py-3 rounded-full drop-shadow-lg text-sm mb-5 w-full"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          className="bg-[#CBE4DE] px-6 py-3 rounded-full drop-shadow-lg text-sm mb-5 w-full"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button
          className="bg-[#2E4F4F] text-white px-6 py-3 rounded-full text-sm w-full"
          type="submit"
        >
          Submit
        </button>
      </form>
    </section>
  );
}
