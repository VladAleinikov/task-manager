"use client"

import { updateCard } from "@/actions/update-card"
import { FormSubmit } from "@/components/form/form-submit"
import { FormTextarea } from "@/components/form/form-textarea"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAction } from "@/hooks/use-action"
import { CardWithList } from "@/types"
import { useQueryClient } from "@tanstack/react-query"
import { AlignLeft } from "lucide-react"
import { useParams } from "next/navigation"
import { ElementRef, useRef, useState } from "react"
import { toast } from "sonner"
import { useEventListener, useOnClickOutside } from "usehooks-ts"

interface DescriptionProps {
  data: CardWithList
}

export const Description = ({ data }: DescriptionProps) => {
  const queryClient = useQueryClient();
  const params = useParams();

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const textareaRef = useRef<ElementRef<"textarea">>(null);
  const formRef = useRef<ElementRef<"form">>(null);


  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["card", data.id]
      });

      queryClient.invalidateQueries({
        queryKey: ["card-logs", data.id]
      });

      toast.success(`Описание задачи "${data.title}" добавлено`)
      disableEditing();
    },
    onError: (error) => {
      toast.error(error)
    }
  })

  
  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.select();
    });
  }
  const disableEditing = () => {
    setIsEditing(false);
  }
  const onSubmit = (formData: FormData) => {
    const description = formData.get("description") as string;
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    execute({ description, id, boardId });
  }
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  }
  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);
  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">
          Описание
        </p>{isEditing
          ? <form
            action={onSubmit}
            className="space-y-2"
            ref={formRef}
          >
            <input hidden id="boardId" name="boardId" value={params.boardid} />
            <input hidden id="id" name="id" value={data.id} />
            <FormTextarea
              id="description"
              className="w-full mt-2"
              placeholder="Добавьте описание задачи"
              defaultValue={data.description || undefined}
              errors={fieldErrors}
              ref={textareaRef}
            />
            <div className="flex items-center gap-x-2">
              <FormSubmit

              >
                Сохранить
              </FormSubmit>
              <Button
                type="button"
                onClick={disableEditing}
                size="sm"
                variant="ghost"
              >
                Отмена
              </Button>
            </div>
          </form>
          : (
            <div
              onClick={enableEditing}
              className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
              role="button"
            >
              {data.description || "Добавьте описание задачи..."}
            </div>
          )}
      </div>
    </div>
  )
}

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="h-6 w-24 bg-neutral-200 mb-2" />
        <Skeleton className="h-[78px] w-full bg-neutral-200" />
      </div>
    </div>
  )
}
