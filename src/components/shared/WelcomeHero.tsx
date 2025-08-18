
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
    <div className={`bg-gradient-to-r ${gradient} rounded-lg p-4 sm:p-6 text-white`}>
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
        <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-4 border-white/20 flex-shrink-0">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="text-sm sm:text-base">{name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold leading-tight">{title}</h2>
          <p className="text-blue-100 text-sm sm:text-base mt-1">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHero;
