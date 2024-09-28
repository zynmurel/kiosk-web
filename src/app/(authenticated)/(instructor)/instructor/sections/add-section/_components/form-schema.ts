import { z } from "zod";

export const CreateSectionSchema = z.object({
    section_name: z.string().min(1, {
        message: "Section letter code is required.",
    }).max(1, { message: "Section letter code must be only one letter" }),
})