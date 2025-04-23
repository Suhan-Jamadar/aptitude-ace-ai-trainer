
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "AI-Powered Learning",
    description: "Get personalized recommendations based on your performance",
    icon: "⚡",
  },
  {
    title: "Topic-Specific Quizzes",
    description: "Practice with detailed explanations for better understanding",
    icon: "📝",
  },
  {
    title: "Daily Challenges",
    description: "Build consistent learning habits with daily exercises",
    icon: "🎯",
  },
  {
    title: "Smart Flashcards",
    description: "Convert your notes into AI-generated flashcards instantly",
    icon: "🔄",
  },
];

const HomeFeatures = () => (
  <div className="py-16 bg-gradient-to-b from-custom-lightGray to-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h3 className="text-2xl sm:text-3xl font-bold text-custom-darkBlue1 mb-8 text-center">
        What makes Aptitude Ace special?
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, idx) => (
          <Card 
            key={feature.title}
            className="animate-fade-in hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            style={{ animationDelay: `${0.75 + idx * 0.1}s` }}
          >
            <CardContent className="p-6">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h4 className="text-lg font-semibold text-custom-darkBlue1 mb-2">
                {feature.title}
              </h4>
              <p className="text-custom-darkBlue2">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

export default HomeFeatures;
