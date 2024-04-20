import { z } from "zod";

export const CreateBoard = z.object({
      title: z.string({
            required_error: "Заголовок обязателен",
            invalid_type_error: "Заголовок обязателен"
      }).min(3, {
            message: "Заголовок слишком короткий"
      }),
      image: z.string({
            required_error: "Изображение обязательно",
            invalid_type_error: "Изображение обязательно"
      })
});