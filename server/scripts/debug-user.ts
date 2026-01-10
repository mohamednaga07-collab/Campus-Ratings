
import { storage } from "../storage";

async function debugUser() {
  const users = await storage.getAllUsers();
  const mc = users.find(u => u.username?.includes('Chen') || u.lastName?.includes('Chen'));
  console.log(JSON.stringify(mc, null, 2));
}

debugUser();
