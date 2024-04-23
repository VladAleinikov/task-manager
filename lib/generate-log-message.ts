import { ACTION, AuditLog, ENTITY_TYPE } from "@prisma/client";

const entityToRus = (entityType: ENTITY_TYPE) => {
      switch (entityType) {
            case ENTITY_TYPE.BOARD:
                  return "доска";
            case ENTITY_TYPE.LIST:
                  return "тема";
            case ENTITY_TYPE.CARD:
                  return "задача";
      }
}
export const generateLogMessage = (log: AuditLog) => {
      const {action, entityTitle, entityType }  = log

      switch (action) {
            case ACTION.CREATE:
                  return `создана ${entityToRus(entityType)} "${entityTitle}"`
            case ACTION.UPDATE:
                  return `обновлена ${entityToRus(entityType)} "${entityTitle}"`
            case ACTION.DELETE:
                  return `удалена ${entityToRus(entityType)} "${entityTitle}"`
            default:
                  return `неизвестное действие: ${entityToRus(entityType)} "${entityTitle}"`
      }
}