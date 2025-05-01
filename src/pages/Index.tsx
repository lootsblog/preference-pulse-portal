
import { useState } from "react";
import OnboardingForm from "@/components/OnboardingForm";
import SurveySet from "@/components/SurveySet";
import ProgressBar from "@/components/ProgressBar";
import SurveyComplete from "@/components/SurveyComplete";
import { surveySets } from "@/data/mockData";
import { SurveyState, UserSelection, TopicSelection } from "@/types";

const Index = () => {
  const [surveyState, setSurveyState] = useState<SurveyState>({
    currentSetIndex: -1, // -1 means onboarding, sets start from 0
    user: {
      name: "",
      userId: "",
    },
    selectedContent: {},
    selectedTopics: {},
  });

  const handleStartSurvey = (name: string, userId: string) => {
    setSurveyState({
      ...surveyState,
      currentSetIndex: 0,
      user: { name, userId }
    });
  };

  const handleSetComplete = (
    contentSelections: UserSelection[],
    topicSelection: TopicSelection
  ) => {
    const currentSetId = surveySets[surveyState.currentSetIndex].id;

    // Update survey state with selections
    setSurveyState(prev => ({
      ...prev,
      selectedContent: {
        ...prev.selectedContent,
        [currentSetId]: contentSelections
      },
      selectedTopics: {
        ...prev.selectedTopics,
        [currentSetId]: topicSelection
      },
      currentSetIndex: prev.currentSetIndex + 1
    }));
  };

  const handleRestart = () => {
    // Reset the survey state
    setSurveyState({
      currentSetIndex: -1,
      user: {
        name: "",
        userId: "",
      },
      selectedContent: {},
      selectedTopics: {},
    });
  };

  // Determine what to render based on survey state
  const renderContent = () => {
    // Show onboarding form
    if (surveyState.currentSetIndex === -1) {
      return (
        <div className="flex items-center justify-center min-h-[80vh]">
          <OnboardingForm onSubmit={handleStartSurvey} />
        </div>
      );
    }
    
    // Show completion screen if all sets are done
    if (surveyState.currentSetIndex >= surveySets.length) {
      return (
        <div className="flex items-center justify-center min-h-[80vh]">
          <SurveyComplete 
            userName={surveyState.user.name}
            onRestart={handleRestart}
          />
        </div>
      );
    }
    
    // Show current survey set
    const currentSet = surveySets[surveyState.currentSetIndex];
    
    // Check if we have previous selections for this set
    const previousSelections = currentSet.id in surveyState.selectedContent 
      ? {
          content: surveyState.selectedContent[currentSet.id],
          topic: surveyState.selectedTopics[currentSet.id]
        }
      : undefined;
    
    return (
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <ProgressBar 
            currentStep={surveyState.currentSetIndex + 1} 
            totalSteps={surveySets.length} 
          />
        </div>
        
        <SurveySet 
          surveySet={currentSet}
          onComplete={handleSetComplete}
          previousSelections={previousSelections}
        />
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <header className="bg-white shadow-sm py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Preference Pulse Portal
          </h1>
          {surveyState.currentSetIndex >= 0 && (
            <p className="text-gray-600">
              Hello, {surveyState.user.name}! Help us understand your content preferences.
            </p>
          )}
        </div>
      </header>
      
      <main className="py-8">
        {renderContent()}
      </main>
      
      <footer className="bg-white border-t py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500">
          © 2025 Preference Pulse Portal. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
