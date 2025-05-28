
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface WelcomeHeroProps {
  name: string;
  avatar?: string;
  title: string;
  subtitle: string;
  gradient?: string;
}

const WelcomeHero = ({ 
  name, 
  avatar, 
  title, 
  subtitle, 
  gradient = "from-blue-600 to-green-600" 
}: WelcomeHeroProps) => {
  return (
    <div className={`bg-gradient-to-r ${gradient} rounded-lg p-6 text-white`}>
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16 border-4 border-white/20">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-blue-100">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHero;
