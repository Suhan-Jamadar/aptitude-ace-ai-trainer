
import { useState, useEffect } from "react";

interface TopicFormulasProps {
  topicId: string;
}

// This is mock content, in a real app this would come from an API
const mockFormulasContent: Record<string, { category: string; formulas: { name: string; formula: string; explanation: string }[] }[]> = {
  "t1": [
    {
      category: "Number Properties",
      formulas: [
        {
          name: "Sum of First n Natural Numbers",
          formula: "S = n(n+1)/2",
          explanation: "This formula gives the sum of the first n natural numbers. For example, the sum of first 5 natural numbers is 5(5+1)/2 = 15."
        },
        {
          name: "Sum of First n Odd Numbers",
          formula: "S = n²",
          explanation: "The sum of the first n odd numbers is equal to n squared. For example, 1+3+5+7+9 = 25 = 5²."
        },
        {
          name: "Sum of First n Even Numbers",
          formula: "S = n(n+1)",
          explanation: "This formula calculates the sum of the first n even numbers. For example, the sum of first 5 even numbers (2+4+6+8+10) is 5(5+1) = 30."
        }
      ]
    },
    {
      category: "Divisibility Rules",
      formulas: [
        {
          name: "Divisibility by 2",
          formula: "The last digit is even (0, 2, 4, 6, 8)",
          explanation: "A number is divisible by 2 if its last digit is divisible by 2."
        },
        {
          name: "Divisibility by 3",
          formula: "The sum of all digits is divisible by 3",
          explanation: "For example, 123 is divisible by 3 because 1+2+3=6, which is divisible by 3."
        },
        {
          name: "Divisibility by 9",
          formula: "The sum of all digits is divisible by 9",
          explanation: "For example, 729 is divisible by 9 because 7+2+9=18, which is divisible by 9."
        }
      ]
    }
  ],
  "t2": [
    {
      category: "Ratios and Proportions",
      formulas: [
        {
          name: "Proportion Formula",
          formula: "If a/b = c/d, then ad = bc",
          explanation: "This is the cross-multiplication method for solving proportions."
        }
      ]
    }
  ]
  // Add more topics as needed
};

const TopicFormulas = ({ topicId }: TopicFormulasProps) => {
  const [formulaGroups, setFormulaGroups] = useState<{ category: string; formulas: { name: string; formula: string; explanation: string }[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    setLoading(true);
    setTimeout(() => {
      setFormulaGroups(mockFormulasContent[topicId] || []);
      setLoading(false);
    }, 500);
  }, [topicId]);

  if (loading) {
    return <div className="flex justify-center p-12">Loading formulas...</div>;
  }

  if (formulaGroups.length === 0) {
    return <div>No formula information available for this topic.</div>;
  }

  return (
    <div className="space-y-10 bg-white p-6 rounded-lg shadow">
      {formulaGroups.map((group, groupIndex) => (
        <div key={groupIndex} className={groupIndex > 0 ? "pt-8 border-t border-gray-200" : ""}>
          <h3 className="text-xl font-semibold text-custom-darkBlue1 mb-4">{group.category}</h3>
          <div className="space-y-6">
            {group.formulas.map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h4 className="font-medium text-lg mb-2">{item.name}</h4>
                <div className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-400 font-mono text-lg mb-3">
                  {item.formula}
                </div>
                <p className="text-gray-700">{item.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopicFormulas;
