
import { useState, useEffect } from "react";

interface TopicConceptsProps {
  topicId: string;
}

// This is a mock content, in real app this would come from an API
const mockConceptsContent: Record<string, { title: string; content: string[] }[]> = {
  "t1": [
    {
      title: "Understanding Number Systems",
      content: [
        "A number system is a writing system for expressing numbers using digits or symbols in a consistent manner.",
        "The most common number system is the decimal (base-10) system, which uses ten digits from 0 to 9.",
        "Other important number systems include binary (base-2), octal (base-8), and hexadecimal (base-16)."
      ]
    },
    {
      title: "Prime Numbers",
      content: [
        "A prime number is a natural number greater than 1 that is not a product of two smaller natural numbers.",
        "The first few prime numbers are 2, 3, 5, 7, 11, 13, 17, 19, 23, and 29.",
        "The Sieve of Eratosthenes is an ancient algorithm for finding all prime numbers up to any given limit."
      ]
    },
    {
      title: "Factors and Multiples",
      content: [
        "A factor of a number is any number that divides it evenly (with no remainder).",
        "A multiple of a number is any number that is the product of that number and an integer.",
        "The Least Common Multiple (LCM) of two numbers is the smallest positive number that is divisible by both."
      ]
    }
  ],
  "t2": [
    {
      title: "Ratios and Proportions",
      content: [
        "A ratio is a comparison of two quantities expressed as a fraction.",
        "A proportion is an equation stating that two ratios are equal.",
        "The cross multiplication method is used to solve proportions: If a/b = c/d, then ad = bc."
      ]
    }
  ]
  // Add more topics as needed
};

const TopicConcepts = ({ topicId }: TopicConceptsProps) => {
  const [concepts, setConcepts] = useState<{ title: string; content: string[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    setLoading(true);
    setTimeout(() => {
      setConcepts(mockConceptsContent[topicId] || []);
      setLoading(false);
    }, 500);
  }, [topicId]);

  if (loading) {
    return <div className="flex justify-center p-12">Loading concepts...</div>;
  }

  if (concepts.length === 0) {
    return <div>No concept information available for this topic.</div>;
  }

  return (
    <div className="space-y-8 bg-white p-6 rounded-lg shadow">
      {concepts.map((concept, index) => (
        <div key={index} className={index > 0 ? "pt-8 border-t border-gray-200" : ""}>
          <h3 className="text-xl font-semibold text-custom-darkBlue1 mb-4">{concept.title}</h3>
          <div className="space-y-3">
            {concept.content.map((paragraph, pIndex) => (
              <p key={pIndex} className="text-gray-700">{paragraph}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopicConcepts;
