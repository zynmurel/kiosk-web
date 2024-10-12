"use client";
import { useState, useRef } from "react";
import { useStore } from "@/lib/store/app";
import { api } from "@/trpc/react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StudentTransactionsTable() {
  const { user } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const receiptRef = useRef(null);

  const { data: transactions } =
    api.student.students.getStudentBusinessTransaction.useQuery({});

  const filteredTransactions = transactions?.filter(
    (transaction) =>
      transaction.product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.purchase_status
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      new Date(transaction.createdAt)
        .toLocaleDateString()
        .includes(searchTerm) ||
      transaction.product.quantity?.toString().includes(searchTerm) ||
      (transaction.product.cost * (transaction.product.quantity || 0))
        .toString()
        .includes(searchTerm),
  );

  const generateReceiptImage = (transaction: any) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error("Failed to get canvas context");
      return;
    }

    canvas.width = 400;
    canvas.height = 300;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.fillText("Receipt", 150, 0);
    ctx.fillText(`transaction Id: ${transaction.id}`, 20, 35);
    ctx.fillText(`Shop: ${transaction.product.owner.title}`, 20, 60);
    ctx.fillText(`Product: ${transaction.product.name}`, 20, 90);
    ctx.fillText(`Status: ${transaction.purchase_status}`, 20, 120);
    ctx.fillText(
      `Date: ${new Date(transaction.createdAt).toLocaleDateString()}`,
      20,
      150,
    );
    ctx.fillText(`Price: ${transaction.product.cost}`, 20, 180);
    ctx.fillText(`Quantity: ${transaction.quantity ?? 0}`, 20, 210);
    ctx.fillText(
      `Total Cost: ${(transaction.product.cost * (transaction.quantity || 0)).toFixed(2)}`,
      20,
      240,
    );
    const link = document.createElement("a");
    link.download = `${transaction.product.name}-receipt.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="w-full">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Student Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by product, status, date, quantity, or total cost"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
        </CardContent>
      </Card>

      <div className="hidden md:block">
        <Table className="w-full table-auto">
          <TableHeader>
            <TableRow>
              <TableHead>Transaction Id</TableHead>
              <TableHead>Shop Name</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions?.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>{transaction.product.owner.title}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <img
                    src={transaction.product.imageUrl}
                    width={50}
                    alt={transaction.product.name}
                  />
                  <span>{transaction.product.name}</span>
                </TableCell>
                <TableCell>{transaction.purchase_status}</TableCell>
                <TableCell>
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{transaction.product.cost}</TableCell>
                <TableCell>{transaction.quantity ?? 0}</TableCell>
                <TableCell>
                  {(
                    transaction.product.cost * (transaction.quantity || 0)
                  ).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredTransactions?.map((transaction) => (
          <Card
            key={transaction.id}
            className="text-md border border-gray-200 p-10"
          >
            <CardContent>
              <div className="mb-2 flex items-center">
                <img
                  src={transaction.product.imageUrl}
                  width={50}
                  alt={transaction.product.name}
                  className="mr-2"
                />
                <div>
                  <h3 className="font-semibold">{transaction.product.name}</h3>
                  <p className="mb-5 text-sm text-gray-500">
                    Shop: {transaction.product.owner.title}
                  </p>
                </div>
              </div>
              <p>Transaction Id: {transaction.id}</p>
              <p>Status: {transaction.purchase_status}</p>
              <p>
                Date: {new Date(transaction.createdAt).toLocaleDateString()}
              </p>
              <p>Price: {transaction.product.cost}</p>
              <p>Quantity: {transaction.quantity ?? 0}</p>
              <p>
                Total Cost:{" "}
                {(
                  transaction.product.cost * (transaction.quantity || 0)
                ).toFixed(2)}
              </p>
              <Button onClick={() => generateReceiptImage(transaction)}>
                Generate Receipt
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
