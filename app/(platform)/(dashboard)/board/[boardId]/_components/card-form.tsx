import { createCard } from "@/actions/create-card";
import { FormSubmit } from "@/components/form/form-submit";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { Plus, X } from "lucide-react";
import { useParams } from "next/navigation";
import { ElementRef, KeyboardEventHandler, forwardRef, useRef } from "react"
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";


interface CardFormProps {
      listId: string,
      isEditing: boolean,
      enableEditing: () => void,
      disableEditing: () => void,
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(({
      listId,
      isEditing,
      enableEditing,
      disableEditing
}, ref) => {
      const params = useParams();
      const formRef = useRef<ElementRef<"form">>(null);

      const {execute, fieldErrors } = useAction(createCard, {
            onSuccess: ((data) => {
                  toast.success(`Задание "${data.title}" добавлено!`);
                  formRef.current?.reset();
            }),
            onError: ((error) => {
                  toast.error(error);
            })
      })

      const onSubmit = (formData: FormData) => {
            const title = formData.get("title") as string;
            const listId = formData.get("listId") as string;
            const boardId = formData.get("boardId") as string;

            execute({ title, listId, boardId });
      }

      const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                  disableEditing();
            }
      }
      useOnClickOutside(formRef, disableEditing);
      useEventListener("keydown", onKeyDown);

      const onTextareaKeyDow: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  formRef.current?.requestSubmit();
            }
      }
      if (isEditing) {
            return (
                  <form
                        ref={formRef}
                        action={onSubmit}
                        className="m-1 py-0.5 px-1 space-y-4"
                  >
                        <input hidden id="listId" name="listId" value={listId} />
                        <input hidden id="boardId" name="boardId" value={params.boardId} />
                        <FormTextarea
                              id="title"
                              onKeyDown={onTextareaKeyDow}
                              ref={ref}
                              placeholder="Введите название задания..."
                        />
                        <div className="flex items-center gap-x-1">
                              <FormSubmit>
                                    Добавить задание
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
            )
      }
      return (
            <div className="pt-2 px-2">
                  <Button
                        onClick={enableEditing}
                        className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
                        size="sm"
                        variant="ghost"
                  >
                        <Plus className="h-4 w-4 mr-2" />
                        Добавить задание
                  </Button>
            </div>
      )
})

CardForm.displayName = "CardForm";