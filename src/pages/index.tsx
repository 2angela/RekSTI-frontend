import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/router";
import {get, ref} from 'firebase/database'
const {app, database} = require("../firebaseConfig");
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["500"],
});
const auth = getAuth(app)

const poppinsB = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["600"],
});

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
      const cred = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("currentUser", email);
      router.push("/dashboard");
    
  }
    catch(err){
      toast.error("Failed to login.");
    }
  };

  return (
    <section
      className={
        "min-h-screen flex flex-col justify-center align-center items-center text-center bg-[#9BB8CD] p-16 " +
        poppins.className
      }
    >
      <Image
        className="mx-auto mb-20"
        src={"/dorm.png"}
        alt="Logo"
        width={800}
        height={400}
      />
      <form
        className="bg-white px-7 py-12 rounded-3xl md:w-[500px]"
        onSubmit={handleLogin}
      >
        <h1 className="mb-5 text-xl">Login to your account</h1>
        <input
          className="bg-[#FFF7D4] px-6 py-3 rounded-full drop-shadow-lg text-sm mb-5 w-full"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          className="bg-[#FFF7D4] px-6 py-3 rounded-full drop-shadow-lg text-sm mb-5 w-full"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button
          className={"bg-[#EEC759] text-white px-6 py-3 rounded-full text-sm w-full " + poppinsB.className}
          type="submit"
        >
          Submit
        </button>
      </form>
    </section>
  );
}
