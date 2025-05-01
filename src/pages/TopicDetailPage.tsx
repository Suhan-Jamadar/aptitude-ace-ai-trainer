
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { mockTopics, mockQuestions } from "@/services/mockData";
import TopicQuestionsList from "@/components/Aptitude/TopicQuestionsList";
import TopicConcepts from "@/components/Aptitude/TopicConcepts";
import { ChevronLeft, BookOpen, BookText } from "lucide-react";
import { Topic } from "@/types";

const TopicDetailPage = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [activeTab, setActiveTab] = useState("theory");

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
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse w-full max-w-lg">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
              <div className="h-32 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
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
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/aptitude")}
            className="mb-4 hover:bg-gray-100 transition-all duration-300"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Topics
          </Button>
          <h1 className="text-4xl font-bold text-custom-darkBlue1 mb-2">{topic.name}</h1>
          <p className="text-gray-600 text-lg">{topic.description}</p>
        </div>

        <Tabs 
          defaultValue="theory" 
          className="w-full" 
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <div className="flex justify-center items-center mb-8">
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger 
                value="theory" 
                className="px-8 py-3 text-base font-medium flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800"
              >
                <BookOpen className="h-5 w-5" />
                Theory
              </TabsTrigger>
              <TabsTrigger 
                value="questions" 
                className="px-8 py-3 text-base font-medium flex items-center gap-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-800"
              >
                <BookText className="h-5 w-5" />
                Practice Questions
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 min-h-[500px]">
            <TabsContent value="theory" className="animate-fade-in">
              <TopicConcepts topicId={topicId || ""} />
            </TabsContent>
            
            <TabsContent value="questions" className="animate-fade-in">
              <TopicQuestionsList topicId={topicId || ""} />
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </MainLayout>
  );
};

export default TopicDetailPage;
