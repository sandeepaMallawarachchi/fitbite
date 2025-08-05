import { useSearchParams } from "react-router-dom";
import SmartMealAssistant from "../components/SmartMealAssistant";

const SmartMealAssistantWrapper = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const userName = searchParams.get("userName");

  if (!userId) return <div className="text-center p-6">Invalid user</div>;

  return (
    <div className="p-4">
      <SmartMealAssistant
        userId={userId}
        userName={userName || undefined}
        readOnly={true}
      />
    </div>
  );
};

export default SmartMealAssistantWrapper;
