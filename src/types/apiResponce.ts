import { Message } from "@/models/User.model";

// Stadardizing The api responce Type
export interface apiResponce {
  success: boolean;
  message: string;
  isAcceptinfMessages?: boolean; // ? means Optional
  messages?: Message; // using same type defind in user model for messages
}
