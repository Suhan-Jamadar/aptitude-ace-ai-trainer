
import { Topic } from "@/types";
import { TopicCard } from "./TopicCard";

interface TopicListProps {
  topics: Topic[];
}

export const TopicList = ({ topics }: TopicListProps) => {
  // Filter out any duplicates based on the topic id
  const uniqueTopics = topics.filter(
    (topic, index, self) => index === self.findIndex(t => t.id === topic.id)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {uniqueTopics.map((topic) => (
        <TopicCard key={topic.id} topic={topic} />
      ))}
    </div>
  );
};
