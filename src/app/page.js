import { IBM_Plex_Mono } from "next/font/google";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export default function Home() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="flex flex-col items-center justify-center">
        <p className="text-black text-lg y-100" style={{ fontFamily: ibmPlexMono.style.fontFamily }}>
          todays prompt is...
        </p>
        <p className="text-darkGreen text-lg">prompt</p>
      </div>
    </div>
  );
}