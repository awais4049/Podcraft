export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: string;
}

export interface PodcastProfile {
  id: string;
  userId: string;
  name: string;
  niche: string;
  description: string;
  audience: string;
  coverImage?: string;
  createdAt: string;
}

export interface Episode {
  id: string;
  userId: string;
  title: string;
  niche: string;
  guestName?: string;
  guestBio?: string;
  goal: string;
  tone: string;
  length: string;
  format: string;
  status: 'draft' | 'completed';
  createdAt: string;
  updatedAt: string;
  data?: PodcastPlanResponse;
}

export interface PodcastPlanResponse {
  topics: {
    title: string;
    whyItMatters: string;
    talkingPoints: string[];
    suggestedSegment: string;
  }[];
  questions: {
    question: string;
    duration: string;
    category: string;
    priority: 'High' | 'Medium' | 'Low';
  }[];
  hooks: string[];
  intros: {
    tone: string;
    script: string;
  }[];
  outline: {
    title: string;
    segments: {
      name: string;
      description: string;
      duration: string;
      transition: string;
    }[];
  };
  timestamps: {
    time: string;
    label: string;
  }[];
}
