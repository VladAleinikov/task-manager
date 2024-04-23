"use server"

import { auth } from "@clerk/nextjs"
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { createSafeAction } from "@/lib/create-safe-action"
import { CopyCard } from "./schema"
import { createAuditLog } from "@/lib/create-audit-log"
import { ACTION, ENTITY_TYPE } from "@prisma/client"

const handler = async (data: InputType): Promise<ReturnType> => {
      const { userId, orgId } = auth()

      if (!userId || !orgId) {
            return {
                  error: "Не авторизован"
            }
      }

      const { id, boardId } = data;
      let copiedCard;

      try {
            const cardToCopy = await db.card.findUnique({
                  where: {
                        id,
                        list: {
                              board: {
                                    orgId
                              }
                        }
                  },
            })
            if (!cardToCopy) {
                  return { error: "Задача не найдена" }
            }
            const lastCard = await db.card.findFirst({
                  where: { listId: cardToCopy.listId },
                  orderBy: { order: "desc" },
                  select: { order: true }
            })
            const newOrder = lastCard ? lastCard.order + 1 : 1
            copiedCard = await db.card.create({
                  data: {
                        title: `${cardToCopy.title} - копия`,
                        description: cardToCopy.description,
                        listId: cardToCopy.listId,
                        order: newOrder,
                  }
            })

            await createAuditLog({
                  entityId: copiedCard.id,
                  entityTitle: copiedCard.title,
                  entityType: ENTITY_TYPE.CARD,
                  action: ACTION.CREATE,
            })
      } catch (error) {
            return {
                  error: "Не удалось копировать"
            }
      }

      revalidatePath(`/board/${boardId}`);
      return { data: copiedCard };
}


export const copyCard = createSafeAction(CopyCard, handler);