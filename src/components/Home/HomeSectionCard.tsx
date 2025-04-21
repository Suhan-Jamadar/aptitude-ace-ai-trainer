
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HomeSectionCardProps {
  title: string;
  description: string;
  link: string;
  buttonText: string;
  borderColor: string;
  animationDelay: string;
}

const HomeSectionCard: React.FC<HomeSectionCardProps> = ({
  title,
  description,
  link,
  buttonText,
  borderColor,
  animationDelay,
}) => (
  <div
    className={`bg-white/80 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-l-4 ${borderColor} animate-fade-in`}
    style={{ animationDelay }}
  >
    <h2 className="text-xl font-semibold mb-3 text-custom-darkBlue1">{title}</h2>
    <p className="text-custom-darkBlue2 mb-4">{description}</p>
    <Link to={link}>
      <Button className="w-full bg-custom-darkBlue1 hover:bg-custom-darkBlue2 text-white">
        {buttonText}
      </Button>
    </Link>
  </div>
);

export default HomeSectionCard;
