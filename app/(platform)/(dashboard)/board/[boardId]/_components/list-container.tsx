"use client"

import { ListWithCards } from "@/types"
import { ListForm } from "./list-form"
import { useEffect, useState } from "react"
import { ListItem } from "./list-item"
import { DragDropContext, Droppable } from '@hello-pangea/dnd'


interface ListContainerProps {
  boardId: string,
  data: ListWithCards[]
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const ListContainer = ({ boardId, data }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);

  useEffect(() => {
    setOrderedData(data);
  }, [data])

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }
    // Не изменилась позиция
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Передвинул тему
    if (type === "list") {
      const items = reorder(
        orderedData,
        source.index,
        destination.index
      ).map((item, index) => ({ ...item, order: index }));

      setOrderedData(items);
    }

    // Передвинул задачу
    if (type === "card") {
      let newOrderedData = [...orderedData];

      // Источник-тема и цель-тема
      const sourceList = newOrderedData.find(list => list.id === source.droppableId)
      const destList = newOrderedData.find(list => list.id === destination.droppableId)

      if (!sourceList || !destList) {
        return;
      }

      // Есть ли задачу в теме-источнике
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // Есть ли задачи в теме-цели
      if (!destList.cards) {
        destList.cards = [];
      }

      // Перемещение задачи в одной теме
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        )

        reorderedCards.forEach((card, id) => {
          card.order = id;
        });

        sourceList.cards = reorderedCards;

        setOrderedData(newOrderedData);
      }
      // Перемещение задачи в другую тему
      else {
        // Удалить задачу из темы-источника
        const [movedCard] = sourceList.cards.splice(source.index, 1);
        
        // Перезаписать id темы из перемещаяемой задачи
        movedCard.listId = destination.droppableId;

        // Добавить задачу в тему-цель
        destList.cards.splice(destination.index, 0, movedCard);

        // Обновить порядок задач в теме-источнике
        sourceList.cards.forEach((card, id) => {
          card.order = id;
        })

        // Обновить порядок задач в теме-цели
        destList.cards.forEach((card, id) => {
          card.order = id;
        })

        setOrderedData(newOrderedData);
      }
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, id) => {
              return (
                <ListItem
                  key={list.id}
                  id={id}
                  data={list}
                />
              )
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  )
}
