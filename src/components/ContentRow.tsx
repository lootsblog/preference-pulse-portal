
import { useState } from "react";
import { ContentStyle, ContentItem } from "@/types";

interface ContentRowProps {
  style: ContentStyle;
  topicTitle: string;
  topicId: string;
  contentItems: ContentItem[];
  onSelectContent: (contentId: string, style: ContentStyle) => void;
  onSelectTopic: (topicId: string) => void;
  selectedItems: Record<string, ContentStyle>;
  selectedTopicId: string | null;
}

const ContentRow = ({
  style,
  topicTitle,
  topicId,
  contentItems,
  onSelectContent,
  onSelectTopic,
  selectedItems,
  selectedTopicId
}: ContentRowProps) => {
  // Style classes based on content style
  const getStyleClasses = () => {
    switch (style) {
      case 'simple':
        return {
          rowBg: 'bg-simple/5',
          border: 'border-simple/30',
          hover: 'hover:border-simple',
          title: 'text-simple',
          topicCard: 'bg-simple/10 border-simple/30',
          selectedTopic: 'bg-simple border-simple text-white shadow-md shadow-simple/20'
        };
      case 'attractive':
        return {
          rowBg: 'bg-attractive/5',
          border: 'border-attractive/30',
          hover: 'hover:border-attractive',
          title: 'text-attractive',
          topicCard: 'bg-attractive/10 border-attractive/30',
          selectedTopic: 'bg-attractive border-attractive text-white shadow-md shadow-attractive/20'
        };
      case 'genz':
        return {
          rowBg: 'bg-genz/5',
          border: 'border-genz/30',
          hover: 'hover:border-genz',
          title: 'text-genz',
          topicCard: 'bg-genz/10 border-genz/30',
          selectedTopic: 'bg-genz border-genz text-white shadow-md shadow-genz/20'
        };
    }
  };

  const classes = getStyleClasses();

  return (
    <div className={`p-6 mb-8 rounded-xl ${classes.rowBg}`}>
      {/* Topic Bait Card */}
      <div 
        className={`mb-4 p-4 border rounded-lg cursor-pointer transition-all duration-200 
                   ${topicId === selectedTopicId ? classes.selectedTopic : classes.topicCard}`}
        onClick={() => onSelectTopic(topicId)}
      >
        <h3 className={`font-bold text-xl ${topicId === selectedTopicId ? 'text-white' : classes.title}`}>
          {topicTitle}
        </h3>
      </div>

      {/* Content Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {contentItems.map((item) => (
          <div 
            key={item.id}
            className={`content-card rounded-lg border p-4 ${classes.border} ${classes.hover}`}
          >
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="w-full h-32 object-cover rounded-md mb-3"
            />
            <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
            <p className="text-sm text-gray-600 mb-4">
              {item.descriptions[style]}
            </p>
            <div className={`custom-radio style-${style} flex justify-center mt-2`}>
              <input
                type="radio"
                name={`content-${item.id}`}
                id={`${item.id}-${style}`}
                checked={selectedItems[item.id] === style}
                onChange={() => onSelectContent(item.id, style)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentRow;
