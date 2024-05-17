import { useState } from "react";
import { toast } from "react-toastify";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/router";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["500"],
});

export default function Dashboard() {

  return (
    <div>

    </div>
  );
}
