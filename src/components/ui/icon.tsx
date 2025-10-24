import React from "react";
import { LucideIcon, LucideProps } from "lucide-react"; // Import des types Lucide
import { cn } from "@/lib/utils"; // Utilise ton utilitaire pour fusionner les classes

// Interface des props : supporte 'name' (pour Lucide) et 'as' (pour composants personnalisés)
interface IconProps extends Omit<LucideProps, "name"> {
  name?: LucideIcon; // Pour les icônes Lucide (ex: Heart)
  as?: React.ComponentType<LucideProps>; // Pour des composants personnalisés (ex: MessageCircleMoreIcon)
  className?: string;
  size?: number;
}

// Le composant Icon
const Icon: React.FC<IconProps> = ({ name, as: AsComponent, className, size, ...props }) => {
  // Si 'as' est fourni, rend le composant personnalisé
  if (AsComponent) {
    return <AsComponent className={cn(className)} size={size} {...props} />;
  }

  // Sinon, rend l'icône Lucide via 'name'
  if (name) {
    const IconComponent = name;
    return <IconComponent className={cn(className)} size={size} {...props} />;
  }

  // Fallback : rien si rien n'est fourni
  return null;
};

export default Icon;