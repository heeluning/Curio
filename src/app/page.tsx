import ChatContainer from "@/components/ChatContainer";
import UploadContainer from "@/components/UploadContainer";

export default function Home() {
  return (
    <div className="h-screen w-screen bg-gradient-to-r from-blue-100 to-orange-100">
      <div className="flex flex-row h-full w-full">
        <div className="w-1/3 border-r-2 border-gray-200 border-dashed h-full">
          <UploadContainer />
        </div>
        <div className="w-2/3 h-full">
          <ChatContainer />
        </div>
      </div>
    </div>
  );
}