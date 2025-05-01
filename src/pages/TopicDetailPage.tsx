
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { mockTopics, mockQuestions } from "@/services/mockData";
import TopicQuestionsList from "@/components/Aptitude/TopicQuestionsList";
import TopicConcepts from "@/components/Aptitude/TopicConcepts";
import TopicFormulas from "@/components/Aptitude/TopicFormulas";
import { ChevronLeft } from "lucide-react";
import { Topic } from "@/types";

const TopicDetailPage = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [activeTab, setActiveTab] = useState("questions");

  useEffect(() => {
    if (topicId) {
      // In a real app, fetch topic data from API
      const currentTopic = mockTopics.find(t => t.id === topicId);
      if (currentTopic) {
        setTopic(currentTopic);
      } else {
        navigate("/aptitude");
      }
    }
  }, [topicId, navigate]);

  if (!topic) {
    return (
      <MainLayout showSidebar={true}>
        <div className="container mx-auto p-8">
          <h2>Loading...</h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showSidebar={true}>
      <motion.div 
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/aptitude")}
            className="mb-2"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Topics
          </Button>
          <h1 className="text-3xl font-bold text-custom-darkBlue1">{topic.name}</h1>
          <p className="text-gray-600 mt-2">{topic.description}</p>
        </div>

        <Tabs 
          defaultValue="questions" 
          className="w-full" 
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <div className="flex justify-between items-center mb-6">
            <TabsList className="grid grid-cols-3 w-auto">
              <TabsTrigger 
                value="concepts" 
                className="px-8 py-2 font-medium"
              >
                Concepts
              </TabsTrigger>
              <TabsTrigger 
                value="formulas" 
                className="px-8 py-2 font-medium"
              >
                Formulas
              </TabsTrigger>
              <TabsTrigger 
                value="questions" 
                className="bg-lime-300 hover:bg-lime-400 text-black px-8 py-2 font-medium"
              >
                Practice Questions
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="concepts">
            <TopicConcepts topicId={topicId || ""} />
          </TabsContent>
          
          <TabsContent value="formulas">
            <TopicFormulas topicId={topicId || ""} />
          </TabsContent>
          
          <TabsContent value="questions">
            <TopicQuestionsList topicId={topicId || ""} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </MainLayout>
  );
};

export default TopicDetailPage;
