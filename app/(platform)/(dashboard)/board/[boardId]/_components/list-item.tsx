"use client"

import { ListWithCards } from "@/types"
import { ListWrapper } from "./list-wrapper"
import { ListHeader } from "./list-header"
import { ElementRef, useRef, useState } from "react"
import { CardForm } from "./card-form"
import { cn } from "@/lib/utils"
import { CardItem } from "./card-item"
import { Draggable, Droppable } from "@hello-pangea/dnd"

interface ListItemProps {
      id: number,
      data: ListWithCards
}

export const ListItem = ({ id, data }: ListItemProps) => {
      const textareaForm = useRef<ElementRef<"textarea">>(null);

      const [isEditing, setIsEditing] = useState<boolean>(false);


      const enableEditing = () => {
            setIsEditing(true);
            setTimeout(() => {
                  textareaForm.current?.focus();
            });
      }
      const disableEditing = () => {
            setIsEditing(false);
      }
      const onSubmit = (formData: FormData) => {
            const title = formData.get("title") as string;
            const boardId = formData.get("boardId") as string;
            //execute({ title, boardId });
      }
      return (
            <Draggable draggableId={data.id} index={id}>
                  {(provided) => (
                        <li
                              className="shrink-0 h-full w-[272px] select-none"
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                        >
                              <div
                                    {...provided.dragHandleProps}
                                    className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2"
                              >
                                    <ListHeader onAddCard={enableEditing} data={data} />
                                    <Droppable droppableId={data.id} type="card">
                                          {(provided) => (
                                                <ol
                                                      ref={provided.innerRef}
                                                      {...provided.droppableProps}
                                                      className={cn(
                                                            "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                                                            data.cards.length > 0 ? "mt-2" : "mt-0"
                                                      )}
                                                >
                                                      {data.cards.map((card, id) => (
                                                            <CardItem
                                                                  key={card.id}
                                                                  id={id}
                                                                  data={card}
                                                            />
                                                      ))}
                                                      {provided.placeholder}
                                                </ol>
                                          )}
                                    </Droppable>
                                    <CardForm
                                          ref={textareaForm}
                                          listId={data.id}
                                          enableEditing={enableEditing}
                                          disableEditing={disableEditing}
                                          isEditing={isEditing}
                                    />
                              </div>
                        </li>
                  )}
            </Draggable>
      )
}
