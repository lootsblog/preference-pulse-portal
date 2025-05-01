
// Types for our survey application

export type ContentStyle = 'simple' | 'attractive' | 'genz';

export interface ContentItem {
  id: string;
  title: string;
  imageUrl: string;
  descriptions: Record<ContentStyle, string>;
}

export interface TopicBait {
  id: string;
  style: ContentStyle;
  title: string;
}

export interface SurveySet {
  id: string;
  name: string;
  topicBaits: TopicBait[];
  contentItems: ContentItem[];
}

export interface UserSelection {
  contentItemId: string;
  selectedStyle: ContentStyle;
}

export interface TopicSelection {
  selectedTopicId: string;
}

export interface SurveyState {
  currentSetIndex: number;
  user: {
    name: string;
    userId: string;
  };
  selectedContent: Record<string, UserSelection[]>;
  selectedTopics: Record<string, TopicSelection>;
}
