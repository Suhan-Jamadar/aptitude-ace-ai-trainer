
import { Topic } from "@/types";
import { TopicCard } from "./TopicCard";

interface TopicListProps {
  topics: Topic[];
}

export const TopicList = ({ topics }: TopicListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {topics.map((topic) => (
        <TopicCard key={topic.id} topic={topic} />
      ))}
    </div>
  );
};
