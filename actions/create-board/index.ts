"use server"

import { auth } from "@clerk/nextjs"
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
      const { userId, orgId } = auth();

      if (!userId || !orgId) {
            return {
                  error: "Не авторизован"
            }
      }

      const { title, image } = data;
      const [
            imageId,
            imageThumbUrl,
            imageFullUrl,
            imageLinkHtml,
            imageUserName,
      ] = image.split('|');

      if (!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHtml || !imageUserName) {
            return {
                  error: "Не все поля заполнены. Не удалось создать"
            }
      }

      let board;

      try {
            board = await db.board.create({
                  data: {
                        title,
                        orgId,
                        imageId,
                        imageThumbUrl,
                        imageFullUrl,
                        imageLinkHtml,
                        imageUserName
                  }
            });

            await createAuditLog({
                  entityId: board.id,
                  entityTitle: board.title,
                  entityType: ENTITY_TYPE.BOARD,
                  action: ACTION.CREATE,
            })
      } catch (error) {
            return {
                  error: "Не удалось создать"
            }
      }

      revalidatePath(`/board/${board.id}`);
      return { data: board };
}

export const createBoard = createSafeAction(CreateBoard, handler);