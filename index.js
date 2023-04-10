require("dotenv/config");
const { Client, IntentsBitField } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(
    "The ChatGPT Pixy Version is now online! if you like it , please suport my job and follow me on Youtube : 'https://www.youtube.com/channel/UCj9nLPUbs9GtaSY1g7I7GmQ' & Instagram : @prcordova : 'https://www.instagram.com/prcordova/'"
  );
  console.log(
    "Remember, you always can suport my job , tagging me on Instagram @prcordova  "
  );
});

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith("!")) return;

  let conversationLog = [
    { role: "system", content: "You are a friendly chatbot." },
  ];

  try {
    await message.channel.sendTyping();

    let prevMessages = await message.channel.messages.fetch({ limit: 15 });
    prevMessages.reverse();

    prevMessages.forEach((msg) => {
      if (message.content.startsWith("!")) return;
      if (msg.author.id !== client.user.id && message.author.bot) return;
      if (msg.author.id !== message.author.id) return;

      conversationLog.push({
        role: "user",
        content: msg.content,
      });
    });

    const result = await openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: conversationLog,
        // max_tokens: 256, // limit token usage
      })
      .catch((error) => {
        console.log(`OPENAI ERROR: ${error}`);
      });

    message.reply(result.data.choices[0].message);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
});

client.login(process.env.TOKEN);
