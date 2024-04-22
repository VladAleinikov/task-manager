"use client"

import { copyList } from "@/actions/copy-list"
import { deleteList } from "@/actions/delete-list"
import { FormSubmit } from "@/components/form/form-submit"
import { Button } from "@/components/ui/button"
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { useAction } from "@/hooks/use-action"
import { List } from "@prisma/client"
import { MoreHorizontal, X } from "lucide-react"
import { ElementRef, useRef } from "react"
import { toast } from "sonner"

interface ListOptionsProps {
      onAddCard: () => void,
      data: List
}

export const ListOptions = ({ onAddCard, data }: ListOptionsProps) => {
      const closeRef = useRef<ElementRef<"button">>(null)

      const { execute: executeDeleteList } = useAction(deleteList, {
            onSuccess: (data) => {
                  toast.success("Тема удалена");
                  closeRef.current?.click();
            },
            onError: (error) => {
                  toast.error(error)
            }
      })
      const { execute: executeCopyList } = useAction(copyList, {
            onSuccess: (data) => {
                  toast.success("Тема скопирована");
                  closeRef.current?.click();
            },
            onError: (error) => {
                  toast.error(error)
            }
      })


      const onDelete = (formData: FormData) => {
            const id = formData.get("id") as string;
            const boardId = formData.get("boardId") as string;

            executeDeleteList({ id, boardId })
      }
      const onCopy = (formData: FormData) => {
            const id = formData.get("id") as string;
            const boardId = formData.get("boardId") as string;

            executeCopyList({ id, boardId })
      }
      return (
            <Popover>
                  <PopoverTrigger asChild>
                        <Button
                              className="h-auto w-auto p-2"
                              variant="ghost"
                        >
                              <MoreHorizontal
                                    className="h-4 w-4"
                              />
                        </Button>
                  </PopoverTrigger>
                  <PopoverContent
                        className="px-0 py-3"
                  >
                        <div className="text-sm font-medium text-center text-neutral-600 pb4-">

                        </div>
                        <PopoverClose ref={closeRef} asChild>
                              <Button
                                    className="h-auto w-auto p-2 absolute top-2 ring-2 text-neutral-600"
                                    variant="ghost"
                              >
                                    <X className="h-4 w-4" />
                              </Button>
                        </PopoverClose>
                        <Button
                              onClick={onAddCard}
                              className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
                              variant="ghost"
                        >
                              Добавить задание...
                        </Button>
                        <form
                              action={onCopy}
                        >
                              <input hidden name="id" id="id" value={data.id} />
                              <input hidden name="boardId" id="boardId" value={data.boardId} />
                              <FormSubmit
                                    className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
                                    variant="ghost"
                              >
                                    Копировать тему...
                              </FormSubmit>
                        </form>
                        <Separator />
                        <form
                              action={onDelete}
                        >
                              <input hidden name="id" id="id" value={data.id} />
                              <input hidden name="boardId" id="boardId" value={data.boardId} />
                              <FormSubmit
                                    className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
                                    variant="ghost"
                              >
                                    Удалить эту тему...
                              </FormSubmit>
                        </form>

                  </PopoverContent>
            </Popover>
      )
}
