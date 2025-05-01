
import { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

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
    },
    {
      title: "Divisibility Rules",
      content: [
        "A number is divisible by 2 if its last digit is even (0, 2, 4, 6, 8).",
        "A number is divisible by 3 if the sum of all its digits is divisible by 3.",
        "A number is divisible by 5 if its last digit is 0 or 5.",
        "A number is divisible by 9 if the sum of all its digits is divisible by 9."
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
    },
    {
      title: "Understanding Percentages",
      content: [
        "A percentage is a number expressed as a fraction of 100.",
        "To convert a percentage to a decimal, divide by 100.",
        "To find a percentage of a number, multiply the number by the percentage expressed as a decimal."
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
    return (
      <div className="flex flex-col gap-4 py-4">
        <div className="animate-pulse h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="animate-pulse h-24 bg-gray-200 rounded w-full mb-6"></div>
        <div className="animate-pulse h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="animate-pulse h-24 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  if (concepts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="text-4xl mb-4">📚</div>
        <h3 className="text-xl font-medium mb-2">No theory available yet</h3>
        <p className="text-gray-500">We're still working on this content. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-custom-darkBlue1 mb-6">Theoretical Concepts</h2>
      
      <Accordion type="single" collapsible className="w-full">
        {concepts.map((concept, index) => (
          <AccordionItem key={index} value={`concept-${index}`} className="border-b border-gray-200">
            <AccordionTrigger className="text-lg font-semibold text-custom-darkBlue1 hover:text-custom-gold py-4">
              {concept.title}
            </AccordionTrigger>
            <AccordionContent>
              <Card className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="space-y-4">
                  {concept.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-gray-700 leading-relaxed">
                      • {paragraph}
                    </p>
                  ))}
                </div>
              </Card>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default TopicConcepts;
