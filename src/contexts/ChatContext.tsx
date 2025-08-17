import React, { createContext, useContext, useState, ReactNode } from 'react'
import { useMutation, useSubscription } from '@apollo/client'
import{useUserId} from '@nhost/react'
import {nhost} from '../lib/nhost'
import { 
  GET_CHATS,
  CREATE_CHAT,
  INSERT_MESSAGE,
  DELETE_CHAT,
  UPDATE_CHAT_TITLE,
  SEND_MESSAGE_ACTION,
  MESSAGES_SUBSCRIPTION,
  CHATS_SUBSCRIPTION
} from '../graphql/queries'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  created_at: string
  timestamp: Date
}

interface Chat {
  id: string
  title: string
  created_at: string
  updated_at: string
  updatedAt: Date
  messages: Message[]
  messages_aggregate?: {
    aggregate: {
      count: number
    }
  }
}

interface ChatContextType {
  chats: Chat[]
  currentChat: Chat | null
  isLoading: boolean
  createNewChat: () => Promise<void>
  selectChat: (chatId: string) => void
  sendMessage: (content: string) => Promise<void>
  deleteChat: (chatId: string) => Promise<void>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) throw new Error('useChat must be used within a ChatProvider')
  return context
}

interface ChatProviderProps {
  children: ReactNode
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const userId = useUserId()
  console.log(userId);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [localChats, setLocalChats] = useState<Chat[]>([])

  // Real-time subscriptions
  const { data: chatsData } = useSubscription(CHATS_SUBSCRIPTION)
  const { data: messagesData } = useSubscription(MESSAGES_SUBSCRIPTION, {
    variables: { chatId: currentChat?.id },
    skip: !currentChat?.id
  })

  // Mutations
  const [createChatMutation] = useMutation(CREATE_CHAT)
  const [insertMessageMutation] = useMutation(INSERT_MESSAGE)
  const [sendMessageAction] = useMutation(SEND_MESSAGE_ACTION)
  const [deleteChatMutation] = useMutation(DELETE_CHAT)
  const [updateChatTitleMutation] = useMutation(UPDATE_CHAT_TITLE)

  // Transform chats from subscription
  const subscribedChats: Chat[] = (chatsData?.chats || []).map((chat: any) => ({
    ...chat,
    updatedAt: new Date(chat.updated_at),
    messages: []
  }))

  // Merge subscribedChats with localChats to prevent flicker
  const chats = [...localChats.filter(c => !subscribedChats.find(s => s.id === c.id)), ...subscribedChats]

  // Transform messages for current chat
  const messages: Message[] = (messagesData?.messages || []).map((m: any) => ({
    ...m,
    timestamp: new Date(m.created_at)
  }))

  const currentChatWithMessages = currentChat
    ? { ...currentChat, messages: messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()) }
    : null

  // ----------------- Actions -----------------
  const createNewChat = async () => {
    try {
      const { data } = await createChatMutation({ variables: { title: 'Untitled Chat' } })
      if (data?.insert_chats_one) {
        const newChat: Chat = {
          ...data.insert_chats_one,
          updatedAt: new Date(data.insert_chats_one.updated_at),
          messages: []
        }
        setLocalChats(prev => [newChat, ...prev])
        setCurrentChat(newChat)
      }
    } catch (error) {
      console.error('Failed to create chat:', error)
    }
  }

  const selectChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId)
    if (chat) setCurrentChat(chat)
  }

  const sendMessage = async (content: string) => {
    if (!currentChat) return
    
    setIsLoading(true)

    // Optimistic UI
    const tempMessage: Message = {
      id: Math.random().toString(),
      content,
      role: 'user',
      created_at: new Date().toISOString(),
      timestamp: new Date()
    }
    setCurrentChat(prev => prev ? { ...prev, messages: [...prev.messages, tempMessage] } : prev)

    try {
      // Insert message in DB
      await insertMessageMutation({ 
        variables: { 
          chatId: currentChat.id, 
          content, 
          role: 'user'
          ,user_id:userId } })

      // If first message, update chat title
      if ((currentChat.messages?.length || 0) === 0) {
        const title = content.length > 30 ? content.slice(0, 30) + '...' : content
        await updateChatTitleMutation({ variables: { chatId: currentChat.id, title } })
      }

      // Send message to AI
      console.log("Sending message:", {
  chatId: currentChat?.id,
  userId,
  content,
});

      const result = await sendMessageAction({
  variables: { input: { chat_id: currentChat.id, content } },
  context: {
    headers: {
      Authorization: `Bearer ${nhost.auth.getAccessToken()}`,
    },
  },
});
if (result.errors) throw new Error('Failed to send message to chatbot')
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteChat = async (chatId: string) => {
    try {
      await deleteChatMutation({ variables: { chatId } })
      setLocalChats(prev => prev.filter(c => c.id !== chatId))
      if (currentChat?.id === chatId) setCurrentChat(localChats[0] || null)
    } catch (error) {
      console.error('Failed to delete chat:', error)
    }
  }

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat: currentChatWithMessages,
        isLoading,
        createNewChat,
        selectChat,
        sendMessage,
        deleteChat
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
