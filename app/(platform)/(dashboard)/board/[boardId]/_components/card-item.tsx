"use client"

import { Draggable } from "@hello-pangea/dnd"
import { Card } from "@prisma/client"

interface CardItemProps {
      id: number,
      data: Card
}

export const CardItem = ({ id, data }: CardItemProps) => {
      return (
            <Draggable draggableId={data.id} index={id}>
                  {(provided) => (
                        <li
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              role="button"
                              className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-md"
                        >
                              {data.title}
                        </li>
                  )}
            </Draggable>
      )
}
