
import { Topic } from "@/types";

// Default topics with correct icons for the 6 required categories
export const defaultTopics: Topic[] = [
  {
    id: "1",
    name: "Quantitative Aptitude",
    description: "Master mathematical concepts and numerical reasoning",
    icon: "calculator",
    totalQuestions: 20,
    completedQuestions: 0,
    score: 0,
    isUnlocked: true,
    subtopics: [
      {
        id: "1-1",
        name: "Number Systems",
        link: "https://www.geeksforgeeks.org/number-system/"
      },
      {
        id: "1-2",
        name: "Arithmetic Operations",
        link: "https://www.geeksforgeeks.org/arithmetic-operations/"
      }
    ]
  },
  {
    id: "2",
    name: "Time & Work",
    description: "Calculate work efficiency and time required for tasks",
    icon: "clock",
    totalQuestions: 20,
    completedQuestions: 0,
    score: 0,
    isUnlocked: true,
    subtopics: [
      {
        id: "2-1",
        name: "Time and Work Basics",
        link: "https://www.geeksforgeeks.org/time-and-work-formula/"
      },
      {
        id: "2-2",
        name: "Efficiency Problems",
        link: "https://www.geeksforgeeks.org/efficiency-problems/"
      }
    ]
  },
  {
    id: "3",
    name: "Time, Speed & Distance",
    description: "Solve problems related to time, speed and distance calculations",
    icon: "clock",
    totalQuestions: 20,
    completedQuestions: 0,
    score: 0,
    isUnlocked: true,
    subtopics: [
      {
        id: "3-1",
        name: "Speed Concepts",
        link: "https://www.geeksforgeeks.org/speed-concepts/"
      },
      {
        id: "3-2",
        name: "Relative Speed",
        link: "https://www.geeksforgeeks.org/relative-speed/"
      }
    ]
  },
  {
    id: "4",
    name: "Percentages",
    description: "Master percentage calculations and applications",
    icon: "percent",
    totalQuestions: 20,
    completedQuestions: 0,
    score: 0,
    isUnlocked: true,
    subtopics: [
      {
        id: "4-1",
        name: "Basic Percentage Concepts",
        link: "https://www.geeksforgeeks.org/percentages-basic-concepts/"
      },
      {
        id: "4-2",
        name: "Percentage Change",
        link: "https://www.geeksforgeeks.org/percentage-change/"
      }
    ]
  },
  {
    id: "5",
    name: "Profit & Loss",
    description: "Calculate profit, loss, and percentages in business scenarios",
    icon: "dollar-sign",
    totalQuestions: 20,
    completedQuestions: 0,
    score: 0,
    isUnlocked: true,
    subtopics: [
      {
        id: "5-1",
        name: "Basic Concepts",
        link: "https://www.geeksforgeeks.org/profit-and-loss-basics/"
      },
      {
        id: "5-2",
        name: "Marked Price & Discount",
        link: "https://www.geeksforgeeks.org/marked-price-and-discount/"
      }
    ]
  },
  {
    id: "6",
    name: "Data Interpretation",
    description: "Analyze and interpret data from charts, graphs and tables",
    icon: "bar-chart",
    totalQuestions: 20,
    completedQuestions: 0,
    score: 0,
    isUnlocked: true,
    subtopics: [
      {
        id: "6-1",
        name: "Tables Analysis",
        link: "https://www.geeksforgeeks.org/data-interpretation-tables/"
      },
      {
        id: "6-2",
        name: "Bar Graphs",
        link: "https://www.geeksforgeeks.org/data-interpretation-bar-graphs/"
      }
    ]
  }
];
