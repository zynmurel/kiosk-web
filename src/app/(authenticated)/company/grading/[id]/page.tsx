import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const dummyData = [
  { type: "QUIZ", description: "quiz 1 1-10", score: "90.0%", points: 100 },
  {
    type: "ASSIGNMENT",
    description: "assignment 2",
    score: "85.0%",
    points: 95,
  },
  { type: "PROJECT", description: "project 3", score: "92.0%", points: 110 },
  { type: "EXAM", description: "exam 4", score: "88.0%", points: 105 },
  { type: "QUIZ", description: "quiz 5", score: "75.0%", points: 80 },
  { type: "HOMEWORK", description: "homework 6", score: "100.0%", points: 120 },
  { type: "QUIZ", description: "quiz 7", score: "95.0%", points: 115 },
  { type: "EXAM", description: "exam 8", score: "70.0%", points: 75 },
  {
    type: "ASSIGNMENT",
    description: "assignment 9",
    score: "85.0%",
    points: 95,
  },
  { type: "PROJECT", description: "project 10", score: "98.0%", points: 130 },
];

const Page = () => {
  return (
    <div>
      <Label className="my-10 flex text-4xl font-semibold tracking-widest text-teal-700">
        Science
      </Label>
      <Input placeholder="filter name.." className="my-3 flex w-72" />
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader className="bg-teal-700">
          <TableRow>
            <TableHead className="w-[100px] font-bold text-white">
              Type
            </TableHead>
            <TableHead className="w-[100px] font-bold text-white">
              Description
            </TableHead>
            <TableHead className="w-[100px] font-bold text-white">
              Score
            </TableHead>
            <TableHead className="w-[100px] font-bold text-white">
              Points
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dummyData.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.type}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.score}</TableCell>
              <TableCell>{item.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
