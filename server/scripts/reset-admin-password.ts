
import { storage } from "../storage";
import { hashPassword } from "../auth";

async function resetAdminPassword() {
  const users = await storage.getAllUsers();
  const admin = users.find(u => u.username?.toLowerCase() === 'admin');
  
  if (!admin) {
    console.log("❌ Admin user not found.");
    return;
  }

  const newPassword = "AdminPassword123!";
  const hashedPassword = await hashPassword(newPassword);
  
  await storage.updateUserPassword(admin.id, hashedPassword);
  console.log(`✅ Password for user "${admin.username}" has been reset to: ${newPassword}`);
}

resetAdminPassword().catch(console.error);
