import axios from "axios";

export async function POST(req) {
  try {
    const { messages } = await req.json(); // now expecting full conversation array

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages are required" }), {
        status: 400,
      });
    }

    // Construct conversation context for Gemini
    const conversationContext = messages
      .map((msg) => `${msg.sender === "user" ? "User" : "Bot"}: ${msg.text}`)
      .join("\n");

    const promptWithInstruction = `
You are Saksham, a friendly health assistant chatbot.
Reply in a short, simple, helpful way (8-10 lines max).

Previous conversation:
${conversationContext}
If you can confidently answer, provide the reply normally. 
If you cannot confidently provide details about a disease or medicine, suggest the user check more info on the "View Medicine Info" page.

Additionally, if appropriate, suggest *2 to 3 most relevant actions* the user can take.
Each action must have a "label" and a "route" field corresponding to app pages.
Only include actions that are relevant to the user's messages.
Always limit the actions array to *maximum 3 items* and minimum 2 items.

Available actions:
1. Consult a Doctor -> "/user/doctor"
2. Check Predicted Disease -> "/user/ml"
3. Buy Medicines -> "/pharmacy/home"
4. Visit Pathlab -> "/user/pathlabs"
5. View Medicine Info -> "/user/ocr" (only if unknown medicine)
6. Call Ambulance -> "/user/sos" (only in emergencies)

Respond ONLY in the following JSON format WITHOUT any extra text or commentary:
{
  "reply": "Your natural language reply here",
  "actions": [
    { "label": "Action Label", "route": "/relevant-route" }
  ]
}
`;

    // Call Gemini API
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: promptWithInstruction }] }] },
      { headers: { "Content-Type": "application/json" } }
    );

    const botText =
      geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Safely parse Gemini JSON response
    let botReply = { reply: botText, actions: [] };
    try {
      const jsonMatch = botText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        botReply = JSON.parse(jsonMatch[0]);
        if (botReply.actions && botReply.actions.length > 3) {
          botReply.actions = botReply.actions.slice(0, 3);
        }
      } else {
        console.log("No JSON found, using plain text fallback");
      }
    } catch (err) {
      console.log("Failed to parse Gemini JSON, fallback to plain text");
    }

    return new Response(JSON.stringify(botReply), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    return new Response(JSON.stringify({ error: "Gemini API call failed" }), {
      status: 500,
    });
  }
}