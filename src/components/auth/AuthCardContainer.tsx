import React from "react";

interface AuthCardContainerProps {
  children: React.ReactNode;
}

export function AuthCardContainer({ children }: AuthCardContainerProps) {
  return (
    <div className="min-h-screen w-full bg-[#EAEFF6] flex items-center justify-center p-4 sm:p-6 lg:p-8 selection:bg-[#FF5B00] selection:text-white font-sans">
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-[1360px] xl:max-w-[1440px] min-h-0 lg:min-h-[780px] xl:min-h-[820px] bg-white rounded-2xl sm:rounded-3xl lg:rounded-[28px] overflow-hidden shadow-xl lg:shadow-2xl flex flex-col lg:flex-row border border-[#E2E8F0] relative">
        {children}
      </div>
    </div>
  );
}
