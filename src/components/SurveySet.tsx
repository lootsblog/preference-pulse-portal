
import { useState, useEffect } from "react";
import { SurveySet as SurveySetType, ContentStyle, UserSelection, TopicSelection } from "@/types";
import ContentRow from "./ContentRow";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface SurveySetProps {
  surveySet: SurveySetType;
  onComplete: (
    contentSelections: UserSelection[], 
    topicSelection: TopicSelection
  ) => void;
  previousSelections?: {
    content: UserSelection[];
    topic: TopicSelection;
  };
}

const SurveySet = ({ 
  surveySet, 
  onComplete,
  previousSelections 
}: SurveySetProps) => {
  // Track selected content styles for each content item
  const [selectedItems, setSelectedItems] = useState<Record<string, ContentStyle>>({});
  
  // Track selected topic bait
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  // Validation state
  const [isValid, setIsValid] = useState(false);
  const [showValidationAlert, setShowValidationAlert] = useState(false);

  // Initialize with previous selections if available
  useEffect(() => {
    if (previousSelections) {
      const contentSelectionMap: Record<string, ContentStyle> = {};
      previousSelections.content.forEach(selection => {
        contentSelectionMap[selection.contentItemId] = selection.selectedStyle;
      });
      setSelectedItems(contentSelectionMap);
      setSelectedTopicId(previousSelections.topic.selectedTopicId);
    }
  }, [previousSelections]);

  // Validate selections whenever they change
  useEffect(() => {
    // All content items must have a selection
    const allContentSelected = surveySet.contentItems.every(
      item => selectedItems[item.id]
    );
    
    // A topic bait must be selected
    const hasTopicSelected = !!selectedTopicId;
    
    setIsValid(allContentSelected && hasTopicSelected);
  }, [selectedItems, selectedTopicId, surveySet.contentItems]);

  const handleSelectContent = (contentId: string, style: ContentStyle) => {
    setSelectedItems(prev => ({
      ...prev,
      [contentId]: style
    }));
  };

  const handleSelectTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
  };

  const handleSubmit = () => {
    if (isValid) {
      // Format selections for the parent component
      const contentSelections: UserSelection[] = Object.entries(selectedItems).map(
        ([contentItemId, selectedStyle]) => ({
          contentItemId,
          selectedStyle
        })
      );
      
      const topicSelection: TopicSelection = {
        selectedTopicId: selectedTopicId!
      };
      
      toast.success("Set completed successfully!");
      onComplete(contentSelections, topicSelection);
    } else {
      setShowValidationAlert(true);
      toast.error("Please complete all required selections");
    }
  };

  // Group content items by style
  const simpleRow = {
    style: 'simple' as ContentStyle,
    topic: surveySet.topicBaits.find(bait => bait.style === 'simple')!
  };
  
  const attractiveRow = {
    style: 'attractive' as ContentStyle,
    topic: surveySet.topicBaits.find(bait => bait.style === 'attractive')!
  };
  
  const genzRow = {
    style: 'genz' as ContentStyle,
    topic: surveySet.topicBaits.find(bait => bait.style === 'genz')!
  };

  return (
    <div className="space-y-6 my-6 animate-fade-in">
      <h2 className="text-3xl font-bold mb-6">{surveySet.name}</h2>
      
      {/* Validation alert */}
      {showValidationAlert && !isValid && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            Please select one content style for each item and choose one topic bait.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Content rows by style */}
      <ContentRow
        style={simpleRow.style}
        topicTitle={simpleRow.topic.title}
        topicId={simpleRow.topic.id}
        contentItems={surveySet.contentItems}
        onSelectContent={handleSelectContent}
        onSelectTopic={handleSelectTopic}
        selectedItems={selectedItems}
        selectedTopicId={selectedTopicId}
      />
      
      <ContentRow
        style={attractiveRow.style}
        topicTitle={attractiveRow.topic.title}
        topicId={attractiveRow.topic.id}
        contentItems={surveySet.contentItems}
        onSelectContent={handleSelectContent}
        onSelectTopic={handleSelectTopic}
        selectedItems={selectedItems}
        selectedTopicId={selectedTopicId}
      />
      
      <ContentRow
        style={genzRow.style}
        topicTitle={genzRow.topic.title}
        topicId={genzRow.topic.id}
        contentItems={surveySet.contentItems}
        onSelectContent={handleSelectContent}
        onSelectTopic={handleSelectTopic}
        selectedItems={selectedItems}
        selectedTopicId={selectedTopicId}
      />
      
      <div className="flex justify-end mt-8">
        <Button 
          onClick={handleSubmit} 
          disabled={!isValid}
          className="text-lg px-8 py-6 font-medium hover:shadow-lg transition-all"
        >
          Next Set
        </Button>
      </div>
    </div>
  );
};

export default SurveySet;
