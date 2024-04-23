"use client"

import { copyCard } from "@/actions/copy-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAction } from "@/hooks/use-action"
import { useCardModal } from "@/hooks/use-card-modal"
import { CardWithList } from "@/types"
import { Copy, Trash } from "lucide-react"
import { useParams } from "next/navigation"
import { toast } from "sonner"

interface ActionsProps {
      data: CardWithList
}

export const Actions = ({ data }: ActionsProps) => {
      const params = useParams();
      const cardModal = useCardModal();

      const { execute: executeCopyCard, isLoading: isLoadingCopy } = useAction(copyCard, {
            onSuccess: (data) => {
                  toast.success(`Задача "${data.title}" скопирована`);

                  cardModal.onClose();
            },
            onError: (error) => {
                  toast.error(error)
            }
      })
      const { execute: executeDeleteCard, isLoading: isLoadingDelete } = useAction(copyCard, {
            onSuccess: (data) => {
                  toast.success(`Задача "${data.title}" удалена`);

                  cardModal.onClose();
            },
            onError: (error) => {
                  toast.error(error)
            }
      });

      const onCopy = () => {
            const boardId = params.boardId as string;

            executeCopyCard({
                  id: data.id,
                  boardId
            })
      }
      const onDelete = () => {
            const boardId = params.boardId as string;

            executeDeleteCard({
                  id: data.id,
                  boardId
            })
      }
      return (
            <div className="space-y-2 mt-2">
                  <p className="text-xs font-semibold">
                        Действия
                  </p>
                  <Button
                        className="w-full justify-start"
                        variant="gray"
                        size="inline"
                        onClick={onCopy}
                        disabled={isLoadingCopy}
                  >
                        <Copy className="w-4 h-4 mr-2" />
                        Копировать
                  </Button>
                  <Button
                        className="w-full justify-start"
                        variant="gray"
                        size="inline"
                        onClick={onDelete}
                        disabled={isLoadingDelete}
                  >
                        <Trash className="w-4 h-4 mr-2" />
                        Удалить
                  </Button>
            </div>
      )
}

Actions.Skeleton = function ActionsSkeleton() {
      return (
            <div className="space-y-2 mt-2">
                  <Skeleton className="w-20 h-4 bg-neutral-200" />
                  <Skeleton className="w-full h-8 bg-neutral-200" />
                  <Skeleton className="w-full h-8 bg-neutral-200" />
            </div>
      )
}