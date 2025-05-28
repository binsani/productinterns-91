
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/authStore";

const WelcomeSection = () => {
  const { user } = useAuthStore();

  return (
    <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-6 text-white">
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16 border-4 border-white/20">
          <AvatarImage src={user?.avatar} alt={user?.name} />
          <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">Welcome back, {user?.name}!</h2>
          <p className="text-blue-100">Ready to take the next step in your product management journey?</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
