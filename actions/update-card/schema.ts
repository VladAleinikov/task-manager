import { z } from "zod";

export const UpdateCard = z.object({
      title: z.string({
            required_error: "Заголовок обязателен",
            invalid_type_error: "Заголовок обязателен"
      }).min(3, {
            message: "Заголовок слишком короткий"
      }),
      description: z.optional(
            z.string({
                  required_error: "Описание обязателено",
                  invalid_type_error: "Описание обязателено"
            }).min(3, {
                  message: "Описание слишком короткое"
            })
      ),
      id: z.string(),
      boardId: z.string(),
})