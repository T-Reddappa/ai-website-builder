require("dotenv").config();
import express from "express";
import OpenAI from "openai";
import cors from "cors";
import { BASE_PROMPT, getSystemPrompt } from "./prompts";
import { basePrompt as reactBasePrompt } from "./defaults/react";
import { basePrompt as nodeBasePrompt } from "./defaults/node";
import { measureMemory } from "vm";

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI();

app.post("/template", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    console.log(prompt);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt,
        },
        {
          role: "system",
          content: `Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra`,
        },
      ],

      store: true,
    });

    const response = completion.choices[0].message;
    console.log(completion.choices[0].message);
    if (response.content === "react") {
      res.json({
        prompts: [
          BASE_PROMPT,
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [reactBasePrompt],
      });
      return;
    }

    if (response.content === "node") {
      res.json({
        prompts: [],
        uiPrompts: [nodeBasePrompt],
      });
      return;
    }

    res.json(response);
  } catch (e) {
    console.error("Template endpoint error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/chat", async (req, res) => {
  try {
    const messages = req.body.messages;
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      store: true,
      messages: [
        {
          role: "system",
          content: getSystemPrompt(),
        },
        ...messages,
      ],
    });

    const response = completion.choices[0].message;
    console.log(response);
    res.json(response);
  } catch (e) {
    console.error("Chat endpoint error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
});

const main = async () => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant. You are a senior Full Stack Web Developer.",
      },
      {
        role: "user",
        content: "Create a react todo application",
      },
    ],
    stream: true,
  });
  for await (const chunk of completion) {
    const content = chunk.choices[0]?.delta?.content || "";
    process.stdout.write(content);
  }
};

app.listen(3000);

// main();
