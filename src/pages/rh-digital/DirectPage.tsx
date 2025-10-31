import { RhDigitalProvider } from "@/contexts/RhDigitalContext";
import DirectChatTab from "./DirectChatTab";
export default function DirectPage() {
  return <RhDigitalProvider>
      <div className="container mx-auto p-6 space-y-6">
        
        <DirectChatTab />
      </div>
    </RhDigitalProvider>;
}