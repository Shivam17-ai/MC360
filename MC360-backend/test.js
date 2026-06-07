import { sendWhatsAppMessage }
from "./src/services/whatsapp.service.js";

await sendWhatsAppMessage(
  "+91YOURNUMBER",
  "Hello from MedConnect360 🚀"
);