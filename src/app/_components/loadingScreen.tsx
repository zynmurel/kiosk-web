import { Label } from "@/components/ui/label";
import React from "react";

const LoadingScreen = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="an flex animate-bounce items-center gap-4">
        <img
          width={50}
          height={50}
          src="images/logo.png"
          className="animate-spin"
        />
        <Label className="animate-pulse font-bold text-teal-700">
          Loading....
        </Label>
      </div>
    </div>
  );
};

export default LoadingScreen;
