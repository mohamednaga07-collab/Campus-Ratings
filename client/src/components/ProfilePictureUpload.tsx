import { useState, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { User } from "@shared/schema";

interface ProfilePictureUploadProps {
  user: User;
  onUploadComplete?: () => void;
  size?: "sm" | "md" | "lg";
  showEditButton?: boolean;
}

export function ProfilePictureUpload({ 
  user, 
  onUploadComplete,
  size = "md",
  showEditButton = true 
}: ProfilePictureUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [imageKey, setImageKey] = useState(0); // Force re-render
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16"
  };

  const userInitials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "U";

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum size is 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          const imageData = reader.result as string;

          // Upload to server
          const response = await fetch("/api/auth/upload-profile-picture", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-Token": await getCsrfToken(),
            },
            credentials: "include",
            body: JSON.stringify({ imageData }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Upload failed");
          }

          const result = await response.json();

          // Force image refresh
          setImageKey(prev => prev + 1);

          toast({
            title: "Success!",
            description: "Profile picture updated",
          });

          // Callback for parent to refresh
          if (onUploadComplete) {
            onUploadComplete();
          }

          // Force page reload to ensure everything updates
          setTimeout(() => {
            window.location.reload();
          }, 500);

        } catch (error: any) {
          toast({
            title: "Upload failed",
            description: error.message,
            variant: "destructive",
          });
        } finally {
          setUploading(false);
        }
      };

      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to read file",
          variant: "destructive",
        });
        setUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Upload failed",
        variant: "destructive",
      });
      setUploading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
        disabled={uploading}
        aria-label="Upload profile picture"
      />
      
      <Avatar 
        className={`${sizeClasses[size]} cursor-pointer transition-all hover:opacity-80`}
        onClick={() => showEditButton && fileInputRef.current?.click()}
      >
        <AvatarImage 
          key={imageKey} // Force re-render when key changes
          src={user.profileImageUrl ?? undefined} 
          alt={user.firstName ?? "User"} 
        />
        <AvatarFallback className="font-semibold">
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            userInitials
          )}
        </AvatarFallback>
      </Avatar>

      {showEditButton && (
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute -bottom-1 -right-1 rounded-full bg-primary p-1.5 text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Camera className="h-3 w-3" />
          )}
        </button>
      )}
    </div>
  );
}

// Helper to get CSRF token
async function getCsrfToken(): Promise<string> {
  try {
    const res = await fetch("/api/auth/csrf-token");
    if (res.ok) {
      const data = await res.json();
      return data.csrfToken;
    }
  } catch (e) {
    console.error("Failed to fetch CSRF token", e);
  }
  return "";
}
