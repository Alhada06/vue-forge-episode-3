import fs from "fs";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const url = body.url; // the article URL

  // 1. make a request to the Chat API to generate the DALL-E prompt
  // 2 make a request to DALL-E to generate the image
  // 3. return the image as a base64 encoded string for using with html-to-image on the front-end

  /*HINT: The following code is useful for creating a base64 encoded string for an image
  const res = (await $fetch(imageURL, {
    responseType: "arrayBuffer",
  })) as Buffer;
  const base64String = Buffer.from(res).toString("base64");
  return `data:image/jpeg;base64,${base64String}`;
  */

  const { data: prompt } = await $openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    messages: [
      { role: "system", content: "You are a prompt enginer for DALL-E" },
      {
        role: "user",
        content: `Provide 4 physical items that represent 4 topics from this article.
        ${url}`,
      },
    ],
  });
  if (!prompt?.choices[0].message?.content) {
    throw new Error("DALL-E prompt not generated");
  }
  const dallePrompt = prompt?.choices[0].message?.content.trim();
  const { data } = await $openai.createImage({
    prompt:
      " black and white sticker style illustration. stylize the items to be a repeating pattern, white background" +
      dallePrompt,
  });
  const imgUrl = data.data[0].url;
  if (!imgUrl) throw new Error("image not generated");
  const result = (await $fetch(imgUrl, {
    responseType: "arrayBuffer",
  })) as Buffer;

  const b64String = Buffer.from(result).toString("base64");

  return `data:image/jpeg;base64,${b64String}`;
});
