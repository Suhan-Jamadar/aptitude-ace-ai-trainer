
import React from "react";

// Replace the image below with a real 3D canvas if needed!
const AptitudeFeature3D = () => {
  return (
    <div className="w-full flex justify-center my-4 animate-fade-in" style={{ animationDelay: "0.09s" }}>
      <img 
        src="/lovable-uploads/53b4ea3e-dcdf-4df4-98dd-c877977e6f16.png"
        alt="3D Aptitude Animation"
        className="max-w-xs sm:max-w-md md:max-w-lg rounded-lg drop-shadow-xl animate-float"
        style={{ aspectRatio: "16/10", objectFit: "cover" }}
      />
    </div>
  );
};

export default AptitudeFeature3D;
