import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Poppins } from "next/font/google";
import { useRouter } from "next/router";
import { onValue, ref } from "firebase/database";
const { app, database, auth } = require("../firebaseConfig");
import { signOut } from "firebase/auth";

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
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await localStorage.removeItem("currentUser");
      router.push("/");

      console.log("User logged out");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  interface RoomData {
    id: string;
    user: {
      email: string;
      // tambahkan properti lain jika ada
    };
    rooms_name: string;
    current_temp: number;
    current_noise: number;
    isDoorOpen: boolean;
    max_temp: number; // Tambahkan properti max_temp
    max_noise: number; // Tambahkan properti max_noise
    // tambahkan properti lain jika ada
  }

  useEffect(() => {
    async function fetchData() {
      // ambil currentUser
      const email = localStorage.getItem("currentUser");
      // ambil realtimeDatabase
      try {
        const roomsRef = ref(database, "rooms");
        onValue(roomsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const roomsArray = Object.entries(data).map(([key, value]) => {
              // Memastikan bahwa value adalah objek yang memiliki struktur yang sesuai
              const roomData = value as {
                user: { email: string };
                rooms_name: string;
                current_temp: string;
                current_noise: string;
                isDoorOpen: boolean;
                max_temp: number;
                max_noise: number;
              };
              return { id: key, ...roomData };
            });
            roomsArray.forEach((el) => {
              if (el.user && el.user.email === email) {
                console.log(el);
                setRoom(el.rooms_name);
                setTemp(el.current_temp);
                setNoise(el.current_noise);
                setLocked(el.isDoorOpen);
                setTempLimit(el.max_temp.toString());
                setNoiseLimit(el.max_noise.toString());
              }
            });
          } else {
            console.log("No data available");
          }
        });
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
    fetchData();
    const interval = setInterval(() => {
      fetchData(); // Panggilan setiap 15 detik
    }, 15000);

    return () => clearInterval(interval); // Membersihkan interval saat komponen dibongkar
  }, []);

  // useEffect(() => {
  //   async function fetchData() {
  //     // ambil currentUser
  //     const email = localStorage.getItem('currentUser');
  //     // ambil realtimeDatabase
  //     try {
  //       const rooms = ref(database, 'rooms')
  //       onValue(rooms, (snapshot) => {
  //         const data = snapshot.val();
  //         const roomsArray = Object.entries(data).map(([key, value]) => {
  //           // Mengonversi value ke tipe Record<string, unknown>
  //           const roomData: Record<string, unknown> = value as Record<string, unknown>;
  //           return { id: key, ...roomData };
  //         });
  //         console.log(roomsArray);
  //       })
  //     } catch (err) {
  //       console.log(err);
  //     }

  //     // cari yang emailnya sama, simpen di variable local
  //     // set localStorage "currentUserData" dari object yg emailnya sama
  //     // ambil setiap atribut dan masukkan ke dalam variable useState
  //   }
  // }, [])

  return (
    <div className="flex flex-col h-full bg-[#9BB8CD] justify-start align-center text-center p-10">
      <p className={`${poppinsXB.className} text-2xl md:text-4xl pb-5`}>
        Dashboard Penghuni
      </p>
      <p className={`${poppinsB.className} text-xl md:text-2xl pb-5`}>{room}</p>
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
      <div className="w-3/4 justify-center self-center p-10 m-5 bg-white rounded-3xl shadow-xl">
        <p className={`${poppins.className} text-base md:text-xl pb-5`}>
          Suhu ruangan: {temp} °C
        </p>
        <p className={`${poppins.className} text-base md:text-xl`}>
          Tingkat kebisingan: {noise} dB
        </p>
      </div>
      <div className="w-3/4 justify-center self-center p-10 m-5 bg-white rounded-3xl shadow-xl">
        {lockOn ? (
          <p className={`${poppins.className} text-base md:text-lg`}>
            Saat ini, ruangan anda{" "}
            <span className="font-bold text-[#B1C381]">
              {locked ? "tidak terkunci" : "terkunci"}
            </span>
          </p>
        ) : null}
      </div>
      <div className="w-3/4 justify-center self-center p-10 m-5 bg-white rounded-3xl shadow-xl">
        <button
          className={`${poppinsXB.className} bg-[#EEC759] w-1/3 h-fit border-2 border-[#BF9C3B] text-xs md:text-lg rounded-full shadow-xl p-2 mt-3`}
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
