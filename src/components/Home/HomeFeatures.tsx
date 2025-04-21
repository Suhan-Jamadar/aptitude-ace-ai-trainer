
import React from "react";

const features = [
  "AI-driven personalized recommendations",
  "Topic-specific quizzes with detailed explanations",
  "Daily challenges to build learning habits",
  "AI-generated flashcards from your notes",
];

const HomeFeatures = () => (
  <div className="bg-custom-darkBlue1/5 rounded-lg p-6 mb-6 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.7s" }}>
    <h3 className="text-xl font-semibold text-custom-darkBlue1 mb-3 text-center">What makes Aptitude Ace special?</h3>
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
      {features.map((feature, idx) => (
        <li className="flex items-start animate-fade-in" style={{ animationDelay: `${0.75 + idx * 0.07}s` }} key={feature}>
          <span className="inline-flex items-center justify-center mr-3 bg-custom-gold/20 p-1 rounded-full mt-1">
            <svg className="h-4 w-4 text-custom-gold" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <span className="text-custom-darkBlue2">{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default HomeFeatures;
