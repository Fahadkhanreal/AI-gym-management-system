import axios from "axios";

const instanceId = process.env.GREEN_API_INSTANCE_ID || "";
const apiToken = process.env.GREEN_API_TOKEN || "";
const apiUrl = process.env.GREEN_API_URL || "";

interface SendMessageResponse {
  success: boolean;
  idMessage?: string;
}

/**
 * Send a WhatsApp text message via Green API.
 */
export async function sendWhatsAppMessage(
  chatId: string,
  message: string,
): Promise<SendMessageResponse> {
  try {
    const url = `${apiUrl}/waInstance${instanceId}/sendMessage/${apiToken}`;
    const response = await axios.post(url, {
      chatId: `${chatId}@c.us`,
      message,
    });

    return { success: true, idMessage: response.data?.idMessage };
  } catch (error) {
    console.error("Green API sendMessage error:", error);
    return { success: false };
  }
}
