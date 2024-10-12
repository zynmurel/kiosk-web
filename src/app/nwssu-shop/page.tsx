"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CircleAlert,
  CircleDollarSign,
  LogOut,
  Search,
  ShoppingBag,
  User,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { api } from "@/trpc/react";
import { useState } from "react";
import SkeletalLoading from "@/app/_components/skelal";
import { useStore } from "@/lib/store/app";
import { logoutStudent } from "@/lib/api-helper/auth";

export default function Page() {
  const { user } = useStore();
  const [search, setSearch] = useState<string>("");
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading } = api.shop.product.getAllProductOfBusiness.useQuery(
    {},
  );

  const filteredData = data?.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );

  const { data: points } = api.student.points.getTotalPointsOfStudents.useQuery(
    { studentId: String(user?.username) },
  );

  const handlePurchase = () => {
    if (user?.username) {
      console.log("successfully purchased");
    } else {
      router.push("/login-student/nwssu-shop");
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="my-10 ml-20">
          <SkeletalLoading />
          <SkeletalLoading />
          <SkeletalLoading />
          <SkeletalLoading />
          <SkeletalLoading />
        </div>
      ) : (
        <div className="h-screen w-full">
          <div className="flex w-full items-center justify-between bg-teal-700 p-2 py-5 md:flex-row md:px-10">
            <div
              className="flex cursor-pointer items-center gap-4"
              onClick={() => router.push(`/nwssu-shop`)}
            >
              <CircleDollarSign className="text-white" size={50} />
              <Label className="text-lg text-white md:text-xl">
                NWSSU PORTAL SHOP
              </Label>
            </div>

            <div className="flex flex-col items-end gap-4">
              <div className="relative flex items-center justify-center md:mt-0">
                <Input
                  placeholder=" Search in shop "
                  className="w-64 md:w-96"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="absolute right-2 top-1 cursor-pointer rounded-sm bg-teal-700 p-2">
                  <Search className="text-white" size={15} />
                </div>
              </div>
            </div>
          </div>

          <div className="h-full w-full p-4 md:p-10">
            {filteredData?.length === 0 ? (
              <div className="flex h-full w-full flex-col items-center justify-center text-center">
                <CircleAlert />
                <Label className="text-lg font-bold text-gray-600">
                  No products found
                </Label>
                <Label className="text-md text-gray-500">
                  Try searching for something else.
                </Label>
              </div>
            ) : (
              <div className="hover:bright grid grid-cols-2 gap-4 px-2 py-5 md:grid-cols-4 md:gap-10">
                {filteredData?.map((data, index) => (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <Card className="flex cursor-pointer flex-col items-center justify-center rounded-sm shadow-md drop-shadow-md">
                        <div className="w-full bg-teal-700 p-2 text-start text-xs font-semibold text-white underline">
                          {data.name}
                        </div>
                        <div className="px-4 py-6 font-semibold text-teal-700">
                          <img
                            alt="product image"
                            src={data.imageUrl}
                            width={150}
                            height={150}
                          />
                        </div>
                        <div className="flex w-full items-start justify-between bg-green-50 px-4 pb-2 pt-4 font-semibold text-teal-700">
                          <div className="flex items-center gap-3">
                            <Label className="text-xs font-bold">
                              {data.cost} Points
                            </Label>
                            <Label className="text-xs font-extralight">
                              {data._count.PurchasedProduct} sold
                            </Label>
                          </div>
                          <Label className="cursor-pointer text-xs font-light">
                            {data.owner.title}
                          </Label>
                        </div>
                        <img
                          className="absolute left-5 top-10"
                          src="/images/logo.png"
                          width={20}
                          alt="Logo"
                        />
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogDescription className="mb-5">
                          Study hard to earn points and get a chance to redeem
                          them for vouchers at the shop.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex items-center justify-center gap-4">
                        <div className="relative min-h-56 max-w-36 bg-yellow-50">
                          <Card className="flex h-full flex-col justify-center rounded-sm shadow-md drop-shadow-md">
                            <div className="w-full bg-teal-700 p-2 text-start text-xs font-semibold text-white underline"></div>
                            <div className="flex flex-1 items-center justify-center px-4 py-6 font-semibold text-teal-700">
                              <img
                                alt="product image"
                                src={
                                  "https://papercart.ph/cdn/shop/products/2_dc962939-3130-4a01-967f-f5a392f5ac84.jpg?v=1701933159&width=1946"
                                }
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </Card>
                        </div>

                        <div className="flex flex-col">
                          <Label className="mb-2 font-extrabold text-teal-700">
                            PAPER
                          </Label>
                          <Label className="max-h-36 min-h-36 overflow-scroll rounded-md bg-yellow-50 p-2 text-xs leading-6 text-gray-400">
                            Eco-friendly, high-quality paper product for
                            everyday use.
                          </Label>
                          <Label className="mb-4 mt-5 text-xs font-medium text-teal-700">
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
                            onClick={() =>
                              router.push(`/nwssu-shop/${data.bussinessId}`)
                            }
                            className="flex cursor-pointer items-center gap-2 rounded-md border bg-teal-600 p-2 text-white hover:bg-teal-400"
                          >
                            <div className="rounded-full bg-white p-1">
                              <img
                                src="/images/logo.png"
                                width={20}
                                alt="Logo"
                              />
                            </div>
                            <Label className="text-xs font-thin">
                              {data.owner.title} SHOP
                            </Label>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button className="bg-teal-700 text-xs font-light tracking-widest hover:bg-teal-500">
                                PURCHASE
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Confirm Purchase
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to purchase this item?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handlePurchase}>
                                  Confirm
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
