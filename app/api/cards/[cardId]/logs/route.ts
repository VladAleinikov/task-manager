import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ENTITY_TYPE } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
      requset: Request,
      { params }: { params: { cardId: string } }
) {
try {
      const { userId, orgId} = auth();
      if (!userId || !orgId) {
            return new NextResponse("Unauthorized", {status: 401})
      }

      const auditLog = await db.auditLog.findMany({
            where: {
                  orgId,
                  entityId: params.cardId,
                  entityType: ENTITY_TYPE.CARD
            },
            orderBy: {
                  createdAt: "desc"
            },
            take: 3
      })
      
      return NextResponse.json(auditLog);
} catch (error) {
      return new NextResponse("Iternal Error", {status: 500})
}
}