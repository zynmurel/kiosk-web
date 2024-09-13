"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleDollarSign, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Page = () => {
  const router = useRouter();
  return (
    <div className="h-screen w-full">
      <div className="flex h-10 w-full items-start justify-around bg-teal-700 pt-2">
        <div className="flex items-start">
          <p className="border-r-2 border-gray-300 px-3 text-xs text-white">
            Discount{" "}
          </p>
          <p className="border-r-2 border-gray-300 px-3 text-xs text-white">
            Voucher{" "}
          </p>
          <p className="border-r-2 border-gray-300 px-3 text-xs text-white">
            Enjoy{" "}
          </p>
          <p className="border-r-2 border-gray-300 px-3 text-xs text-white">
            Redeem your points
          </p>
        </div>
        <div className="flex items-center justify-start">
          <p className="border-r-2 border-gray-300 px-3 text-sm text-white">
            Total points:
          </p>
          <p className="ml-2 rounded-lg bg-white p-2 text-xs font-bold text-teal-700">
            20000 points
          </p>
          <p className="border-r-2 border-gray-300 px-3 text-xs text-white">
            ...
          </p>
          <button className="border-gray-00 ml-10 rounded-md bg-teal-900 p-2 px-3 text-xs font-extrabold text-white">
            LOGIN
          </button>
        </div>
      </div>
      <div className="flex h-20 w-full items-start justify-around bg-teal-700 pt-2">
        <div
          className="flex items-center gap-4"
          onClick={() => router.push("/store")}
        >
          <CircleDollarSign className="cursor-pointer text-white" size={50} />
          <Label className="cursor-pointer text-xl text-white">
            NWSSU PORTAL SHOP
          </Label>
        </div>
        <div className="relative mt-4 flex items-center justify-start">
          <Input placeholder=" Search in shop " className="w-96" />
          <div className="absolute right-5 top-1 cursor-pointer rounded-sm bg-teal-700 px-2 py-1">
            <Search className="bg-teal-700 text-white" />
          </div>
        </div>
      </div>

      <div className="h-screen w-full p-20">
        <div className="grid cursor-pointer grid-cols-4 gap-10 px-10 py-5 pb-10">
          {Array.from({ length: 16 }).map((_, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <Card
                  key={index}
                  className="roundzed-sm flex flex-col items-center justify-center shadow-md drop-shadow-md"
                >
                  <div className="flext w-full bg-teal-700 p-2 text-start text-xs font-semibold text-white underline">
                    PAPER
                  </div>
                  <div className="px-4 py-6 font-semibold text-teal-700">
                    <img
                      alt="product image"
                      src={
                        "https://papercart.ph/cdn/shop/products/2_dc962939-3130-4a01-967f-f5a392f5ac84.jpg?v=1701933159&width=1946"
                      }
                      width={200}
                      height={200}
                    />
                  </div>
                  <div className="border-t-orange-2 flex w-full items-start justify-between bg-green-50 px-4 pb-2 pt-4 font-semibold text-teal-700">
                    <div className="flex items-center justify-center gap-3">
                      <Label className="text-xs font-bold">₱350.00</Label>
                      <Label className="text-xs font-extralight">
                        (300 sold)
                      </Label>
                    </div>
                    <Label className="text-xs font-light">Paper Prince</Label>
                  </div>
                  <img
                    className="absolute left-5 top-10"
                    src="nwssuLogo.png"
                    width={20}
                  />
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogDescription className="mb-5">
                    Study hard to earn points and get a chance to redeem them
                    for vouchers at the shop. Make the most of this
                    opportunity!
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center gap-4">
                  <div>
                    <Card
                      key={`card-${index}`}
                      className="roundzed-sm flex flex-col justify-center shadow-md drop-shadow-md"
                    >
                      <div className="flext w-full bg-teal-700 p-2 text-start text-xs font-semibold text-white underline"></div>
                      <div className="px-4 py-6 font-semibold text-teal-700">
                        <img
                          alt="product image"
                          src={
                            "https://papercart.ph/cdn/shop/products/2_dc962939-3130-4a01-967f-f5a392f5ac84.jpg?v=1701933159&width=1946"
                          }
                          width={200}
                          height={200}
                        />
                      </div>
                      <div className="border-t-orange-2 flex w-full items-start justify-between bg-green-50 px-4 pb-2 pt-4 font-semibold text-teal-700">
                        <div className="flex items-center justify-center gap-3">
                          <Label className="text-xs font-bold">₱350.00</Label>
                          <Label className="text-xs font-extralight">
                            (300 sold)
                          </Label>
                        </div>
                      </div>
                      <img
                        className="absolute left-5 top-10"
                        src="nwssuLogo.png"
                        width={20}
                      />
                    </Card>
                  </div>
                  <div className="flex flex-col">
                    <Label className="mb-2 mt-10 font-extrabold text-teal-700">
                      PAPER
                    </Label>
                    <Label className="w-40 rounded-md bg-yellow-50 p-2 text-xs leading-6 text-gray-400">
                      Eco-friendly, high-quality paper product designed for
                      everyday use, providing a smooth writing experience with
                      durable and sustainable materials.
                    </Label>

                    <Label className="font- mb-4 mt-5 text-xs font-medium text-teal-700">
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
                      className="flex cursor-pointer items-center gap-2 rounded-md border bg-teal-700 p-2 text-white"
                    >
                      <div className="rounded-full bg-white p-1">
                        <img src="nwssuLogo.png" width={20} />
                      </div>
                      <Label className="cursor-pointer text-xs font-thin">
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
