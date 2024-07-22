"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-600 mb-4">Oops!</h1>
      <p className="text-2xl text-gray-700 mb-8">Something went wrong.</p>

      <Button>
        <Link href="/">Go back to Home</Link>
      </Button>
    </div>
  );
};

export default ErrorPage;
