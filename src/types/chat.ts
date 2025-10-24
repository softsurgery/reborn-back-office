import { ResponseUserDto } from "./user-management";
import { DatabaseEntity } from "./utils/database-entity";

export interface ResponseConversationDto extends DatabaseEntity {
  id: number;
  participants: ResponseUserDto[];
  messages: ResponseMessageDto[];
}

export interface ResponseMessageDto extends DatabaseEntity {
  id: number;
  content: string;
  conversationId: number;
  conversation: ResponseConversationDto;
  userId: string;
  user: ResponseUserDto;
}

export interface GroupedMessages {
  date: string;
  messages: ResponseMessageDto[];
}
