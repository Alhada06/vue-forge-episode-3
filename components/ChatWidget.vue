<script setup lang="ts">
import { nanoid } from "nanoid";
import { Message, User } from "~~/types";

const me = ref<User>({
  id: "user",
  avatar: "/avatar.jpg",
  name: "You",
});
const bot = ref<User>({
  id: "assistant",
  avatar: "/bot.jpg",
  name: "Botman",
});

const users = computed(() => [me.value, bot.value]);

// const messages = ref<Message[]>([
//   {
//     text: "Hey, how's it going?",
//     id: nanoid(),
//     userId: "user",
//     createdAt: new Date(new Date().getTime() - 5 * 60000),
//   },
//   {
//     text: "**Great!** I'm building a cool chat app at Vue.js Forge 🔥",
//     id: nanoid(),
//     userId: "assistant",
//     createdAt: new Date(new Date().getTime() - 4 * 60000),
//   },
//   {
//     text: "Very cool! I'm so jealous 😀",
//     id: nanoid(),
//     userId: "user",
//     createdAt: new Date(new Date().getTime() - 2 * 60000),
//   },
//   {
//     text: "You can join me. Just visit the  [Vue.js Forge](https://vuejsforge.com/) website and sign-up. It's free!",
//     id: nanoid(),
//     userId: "assistant",
//     createdAt: new Date(),
//   },
// ]);
// const messages = ref<Message[]>([]);

const messages = useSessionStorage<Message[]>("messages", []);

const usersTyping = ref<User[]>([]);

const messagesForAPI = computed(() =>
  messages.value.map((m) => ({
    role: m.userId,
    content: m.text,
  }))
);

// send messages to Chat API here
// and in the empty function below

// async function handleNewMessage(message: Message) {
//   messages.value.push(message);
//   usersTyping.value.push(bot.value);
//   setTimeout(() => {
//     usersTyping.value = [];
//     messages.value.push({
//       id: nanoid(),
//       createdAt: new Date(),
//       text: "Placeholder response until we implement the bot",
//       userId: "assistant",
//     });
//   }, 3000);
// }
const { chat } = useChatAi({ agent: "customerSupport" });
async function handleNewMessage(message: Message) {
  messages.value.push(message);
  usersTyping.value.push(bot.value);
  // const res = await $fetch("/api/ai", {
  //   method: "POST",
  //   body: {
  //     messages: messagesForAPI.value,
  //   },
  // });
  const res = await chat({ messages: messagesForAPI.value });
  if (!res.choices[0].message?.content) return;
  const msg = {
    id: res.id,
    userId: bot.value.id,
    createdAt: new Date(),
    text: res.choices[0].message?.content,
  };
  messages.value.push(msg);
  usersTyping.value = [];
}
</script>
<template>
  <ChatBox
    :me="me"
    :users="users"
    :messages="messages"
    @new-message="handleNewMessage"
    :usersTyping="usersTyping"
  />
</template>
