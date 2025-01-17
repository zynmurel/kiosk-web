"use client";
import SubjectTable from "./_components/table";
import { useStore } from "@/lib/store/app";
import SubjectLayout from "./_components/_layout";
import { useParams, useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { toast } from "@/hooks/use-toast";
import Loading from "./_components/loading";
import { useEffect, useState } from "react";
import { SubjectContext } from "@/lib/context/admin/subject";
import { type SubjectType } from "@/lib/types/admin/subject";
import { Button } from "@/components/ui/button";

export const FormSchema = z.object({
  code: z.string().min(3, {
    message: "Subject code must be at least 3 characters.",
  }),
  title: z.string().min(3, {
    message: "Subject title is required.",
  }),
  category: z.string().min(1, {
    message: "Category is required.",
  }),
  description: z.string().min(3, {
    message: "Subject description is required.",
  }),
  units: z.coerce
    .number({
      message: "Subject units is required.",
    })
    .min(1, {
      message: "Subject units is required.",
    }),
  type: z.enum(["MINOR", "MAJOR"], { message: "Subject type required." }),
  grading_system : z.enum(["ZERO_BASED", "TRANSMUTED"], { message: "Subject type required." }),
});
const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [subjectType, setSubjectType] = useState<SubjectType>("ALL");
  const [searchText, setSearchText] = useState("");
  const router = useRouter();
  const { user } = useStore();
  const { id } = useParams();

  const {
    data: subjects,
    isLoading: subjectsIsLoading,
    refetch: refetchsubjects,
  } = api.admin.subject.getSubjectsByType.useQuery(
    {
      departmenCode: user?.department || "",
      type: subjectType,
    },
    {
      enabled: !!user?.department,
    },
  );

  const {
    data: selectedSubject,
    isLoading: selectedSubjectIsLoading,
    refetch: refetchSelectedSubject,
  } = api.admin.subject.getSubject.useQuery(
    {
      id: Number(id),
      departmenId: user?.department || "",
    },
    {
      enabled: !Number.isNaN(Number(id)) && !!user?.department,
    },
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    values: selectedSubject
      ? {
          code: selectedSubject.code,
          title: selectedSubject.title,
          category: selectedSubject.gradingSystemCategory,
          type: selectedSubject.type,
          description: selectedSubject.description,
          units: selectedSubject.units,
          grading_system:selectedSubject.grading_system
        }
      : undefined,
  });
  console.log(selectedSubject);
  const { mutateAsync, isPending } =
    api.admin.subject.upsertSubject.useMutation({
      onSuccess: async (data) => {
        toast({
          title: "Success!",
          description: !id
            ? "New Subject added successfully!"
            : "Subject updated successfully!",
        });
        await Promise.all([
          refetchsubjects(),
          data.id === Number(id) && refetchSelectedSubject(),
        ]);
        setIsEdit(false);
        if (!id) form.reset();
        router.push("/admin/subjects/" + data.id);
      },
      onError: (e) => {
        if (e.message.includes("Unique constraint failed on the fields")) {
          toast({
            variant: "destructive",
            title: "Creating subject failed",
            description: "Subject code already exist.",
          });
          form.setError("code", { message: "Subject code already exist." });
        } else {
          toast({
            variant: "destructive",
            title: "Creating subject failed",
            description: e.message,
          });
        }
      },
    });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      if (user?.department) {
        await mutateAsync({
          id: Number(id) || 0,
          departmenId: user.department,
          ...data,
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (selectedSubject) {
      form.clearErrors();
      form.setValue("code", selectedSubject.code);
      form.setValue("title", selectedSubject.title);
      form.setValue("type", selectedSubject.type);
      form.setValue("category", selectedSubject.gradingSystemCategory);
      form.setValue("grading_system", selectedSubject.grading_system);
      form.setValue("description", selectedSubject.description);
      form.setValue("units", selectedSubject.units);
    } else if (!id) {
      form.reset({
        code: "",
        title: "",
        description: "",
        units: 0,
        type: "MINOR",
        category: "",
      });
    }
  }, [id, form, selectedSubject]);

  useEffect(() => {
    setIsEdit(false);
  }, [id]);
  return (
    <SubjectContext.Provider
      value={{
        isEdit,
        setIsEdit,
        subjectType,
        setSubjectType,
        searchText,
        setSearchText,
      }}
    >
      <SubjectLayout>
        <div className="flex w-full flex-col space-y-5">
          <div className="grid gap-5 lg:h-full lg:grid-cols-2 xl:grid-cols-5">
            <SubjectTable
              subjects={
                subjects?.filter((sub) => sub.code.includes(searchText)) || []
              }
              subjectsIsLoading={subjectsIsLoading}
            />
            <div className="relative flex h-full w-full justify-center rounded border bg-background shadow-md xl:col-span-2">
              {(isPending || selectedSubjectIsLoading) && (
                <div className="absolute bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center bg-background opacity-50">
                  <Loading />
                </div>
              )}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                  {children}
                  {!id && (
                    <div className="flex w-full justify-end gap-2 p-5 xl:px-10">
                      <Button type="submit" className="w-28">
                        {"Create"}{" "}
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
            </div>
          </div>
        </div>
      </SubjectLayout>
    </SubjectContext.Provider>
  );
};

export default Layout;
