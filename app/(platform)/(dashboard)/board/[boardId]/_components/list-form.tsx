"use client"

import { Plus, X } from "lucide-react"
import { ListWrapper } from "./list-wrapper"
import { ElementRef, useRef, useState } from "react"
import { useEventListener, useOnClickOutside } from "usehooks-ts"
import { FormInput } from "@/components/form/form-input"
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"
import { FormSubmit } from "@/components/form/form-submit"
import { useAction } from "@/hooks/use-action"
import { toast } from "sonner"
import { createList } from "@/actions/create-list"

export const ListForm = () => {
      const router = useRouter();
      const params = useParams();
      const [isEditing, setIsEditing] = useState<boolean>(false);
      const formRef = useRef<ElementRef<"form">>(null);
      const inputRef = useRef<ElementRef<"input">>(null);

      const { execute, fieldErrors } = useAction(createList, {
            onSuccess: (data) => {
                  toast.success(`Тема "${data.title}" создана`);
                  disableEditing();
                  router.refresh();
            },
            onError: (error) => {
                  toast.error(error);
            }
      })

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
            const boardId = formData.get("boardId") as string;
            execute({ title, boardId });
      }
      const onBlur = () => {
            formRef.current?.requestSubmit();
      }

      const onKeyDowm = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                  disableEditing();
            }
      }
      useEventListener("keydown", onKeyDowm);
      useOnClickOutside(formRef, disableEditing);

      if (isEditing) {
            return (
                  <ListWrapper>
                        <form
                              action={onSubmit}
                              className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
                              ref={formRef}
                        >
                              <FormInput
                                    ref={inputRef}
                                    id="title"
                                    errors={fieldErrors}
                                    className="txet-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
                                    placeholder="Введите название темы..."
                              />
                              <input hidden value={params.boardId} name="boardId" />
                              <div className="flex items-center gap-x-1">
                                    <FormSubmit>
                                          Добавить тему
                                    </FormSubmit>
                                    <Button
                                          onClick={disableEditing}
                                          size="sm"
                                          variant="ghost"
                                    >
                                          <X className="h-5 w-5" />
                                    </Button>
                              </div>
                        </form>
                  </ListWrapper>
            )
      }

      return (
            <ListWrapper>
                  <button
                        onClick={enableEditing}
                        className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm"
                  >
                        <Plus className="h-4 w-4 mr-2" />
                        Добавить тему
                  </button>
            </ListWrapper>
      )
}
