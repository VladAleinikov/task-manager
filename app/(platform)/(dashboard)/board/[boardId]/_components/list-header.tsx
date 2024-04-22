"use client"

import { updateList } from "@/actions/update-list"
import { FormInput } from "@/components/form/form-input"
import { useAction } from "@/hooks/use-action"
import { List } from "@prisma/client"
import { ElementRef, useRef, useState } from "react"
import { toast } from "sonner"
import { useEventListener } from "usehooks-ts"
import { ListOptions } from "./list-options"

interface ListHeaderProps {
      data: List,
      onAddCard: () => void
}

export const ListHeader = ({ data, onAddCard }: ListHeaderProps) => {
      const formRef = useRef<ElementRef<"form">>(null);
      const inputRef = useRef<ElementRef<"input">>(null);

      const [isEditing, setIsEditing] = useState<boolean>(false);
      const [title, setTitle] = useState<string>(data.title)

      const { execute } = useAction(updateList, {
            onSuccess: (data) => {
                  toast.success(`Тема переименована на "${data.title}"!`);
                  setTitle(data.title);
                  disableEditing();
            },
            onError: (error) => {
                  toast.error(error);
            }
      });

      const enableEditing = () => {
            setIsEditing(true);
            setTimeout(() => {
                  inputRef.current?.focus();
                  inputRef.current?.select();
            });
      }
      const disableEditing = () => {
            setIsEditing(false);
      }
      const onSubmit = (formData: FormData) => {
            const title = formData.get("title") as string;
            const id = formData.get("id") as string;
            const boardId = formData.get("boardId") as string;

            if(title === data.title){
                  disableEditing();
            }

            execute({ title, id, boardId });
      }
      const onBlur = () => {
            formRef.current?.requestSubmit();
      }

      const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                  formRef.current?.requestSubmit();
            }
      }

      useEventListener("keydown", onKeyDown)

      return (
            <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
                  {isEditing ? (
                        <form
                              ref={formRef}
                              action={onSubmit}
                              className="flex-1 px-[2px]"
                        >
                              <input hidden id="id" name="id" value={data.id} />
                              <input hidden id="boardId" name="boardId" value={data.boardId} />
                              <FormInput
                                    ref={inputRef}
                                    id="title"
                                    onBlur={onBlur}
                                    defaultValue={title}
                                    className="text-sm font-medium border-none px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-offset-0 boredr-none"
                              />
                        </form>
                  ) : (
                        <div
                              onClick={enableEditing}
                              className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent">
                              {data.title}
                        </div>
                  )}
                  <ListOptions
                        onAddCard={onAddCard}
                        data={data}
                  />
            </div>
      )
}
