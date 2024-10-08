"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleDollarSign, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

const Page = () => {
  const router = useRouter();
  return (
    <div className="h-screen w-full">
      {/* Shop Section */}
      <div className="flex h-20 w-full flex-col items-start justify-between bg-teal-700 p-2 md:flex-row md:justify-around">
        <div
          className="flex cursor-pointer items-center gap-4"
          onClick={() => router.push("/store")}
        >
          <CircleDollarSign className="text-white" size={50} />
          <Label className="text-xl text-white">NWSSU PORTAL SHOP</Label>
        </div>
        <div className="relative flex items-center justify-center md:mt-0">
          <Input placeholder=" Search in shop " className="w-64 md:w-96" />
          <div className="absolute right-2 top-1 cursor-pointer rounded-sm bg-teal-700 p-2">
            <Search className="text-white" size={15} />
          </div>
        </div>
      </div>

      <div className="h-full w-full p-4 md:p-10">
        <div className="grid grid-cols-2 gap-4 px-2 py-5 md:grid-cols-4 md:gap-10">
          {Array.from({ length: 16 }).map((_, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <Card
                  key={index}
                  className="flex flex-col items-center justify-center rounded-sm shadow-md drop-shadow-md"
                >
                  <div className="w-full bg-teal-700 p-2 text-start text-xs font-semibold text-white underline">
                    PAPER
                  </div>
                  <div className="px-4 py-6 font-semibold text-teal-700">
                    <img
                      alt="product image"
                      src={
                        "https://papercart.ph/cdn/shop/products/2_dc962939-3130-4a01-967f-f5a392f5ac84.jpg?v=1701933159&width=1946"
                      }
                      width={150}
                      height={150}
                    />
                  </div>
                  <div className="flex w-full items-start justify-between bg-green-50 px-4 pb-2 pt-4 font-semibold text-teal-700">
                    <div className="flex items-center gap-3">
                      <Label className="text-xs font-bold">₱350.00</Label>
                      <Label className="text-xs font-extralight">
                        (300 sold)
                      </Label>
                    </div>
                    <Label className="text-xs font-light">Paper Prince</Label>
                  </div>
                  <img
                    className="absolute left-5 top-10"
                    src="images/logo.png"
                    width={20}
                  />
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogDescription className="mb-5">
                    Study hard to earn points and get a chance to redeem them
                    for vouchers at the shop.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center gap-4">
                  <div>
                    <Card
                      key={`card-${index}`}
                      className="flex flex-col justify-center rounded-sm shadow-md drop-shadow-md"
                    >
                      <div className="w-full bg-teal-700 p-2 text-start text-xs font-semibold text-white underline"></div>
                      <div className="px-4 py-6 font-semibold text-teal-700">
                        <img
                          alt="product image"
                          src={
                            "https://papercart.ph/cdn/shop/products/2_dc962939-3130-4a01-967f-f5a392f5ac84.jpg?v=1701933159&width=1946"
                          }
                          width={150}
                          height={150}
                        />
                      </div>
                    </Card>
                  </div>
                  <div className="flex flex-col">
                    <Label className="mb-2 font-extrabold text-teal-700">
                      PAPER
                    </Label>
                    <Label className="rounded-md bg-yellow-50 p-2 text-xs leading-6 text-gray-400">
                      Eco-friendly, high-quality paper product for everyday use.
                    </Label>
                    <Label className="mt-5 text-xs font-medium text-teal-700">
                      Quantity
                    </Label>
                    <Input
                      placeholder="Quantity"
                      type="number"
                      defaultValue={1}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <div className="mt-10 flex w-full items-center justify-between">
                    <div
                      onClick={() => router.push("/store/1")}
                      className="flex items-center gap-2 rounded-md border bg-teal-700 p-2 text-white"
                    >
                      <div className="rounded-full bg-white p-1">
                        <img src="logo.png" width={20} />
                      </div>
                      <Label className="text-xs font-thin">
                        PAPER PRINCE SHOP
                      </Label>
                    </div>
                    <Button
                      className="bg-teal-700 text-xs font-extralight hover:bg-teal-700"
                      type="submit"
                    >
                      REDEEM
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
