import { gql } from '@apollo/client';

// Get all chats of the logged-in user
export const GET_CHATS = gql`
  query GetChats {
    chats(order_by: {updated_at: desc}) {
      id
      title
      created_at
      updated_at
      messages_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

// Get messages for a chat
export const GET_MESSAGES = gql`
  query GetMessages($chatId: uuid!) {
    messages(where: {chat_id: {_eq: $chatId}}, order_by: {created_at: asc}) {
      id
      content
      role
      created_at
    }
  }
`;

// Insert a new chat
export const CREATE_CHAT = gql`
  mutation CreateChat($title: String!) {
    insert_chats_one(object: {title: $title}) {
      id
      title
      created_at
      updated_at
    }
  }
`;

// Insert a new message
export const INSERT_MESSAGE = gql`
  mutation InsertMessage($chatId: uuid!, $content: String!, $role: String!) {
    insert_messages_one(object: {chat_id: $chatId, content: $content, role: $role}) {
      id
      content
      role
      created_at
    }
  }
`;

// Delete a chat
export const DELETE_CHAT = gql`
  mutation DeleteChat($chatId: uuid!) {
    delete_messages(where: {chat_id: {_eq: $chatId}}) {
      affected_rows
    }
    delete_chats_by_pk(id: $chatId) {
      id
    }
  }
`;

// Update chat title
export const UPDATE_CHAT_TITLE = gql`
  mutation UpdateChatTitle($chatId: uuid!, $title: String!) {
    update_chats_by_pk(pk_columns: {id: $chatId}, _set: {title: $title}) {
      id
      title
    }
  }
`;

// Hasura Action to send message to chatbot
export const SEND_MESSAGE_ACTION = gql`
  mutation SendMessageAction($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
      content
      role
      created_at
    }
  }
`;


// Subscribe to messages in real-time
export const MESSAGES_SUBSCRIPTION = gql`
  subscription OnMessageAdded($chatId: uuid!) {
    messages(where: {chat_id: {_eq: $chatId}}, order_by: {created_at: asc}) {
      id
      content
      role
      created_at
    }
  }
`;

// Subscribe to chats in real-time
export const CHATS_SUBSCRIPTION = gql`
  subscription OnChatsChanged {
    chats(order_by: {updated_at: desc}) {
      id
      title
      created_at
      updated_at
      messages_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;