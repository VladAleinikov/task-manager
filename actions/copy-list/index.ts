"use server"

import { auth } from "@clerk/nextjs"
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { createSafeAction } from "@/lib/create-safe-action"
import { CopyList } from "./schema"

const handler = async (data: InputType): Promise<ReturnType> => {
      const { userId, orgId } = auth()

      if (!userId || !orgId) {
            return {
                  error: "Не авторизован"
            }
      }

      const { id, boardId } = data;
      let copiedList;

      try {
            const listToCopy = await db.list.findUnique({
                  where: {
                        id,
                        boardId,
                        board: {
                              orgId
                        }
                  },
                  include: {
                        cards: true
                  }
            })
            if (!listToCopy) {
                  return { error: "Тема не найдена" }
            }
            const lastList = await db.list.findFirst({
                  where: { boardId },
                  orderBy: { order: "desc" },
                  select: { order: true }
            })
            const newOrder = lastList ? lastList.order + 1 : 1
            copiedList = await db.list.create({
                  data: {
                        title: `${listToCopy.title} - копия`,
                        boardId: listToCopy.boardId,
                        order: newOrder,
                        cards: {
                              createMany: {
                                    data: listToCopy.cards.map((card) => ({
                                          title: card.title,
                                          description: card.description,
                                          order: card.order
                                    }))
                              }
                        }
                  },
                  include: {
                        cards: true
                  }
            })
      } catch (error) {
            return {
                  error: "Не удалось копировать"
            }
      }

      revalidatePath(`/board/${boardId}`);
      return { data: copiedList };
}


export const copyList = createSafeAction(CopyList, handler);