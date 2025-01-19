"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { category, subject_grading_system } from "@/lib/helpers/selections";
const subject_type = [
  {
    value: "MINOR",
    label: "Minor",
  },
  {
    value: "MAJOR",
    label: "Major",
  },
];

const UpsertSubjectForm = ({ isEdit = true }: { isEdit?: boolean }) => {
  const form = useFormContext();
  const type = form.getValues();
  console.log(type);
  return (
    <div className="relative mt-5 w-full space-y-3 rounded-lg">
      <FormField
        control={form.control}
        name="code"
        render={({ field }) => (
          <FormItem className="relative">
            <FormLabel>Code</FormLabel>
            <FormControl>
              <Input
                placeholder="Input course code"
                className="max-w-[200px]"
                {...field}
                disabled={!isEdit}
              />
            </FormControl>
            <FormDescription>This is the code of the course.</FormDescription>
            <FormMessage className="absolute -bottom-5" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem className="relative">
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input
                placeholder="Input course title"
                {...field}
                disabled={!isEdit}
              />
            </FormControl>
            <FormDescription>This is the title of the  course.</FormDescription>
            <FormMessage className="absolute -bottom-5" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="relative">
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Input course description"
                {...field}
                disabled={!isEdit}
              />
            </FormControl>
            <FormDescription>
              This is the description of the course.
            </FormDescription>
            <FormMessage className="absolute -bottom-5" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            {!isEdit ? (
              <div className="fonts rounded-md border p-[9px] px-3 text-sm capitalize text-muted-foreground">
                Category {type.category}
              </div>
            ) : (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!isEdit}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {category.map((type) => (
                    <SelectItem
                      className="py-4"
                      key={type.value}
                      value={type.value}
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <FormDescription>Type of course</FormDescription>
            <FormMessage className="absolute -bottom-5" />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-5">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              {!isEdit ? (
                <div className="fonts rounded-md border p-[9px] px-3 text-sm capitalize text-muted-foreground">
                  {type.type?.toLowerCase()}
                </div>
              ) : (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!isEdit}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subject_type.map((type) => (
                      <SelectItem
                        className="py-4"
                        key={type.value}
                        value={type.value}
                      >
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormDescription>Type of course</FormDescription>
              <FormMessage className="absolute -bottom-5" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="grading_system"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grading System</FormLabel>
              {!isEdit ? (
                <div className="fonts rounded-md border p-[9px] px-3 text-sm capitalize text-muted-foreground">
                  {type.grading_system?.toLowerCase().replace("_"," ")}
                </div>
              ) : (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!isEdit}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subject_grading_system.map((type) => (
                      <SelectItem
                        className="py-4"
                        key={type.value}
                        value={type.value}
                      >
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormDescription>Subject grading system.</FormDescription>
              <FormMessage className="absolute -bottom-5" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="units"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Units</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Input units"
                  {...field}
                  disabled={!isEdit}
                />
              </FormControl>
              <FormDescription>Units of this course.</FormDescription>
              <FormMessage className="absolute -bottom-5" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default UpsertSubjectForm;
