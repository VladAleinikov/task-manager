import { z } from "zod";

export const UpdateBoard = z.object({
      title: z.string({
            required_error: "Заголовок обязателен",
            invalid_type_error: "Заголовок обязателен"
      }).min(3, {
            message: "Заголовок слишком короткий"
      }),
      id: z.string()
})