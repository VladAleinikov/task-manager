import { z } from "zod";

export const CreateList = z.object({
      title: z.string({
            required_error: "Название темы обязателено",
            invalid_type_error: "Название темы обязателено"
      }).min(3, {
            message: "Название слишком короткое"
      }),
      boardId: z.string()
})