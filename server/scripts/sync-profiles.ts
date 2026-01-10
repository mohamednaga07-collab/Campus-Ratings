import "dotenv/config";
import { storage } from "../storage";

async function syncProfiles() {
  console.log("Starting targeted sync (with dotenv)...");
  try {
    const users = await storage.getAllUsers();
    const doctors = await storage.getAllDoctors();

    const mcUser = users.find(u => u.username?.includes('Chen') || u.lastName?.includes('Chen'));
    if (!mcUser) {
        console.log("User Michael Chen NOT FOUND");
        return;
    }

    console.log(`User: ${mcUser.username} | Role: ${mcUser.role} | Image: ${mcUser.profileImageUrl ? 'YES (' + mcUser.profileImageUrl.length + ' chars)' : 'NULL'}`);

    const mcDoc = doctors.find(d => d.name === 'Michael Chen' || d.name === 'Dr. Michael Chen');
    if (!mcDoc) {
        console.log("Doctor Michael Chen NOT FOUND");
        return;
    }

    console.log(`Doctor: ${mcDoc.name} | Image: ${mcDoc.profileImageUrl ? 'YES' : 'NULL'}`);

    if (mcUser.profileImageUrl) {
        console.log("FORCING UPDATE on Doctor...");
        await storage.updateDoctor(mcDoc.id, { profileImageUrl: mcUser.profileImageUrl });
        console.log("Forced update complete.");
    } else {
        console.log("User has no image, cannot sync.");
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

syncProfiles();
