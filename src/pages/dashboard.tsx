import { useState } from "react";
import { toast } from "react-toastify";
import { Poppins } from "next/font/google";
import { useRouter } from "next/router";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["500"],
});

const poppinsB = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["600"],
});

const poppinsXB = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["800"],
});

export default function Dashboard() {
  const [room, setRoom] = useState("");
  const [temp, setTemp] = useState("");
  const [noise, setNoise] = useState("");
  const [tempLimit, setTempLimit] = useState("");
  const [noiseLimit, setNoiseLimit] = useState("");
  const [locked, setLocked] = useState(false);
  const [lockOn, setLockOn] = useState(true);

  return (
    <div className="flex flex-col h-screen bg-[#9BB8CD] justify-start align-center text-center p-10">
      <p className={`${poppinsXB.className} text-2xl md:text-4xl pb-5`}>
        Dashboard Penghuni
      </p>
      <p className={`${poppinsB.className} text-xl md:text-2xl pb-5`}>
        Kamar {room}
      </p>
      <p className={`${poppinsB.className} text-base md:text-lg text-white`}>
        Batas minimum ruangan kamar: {tempLimit}
      </p>
      <p className={`${poppinsB.className} text-base md:text-lg text-white`}>
        Batas maksimum kebisingan kamar: {noiseLimit}
      </p>
      <p
        className={`${poppins.className} text-xs md:text-base text-[#FF0000] pt-2 pb-5`}
      >
        Peringatan akan diberikan jika suhu dan/atau kebisingan melewati ambang
        batas yang telah ditentukan, dan jika pintu tidak terkunci.
      </p>
      <div className="w-3/4 justify-center self-center p-10 m-5 bg-white rounded-3xl shadow shadow-xl">
        <p className={`${poppins.className} text-base md:text-xl pb-5`}>
          Suhu ruangan: {temp} °C
        </p>
        <p className={`${poppins.className} text-base md:text-xl`}>
          Tingkat kebisingan: {noise} dB
        </p>
      </div>
      <div className="w-3/4 justify-center self-center p-10 m-5 bg-white rounded-3xl shadow shadow-xl">
        {lockOn ? (
          <p className={`${poppins.className} text-base md:text-lg`}>
            Saat ini, ruangan anda{" "}
            <span className="font-bold text-[#B1C381]">
              {locked ? "terkunci" : "tidak terkunci"}
            </span>
          </p>
        ) : null}
        <p className={`${poppins.className} text-sm md:text-base pt-5`}>
          {lockOn
            ? "Matikan monitoring kunci pintu"
            : "Nyalakan monitoring kunci pintu"}
        </p>
        <button
          className={`${poppinsXB.className} bg-[#EEC759] w-1/3 h-fit border-2 border-[#BF9C3B] text-xs md:text-lg rounded-full shadow shadow-xl p-2 mt-3`}
          onClick={() => {
            setLockOn(!lockOn);
            toast.success("Lock monitoring changed");
          }}
        >
          TURN {lockOn ? "OFF" : "ON"}
        </button>
      </div>
    </div>
  );
}
