
import { useAuthStore } from "@/stores/authStore";
import WelcomeHero from "@/components/shared/WelcomeHero";

const WelcomeSection = () => {
  const { user } = useAuthStore();

  return (
    <WelcomeHero
      name={user?.name || "User"}
      avatar={user?.avatar}
      title={`Welcome back, ${user?.name}!`}
      subtitle="Ready to take the next step in your product management journey?"
      gradient="from-blue-600 to-green-600"
    />
  );
};

export default WelcomeSection;
