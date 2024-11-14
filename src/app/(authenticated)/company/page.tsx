"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
  DialogTitle,
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";
import LoadingScreen from "@/app/_components/loadingScreen";
import { useToast } from "@/hooks/use-toast";
import { Trash } from "lucide-react";
import SkeletalLoading from "@/app/_components/skelal";
import { uploadImage } from "@/lib/upload-supabase/uploadImage";

const FormSchema = z.object({
  productName: z.string().min(1, {
    message: "Product name must be at least 1 character.",
  }),
  productDescription: z.string().min(1, {
    message: "Product description must be at least 1 character.",
  }),
  quantity: z.coerce.number().min(1, {
    message: "Quantity must be at least 1.",
  }),
  productImage: z.any(),
  cost: z.coerce.number().min(1, {
    message: "Quantity must be at least 1.",
  }),
});

type Product = {
  id: number;
  businessId?: number;
  name: string;
  imageUrl: string;
  cost: number;
  productImage?: string;
  description: string;
  quantity: number;
  owner: {
    title: string;
  };
};

export default function ProductManagement() {
  const { toast } = useToast();
  const [productData, setProductData] = useState<Product | null>(null);
  const [diaglogOpenAddEdit, setDialogOpenAddEdit] = useState(false);
  const [dialogViewOpen, setDialogViewOpen] = useState<boolean[]>([]);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    values: productData
      ? {
          productName: productData.name,
          productDescription: productData.description,
          quantity: productData.quantity,
          productImage: productData.productImage,
          cost: productData.cost,
        }
      : undefined,
  });

  const {
    data: companyProducts,
    refetch,
    isLoading,
  } = api.business.product.getAllProductOfBusiness.useQuery({ businessId: 1 });

  const addProduct = api.business.product.addProduct.useMutation({
    onSuccess: async () => {
      toast({
        title: "Successfully added new product",
      });
      await refetch();
      form.reset();
    },
  });

  const deleteProduct = api.business.product.deleteProduct.useMutation({
    onSuccess: async () => {
      setProductData(null);
      form.reset();
      toast({
        title: "Successfully deleted product",
      });
      await refetch();
    },
  });

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

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log("Form submitted with data:", data);

    const imageUrl = await uploadImage(data.productImage);

    await addProduct.mutateAsync({
      productId: productData?.id,
      name: data.productName,
      bussinessId: 1,
      imageUrl,
      cost: data.cost,
      description: data.productDescription,
      quantity: data.quantity,
    });

    setDialogOpenAddEdit(false);
  };

  const handleDelete = async () => {
    if (productData) {
      await deleteProduct.mutateAsync({
        productId: productData.id,
      });
      setDialogOpenAddEdit(false);
      setIsDeleteAlertOpen(false);
    }
  };

  if (!companyProducts) {
    return (
      <div className="mt-24">
        <SkeletalLoading />
        <SkeletalLoading />
        <SkeletalLoading />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-4 md:p-6 lg:p-8">
      <div className="mb-6 flex w-full items-center justify-end">
        <Dialog
          open={diaglogOpenAddEdit}
          onOpenChange={handleOpenChangeAddEditDialog}
        >
          <DialogTrigger asChild>
            <Button
              className="w-full md:w-auto"
              onClick={() => setProductData(null)}
            >
              Add Product
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[90%] md:max-w-[500px]">
            <DialogTitle>
              {productData ? "Edit product" : "Add product"}
            </DialogTitle>
            <DialogHeader>
              <DialogDescription className="mb-5">
                Study hard to earn points and get a chance to redeem them for
                vouchers at the shop. Make the most of this opportunity!
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
              <div
                className={`w-full md:w-1/2 ${!productData ? "hidden" : ""} `}
              >
                <Card className="flex flex-col justify-center rounded-sm shadow-md drop-shadow-md">
                  <div className="w-full bg-teal-700 p-2 text-start text-xs font-semibold text-white underline"></div>

                  <div className="px-4 py-6 font-semibold text-teal-700">
                    <div className="mx-auto h-[200px] w-[200px]">
                      {" "}
                      <img
                        alt="product image"
                        src={productData?.imageUrl}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="border-t-orange-2 flex w-full items-start justify-between bg-green-50 px-4 pb-2 pt-4 font-semibold text-teal-700">
                    <div className="flex items-center justify-center gap-3">
                      <Label className="text-xs font-bold">₱350.00</Label>
                      <Label className="text-xs font-extralight">
                        {/* (300 sold) */}
                      </Label>
                    </div>
                  </div>

                  <img
                    className="absolute left-5 top-10"
                    src="/images/logo.png"
                    width={20}
                    alt="Logo"
                  />
                </Card>
              </div>
              <div className={`w-full ${productData ? "md:w-1/2" : "w-full"} `}>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-4"
                  >
                    <div className="flex flex-col gap-3">
                      <FormField
                        control={form.control}
                        name="productName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="productDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Description</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cost</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="productImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Image</FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                onChange={(e) =>
                                  field.onChange(e.target.files?.[0])
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </form>
                </Form>
              </div>
            </div>

            <DialogFooter>
              <div
                className={`mt-6 flex w-full flex-col-reverse gap-4 sm:flex-row ${
                  !productData ? "sm:justify-end" : "sm:justify-between"
                }`}
              >
                {productData && (
                  <AlertDialog
                    open={isDeleteAlertOpen}
                    onOpenChange={setIsDeleteAlertOpen}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        className="w-full bg-red-500 text-xs font-extralight text-white hover:bg-red-600 sm:w-auto"
                        type="button"
                      >
                        DELETE THIS PRODUCT
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the product and remove the data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                <Button
                  className="w-full bg-teal-700 text-xs font-extralight hover:bg-teal-700 sm:w-auto"
                  type="submit"
                  onClick={form.handleSubmit(handleSubmit)}
                >
                  {productData ? "EDIT PRODUCT" : "CREATE PRODUCT"}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Input
        placeholder="Filter subject name..."
        className="my-4 w-full md:w-72"
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {companyProducts.map((product, index) => (
          <Dialog
            key={product.id}
            open={dialogViewOpen[index]}
            onOpenChange={(open) => handleOpenChangeView(index, open)}
          >
            <DialogTrigger asChild>
              <Card className="relative flex flex-col items-center justify-center rounded-sm shadow-md drop-shadow-md">
                <div className="relative flex w-full items-center justify-center">
                  <div className="flex w-full items-center justify-between bg-teal-700 p-2 text-start text-xs font-semibold text-white underline">
                    <Label>{product.name}</Label>
                  </div>
                </div>
                <div className="px-4 py-6 font-semibold text-teal-700">
                  <img
                    alt="product image"
                    src={product.imageUrl}
                    className="h-[200px] w-[200px] object-cover"
                  />
                </div>
                <div className="border-t-orange-2 flex w-full items-start justify-between bg-green-50 px-4 pb-2 pt-4 font-semibold text-teal-700">
                  <div className="flex items-center justify-center gap-3">
                    <Label className="text-xs font-bold">{`${product.cost} points`}</Label>
                    <Label className="text-xs font-extralight">
                      {/* (300 sold) */}
                    </Label>
                  </div>
                  <Label className="text-xs font-light">
                    {product.owner.title}
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
            <DialogContent className="sm:max-w-[90%] md:max-w-[500px]">
              <DialogHeader>
                <DialogDescription className="mb-5">
                  Study hard to earn points and get a chance to redeem them for
                  vouchers at the shop. Make the most of this opportunity!
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
                <div className="w-full md:w-1/2">
                  <Card className="flex flex-col justify-center rounded-sm shadow-md drop-shadow-md">
                    <div className="w-full bg-teal-700 p-2 text-start text-xs font-semibold text-white underline"></div>
                    <div className="px-4 py-6 font-semibold text-teal-700">
                      <img
                        alt="product image"
                        src="https://papercart.ph/cdn/shop/products/2_dc962939-3130-4a01-967f-f5a392f5ac84.jpg?v=1701933159&width=1946"
                        className="mx-auto w-full max-w-[200px]"
                      />
                    </div>
                    <div className="border-t-orange-2 flex w-full items-start justify-between bg-green-50 px-4 pb-2 pt-4 font-semibold text-teal-700">
                      <div className="flex items-center justify-center gap-3">
                        <Label className="text-xs font-bold">₱350.00</Label>
                        <Label className="text-xs font-extralight">
                          {/* (300 sold) */}
                        </Label>
                      </div>
                    </div>
                    <img
                      className="absolute left-5 top-10"
                      src="/images/logo.png"
                      width={20}
                      alt="Logo"
                    />
                  </Card>
                </div>
                <div className="flex w-full flex-col md:w-1/2">
                  <div className="flex w-full items-start justify-start">
                    <Button
                      size="sm"
                      className="mb-4 w-full bg-[#166d66] text-xs font-bold text-yellow-200"
                      onClick={() => {
                        handleOpenChangeView(index, false);
                        setDialogOpenAddEdit(true);
                        setProductData(product);
                      }}
                    >
                      Edit Product
                    </Button>
                  </div>
                  <Label className="min-h-44 w-full overflow-scroll rounded-md bg-yellow-50 p-2 text-xs leading-6 text-gray-400">
                    {product.description}
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <div className="mt-6 flex w-full items-center justify-between">
                  <div className="flex w-full cursor-pointer items-center gap-2 rounded-md border bg-teal-600 p-1 px-4 text-white">
                    <div className="rounded-full bg-white p-1">
                      <img src="/images/logo.png" width={20} alt="Logo" />
                    </div>
                    <Label className="flex h-full w-full cursor-pointer items-center justify-center text-sm font-thin">
                      {product.name}
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
}
