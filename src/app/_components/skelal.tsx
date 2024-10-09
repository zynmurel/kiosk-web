import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const SkeletalLoading = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="h-6 w-1/2 animate-pulse bg-gray-300 text-xl font-medium"></CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-4 w-1/3 animate-pulse bg-gray-300 text-xs font-bold"></div>
      </CardContent>
    </Card>
  );
};

export default SkeletalLoading;
