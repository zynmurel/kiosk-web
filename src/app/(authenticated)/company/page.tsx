"use client";

import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectLabel } from "@/components/ui/select";
import { log } from "console";
import { Settings, Settings2, SettingsIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const router = useRouter();
  const [diaglogOpenAddEdit, setDialogOpenAddEdit] = useState(false);

  console.log("====================================");
  console.log(diaglogOpenAddEdit);
  console.log("====================================");
  const [dialogViewOpen, setDialogViewOpen] = useState(
    Array(16).fill(false), // Initialize an array of 16 elements, all set to false
  );

  const handleOpenChangeAddEditDialog = (open: boolean) => {
    setDialogOpenAddEdit(open);
  };

  const handleOpenChangeView = (index: number, open: boolean) => {
    setDialogViewOpen((prevState) => {
      const newState = [...prevState];
      newState[index] = open;
      return newState;
    });
  };

  return (
    <div className="h-screen w-full">
      <div className="mb-10 flex w-full items-center justify-end pr-14">
        <Dialog
          open={diaglogOpenAddEdit}
          onOpenChange={handleOpenChangeAddEditDialog}
        >
          <DialogTrigger asChild>
            <Button className="">Add Products </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogDescription className="mb-5">
                Study hard to earn points and get a chance to redeem them for
                vouchers at the shop. Make the most of this opportunity!
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center gap-4">
              <div>
                <Card className="roundzed-sm flex flex-col justify-center shadow-md drop-shadow-md">
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
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-4">
                  <Label>Product Name</Label>
                  <Input />
                </div>

                <div className="flex flex-col gap-4">
                  <Label>Product Description</Label>
                  <Input />
                </div>

                <div className="flex flex-col gap-4">
                  <Label>Voucher </Label>
                  <Input type="number" />
                </div>

                <div className="flex flex-col gap-4">
                  <Label>Quantity </Label>
                  <Input
                    placeholder="Quantity"
                    type="number"
                    defaultValue={1}
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <Label>Product Image </Label>
                  <Input placeholder="Quantity" type="file" />
                </div>
              </div>
            </div>

            <DialogFooter>
              <div className="mt-10 flex w-full items-center justify-between">
                <div className="flex cursor-pointer items-center gap-2 rounded-md border bg-teal-700 p-2 text-white">
                  <div className="rounded-full bg-white p-1">
                    <img src="nwssuLogo.png" width={20} />
                  </div>
                  <Label className="cursor-pointer text-xs font-thin">
                    10% deduction for all products
                  </Label>
                </div>
                <Button
                  className="bg-teal-700 text-xs font-extralight hover:bg-teal-700"
                  type="submit"
                >
                  CREATE PRODUCT
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Input
        placeholder="filter  subject name.."
        className="my-1 ml-10 flex w-72"
      />

      <div className="grid cursor-pointer grid-cols-4 gap-10 px-10 py-5 pb-10">
        {Array.from({ length: 16 }).map((_, index) => (
          <Dialog
            key={index}
            open={dialogViewOpen[index]}
            onOpenChange={(open) => handleOpenChangeView(index, open)}
          >
            <DialogTrigger asChild>
              <Card
                key={index}
                className="roundzed-sm relative flex flex-col items-center justify-center shadow-md drop-shadow-md"
              >
                <div className="relative flex w-full items-center justify-center">
                  {" "}
                  <div className="flex w-full items-center justify-between bg-teal-700 p-2 text-start text-xs font-semibold text-white underline">
                    <span>PAPER</span>
                  </div>
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
                  src="/nwssuLogo.png"
                  width={20}
                />
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogDescription className="mb-5">
                  Study hard to earn points and get a chance to redeem them for
                  vouchers at the shop. Make the most of this opportunity!
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center justify-center gap-4">
                <div>
                  <Card
                    key={index}
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
                  <div className="flex w-full items-center justify-end">
                    <Button
                      size={"sm"}
                      className="bg-[#166d66] text-xs font-bold text-yellow-200"
                      onClick={() => {
                        handleOpenChangeView(index, false);
                        setDialogOpenAddEdit(true);
                      }}
                    >
                      Edit Product
                    </Button>
                  </div>
                  <Label className="mb-2 mt-10 font-extrabold text-teal-700">
                    PAPER
                  </Label>
                  <Label className="w-40 rounded-md bg-yellow-50 p-2 text-xs leading-6 text-gray-400">
                    Eco-friendly, high-quality paper product designed for
                    everyday use, providing a smooth writing experience with
                    durable and sustainable materials.
                  </Label>
                </div>
              </div>

              <DialogFooter>
                <div className="mt-10 flex w-full items-center justify-between">
                  <div className="flex w-full cursor-pointer items-center gap-2 rounded-md border bg-teal-600 p-2 text-white">
                    <div className="rounded-full bg-white p-1">
                      <img src="nwssuLogo.png" width={20} />
                    </div>
                    <Label className="ml-20 cursor-pointer text-xs font-thin">
                      10% total cost deduction voucher
                    </Label>
                  </div>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
};

export default Page;
