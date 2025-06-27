
import { useAuthStore } from "@/stores/authStore";
import WelcomeHero from "@/components/shared/WelcomeHero";

const WelcomeSection = () => {
  const { profile } = useAuthStore();

  return (
    <WelcomeHero
      name={profile?.name || "User"}
      avatar={profile?.avatar_url}
      title={`Welcome back, ${profile?.name}!`}
      subtitle="Ready to take the next step in your product management journey?"
      gradient="from-blue-600 to-green-600"
    />
  );
};

export default WelcomeSection;
