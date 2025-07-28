/**
 * Recommendation Plugin
 * 
 * AI-powered content recommendation engine that provides personalized video
 * suggestions based on viewing behavior, content analysis, and user preferences.
 * Supports multiple recommendation strategies and real-time adaptation.
 */

import { BasePlugin, type PluginConfig } from '../base-plugin';

interface RecommendationConfig extends PluginConfig {
  // Recommendation strategies
  strategies: {
    collaborative: boolean;     // Collaborative filtering
    contentBased: boolean;     // Content-based filtering
    hybrid: boolean;           // Hybrid approach
    trending: boolean;         // Trending content
    contextual: boolean;       // Context-aware recommendations
  };
  
  // Learning parameters
  learningRate: number;        // How quickly to adapt to new behavior
  diversityFactor: number;     // Balance between relevance and diversity
  recencyWeight: number;       // Weight for recent interactions
  
  // User behavior tracking
  trackingConfig: {
    watchTime: boolean;        // Track watch duration
    engagement: boolean;       // Track user engagement metrics
    preferences: boolean;      // Track explicit preferences
    skipPatterns: boolean;     // Track skip/seek patterns
    deviceContext: boolean;    // Consider device/time context
  };
  
  // Content analysis
  contentAnalysis: {
    genres: boolean;           // Analyze content genres
    topics: boolean;           // Extract content topics
    sentiment: boolean;        // Analyze sentiment
    complexity: boolean;       // Assess content complexity
    visualFeatures: boolean;   // Analyze visual characteristics
  };
  
  // API integrations
  apiServices: {
    enabled: boolean;
    recommendationEngine?: string;  // External recommendation API
    contentAnalysis?: string;       // Content analysis API
    userProfiling?: string;         // User profiling API
    apiKey?: string;
  };
  
  // Recommendation display
  maxRecommendations: number;  // Maximum recommendations to show
  updateInterval: number;      // How often to update recommendations (ms)
  showConfidence: boolean;     // Show confidence scores
  enableExplanations: boolean; // Provide recommendation explanations
}

interface UserProfile {
  id: string;
  preferences: {
    genres: { [genre: string]: number };
    topics: { [topic: string]: number };
    complexity: number;         // Preferred content complexity
    duration: number;          // Preferred video duration
    timeOfDay: { [hour: string]: number }; // Viewing time preferences
  };
  behavior: {
    totalWatchTime: number;
    averageSessionDuration: number;
    skipRate: number;
    engagementScore: number;
    lastActive: number;
  };
  context: {
    device: string;
    location?: string;
    language: string;
  };
}

interface ContentMetadata {
  id: string;
  title: string;
  description?: string;
  duration: number;
  genres: string[];
  topics: string[];
  complexity: number;
  sentiment: number;
  visualFeatures: {
    dominantColors: string[];
    brightness: number;
    motion: number;
    textDensity: number;
  };
  popularity: number;
  releaseDate: number;
  language: string;
}

interface Recommendation {
  id: string;
  contentId: string;
  content: ContentMetadata;
  score: number;
  confidence: number;
  strategy: string;
  explanation: string;
  timestamp: number;
  context: {
    reasonCode: string;
    factors: { [factor: string]: number };
    diversity: number;
  };
}

interface ViewingSession {
  contentId: string;
  startTime: number;
  endTime: number;
  watchDuration: number;
  completionRate: number;
  engagementEvents: {
    type: string;
    timestamp: number;
    value?: any;
  }[];
  context: {
    device: string;
    timeOfDay: number;
    sessionId: string;
  };
}

/**
 * AI-powered recommendation engine plugin
 */
export class RecommendationPlugin extends BasePlugin {
  readonly id = 'recommendation-engine';
  readonly name = 'Recommendation Engine';
  readonly version = '1.0.0';
  readonly type = 'ai';
  
  private videoElement?: HTMLVideoElement;
  private userProfile: UserProfile;
  private contentDatabase: Map<string, ContentMetadata> = new Map();
  private viewingHistory: ViewingSession[] = [];
  private currentSession: ViewingSession | null = null;
  private recommendations: Recommendation[] = [];
  
  // ML models and weights
  private collaborativeMatrix: Map<string, Map<string, number>> = new Map();
  private contentSimilarityMatrix: Map<string, Map<string, number>> = new Map();
  private userFactors: number[] = [];
  private itemFactors: Map<string, number[]> = new Map();
  
  // Real-time tracking
  private engagementMetrics: {
    pauseCount: number;
    seekCount: number;
    volumeChanges: number;
    playbackRateChanges: number;
    fullscreenToggled: number;
  } = {
    pauseCount: 0,
    seekCount: 0,
    volumeChanges: 0,
    playbackRateChanges: 0,
    fullscreenToggled: 0
  };
  
  private updateTimer?: NodeJS.Timeout;
  
  constructor(config: RecommendationConfig) {
    super(config);
    
    // Initialize user profile
    this.userProfile = this.createDefaultUserProfile();
  }

  async initialize(videoElement?: HTMLVideoElement): Promise<void> {
    if (videoElement) {
      this.videoElement = videoElement;
    }
    
    await this.loadUserProfile();
    await this.loadContentDatabase();
    this.setupEventListeners();
    this.startRecommendationUpdates();
    
    this.isInitialized = true;
    this.emit('recommendationEngineInitialized', { plugin: this.name });
  }

  async destroy(): Promise<void> {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
    }
    
    await this.saveUserProfile();
    await this.endCurrentSession();
    
    this.isInitialized = false;
  }

  /**
   * Create default user profile
   */
  private createDefaultUserProfile(): UserProfile {
    return {
      id: this.generateUserId(),
      preferences: {
        genres: {},
        topics: {},
        complexity: 0.5,
        duration: 600, // 10 minutes default
        timeOfDay: {}
      },
      behavior: {
        totalWatchTime: 0,
        averageSessionDuration: 0,
        skipRate: 0,
        engagementScore: 0.5,
        lastActive: Date.now()
      },
      context: {
        device: this.detectDevice(),
        language: navigator.language || 'en'
      }
    };
  }

  /**
   * Generate unique user ID
   */
  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Detect user device type
   */
  private detectDevice(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipad|tablet/.test(userAgent)) {
      return 'mobile';
    } else if (/smart-tv|tv|roku|appletv/.test(userAgent)) {
      return 'tv';
    } else {
      return 'desktop';
    }
  }

  /**
   * Setup event listeners for behavior tracking
   */
  private setupEventListeners(): void {
    if (!this.videoElement) return;
    
    // Playback events
    this.videoElement.addEventListener('play', () => {
      this.startSession();
      this.trackEngagement('play');
    });
    
    this.videoElement.addEventListener('pause', () => {
      this.engagementMetrics.pauseCount++;
      this.trackEngagement('pause');
    });
    
    this.videoElement.addEventListener('seeked', () => {
      this.engagementMetrics.seekCount++;
      this.trackEngagement('seek', this.videoElement!.currentTime);
    });
    
    this.videoElement.addEventListener('ended', () => {
      this.trackEngagement('completed');
      this.endCurrentSession();
    });
    
    this.videoElement.addEventListener('volumechange', () => {
      this.engagementMetrics.volumeChanges++;
      this.trackEngagement('volumeChange', this.videoElement!.volume);
    });
    
    this.videoElement.addEventListener('ratechange', () => {
      this.engagementMetrics.playbackRateChanges++;
      this.trackEngagement('rateChange', this.videoElement!.playbackRate);
    });
    
    // Fullscreen events
    document.addEventListener('fullscreenchange', () => {
      this.engagementMetrics.fullscreenToggled++;
      this.trackEngagement('fullscreenToggle', !!document.fullscreenElement);
    });
  }

  /**
   * Start recommendation updates
   */
  private startRecommendationUpdates(): void {
    const config = this.config as RecommendationConfig;
    this.updateTimer = setInterval(() => {
      this.updateRecommendations();
    }, config.updateInterval);
    
    // Initial recommendation generation
    this.updateRecommendations();
  }

  /**
   * Load user profile from storage
   */
  private async loadUserProfile(): Promise<void> {
    try {
      const stored = localStorage.getItem('videoPlayer_userProfile');
      if (stored) {
        this.userProfile = { ...this.userProfile, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn('Failed to load user profile:', error);
    }
  }

  /**
   * Save user profile to storage
   */
  private async saveUserProfile(): Promise<void> {
    try {
      localStorage.setItem('videoPlayer_userProfile', JSON.stringify(this.userProfile));
    } catch (error) {
      console.warn('Failed to save user profile:', error);
    }
  }

  /**
   * Load content database
   */
  private async loadContentDatabase(): Promise<void> {
    try {
      // In a real implementation, this would load from an API or database
      const stored = localStorage.getItem('videoPlayer_contentDatabase');
      if (stored) {
        const data = JSON.parse(stored);
        this.contentDatabase = new Map(data);
      } else {
        // Initialize with sample content
        this.initializeSampleContent();
      }
    } catch (error) {
      console.warn('Failed to load content database:', error);
      this.initializeSampleContent();
    }
  }

  /**
   * Initialize with sample content for demonstration
   */
  private initializeSampleContent(): void {
    const sampleContent: ContentMetadata[] = [
      {
        id: 'content_1',
        title: 'Documentary: Nature Exploration',
        duration: 1800,
        genres: ['documentary', 'nature'],
        topics: ['wildlife', 'environment', 'conservation'],
        complexity: 0.6,
        sentiment: 0.7,
        visualFeatures: {
          dominantColors: ['green', 'blue', 'brown'],
          brightness: 0.6,
          motion: 0.4,
          textDensity: 0.2
        },
        popularity: 0.8,
        releaseDate: Date.now() - 86400000,
        language: 'en'
      },
      {
        id: 'content_2',
        title: 'Tech Tutorial: JavaScript Basics',
        duration: 900,
        genres: ['educational', 'technology'],
        topics: ['programming', 'javascript', 'web development'],
        complexity: 0.7,
        sentiment: 0.6,
        visualFeatures: {
          dominantColors: ['black', 'white', 'blue'],
          brightness: 0.3,
          motion: 0.2,
          textDensity: 0.8
        },
        popularity: 0.9,
        releaseDate: Date.now() - 172800000,
        language: 'en'
      }
    ];
    
    sampleContent.forEach(content => {
      this.contentDatabase.set(content.id, content);
    });
  }

  /**
   * Start a new viewing session
   */
  private startSession(): void {
    if (this.currentSession) {
      this.endCurrentSession();
    }
    
    this.currentSession = {
      contentId: this.getCurrentContentId(),
      startTime: Date.now(),
      endTime: 0,
      watchDuration: 0,
      completionRate: 0,
      engagementEvents: [],
      context: {
        device: this.userProfile.context.device,
        timeOfDay: new Date().getHours(),
        sessionId: `session_${Date.now()}`
      }
    };
    
    // Reset engagement metrics
    this.engagementMetrics = {
      pauseCount: 0,
      seekCount: 0,
      volumeChanges: 0,
      playbackRateChanges: 0,
      fullscreenToggled: 0
    };
  }

  /**
   * End current viewing session
   */
  private endCurrentSession(): void {
    if (!this.currentSession || !this.videoElement) return;
    
    this.currentSession.endTime = Date.now();
    this.currentSession.watchDuration = this.videoElement.currentTime * 1000;
    this.currentSession.completionRate = this.videoElement.currentTime / this.videoElement.duration;
    
    // Add final engagement metrics
    this.trackEngagement('sessionEnd', {
      duration: this.currentSession.endTime - this.currentSession.startTime,
      watchDuration: this.currentSession.watchDuration,
      completionRate: this.currentSession.completionRate,
      engagementMetrics: { ...this.engagementMetrics }
    });
    
    this.viewingHistory.push(this.currentSession);
    this.updateUserProfile(this.currentSession);
    
    this.currentSession = null;
  }

  /**
   * Track engagement events
   */
  private trackEngagement(type: string, value?: any): void {
    if (!this.currentSession) return;
    
    this.currentSession.engagementEvents.push({
      type,
      timestamp: Date.now(),
      value
    });
  }

  /**
   * Get current content ID
   */
  private getCurrentContentId(): string {
    // In a real implementation, this would come from the video source or metadata
    return this.videoElement?.src || 'unknown_content';
  }

  /**
   * Update user profile based on viewing session
   */
  private updateUserProfile(session: ViewingSession): void {
    const content = this.contentDatabase.get(session.contentId);
    if (!content) return;
    
    const config = this.config as RecommendationConfig;
    const learningRate = config.learningRate;
    
    // Update preferences based on engagement
    const engagementScore = this.calculateEngagementScore(session);
    
    // Update genre preferences
    content.genres.forEach(genre => {
      const current = this.userProfile.preferences.genres[genre] || 0.5;
      this.userProfile.preferences.genres[genre] = 
        current + learningRate * (engagementScore - current);
    });
    
    // Update topic preferences
    content.topics.forEach(topic => {
      const current = this.userProfile.preferences.topics[topic] || 0.5;
      this.userProfile.preferences.topics[topic] = 
        current + learningRate * (engagementScore - current);
    });
    
    // Update complexity preference
    this.userProfile.preferences.complexity += 
      learningRate * (content.complexity - this.userProfile.preferences.complexity);
    
    // Update duration preference
    this.userProfile.preferences.duration += 
      learningRate * (content.duration - this.userProfile.preferences.duration);
    
    // Update time of day preferences
    const hour = new Date(session.startTime).getHours().toString();
    const currentTimeScore = this.userProfile.preferences.timeOfDay[hour] || 0.5;
    this.userProfile.preferences.timeOfDay[hour] = 
      currentTimeScore + learningRate * (engagementScore - currentTimeScore);
    
    // Update behavior metrics
    this.userProfile.behavior.totalWatchTime += session.watchDuration;
    this.userProfile.behavior.averageSessionDuration = 
      (this.userProfile.behavior.averageSessionDuration * (this.viewingHistory.length - 1) + 
       (session.endTime - session.startTime)) / this.viewingHistory.length;
    
    this.userProfile.behavior.skipRate = 
      (this.userProfile.behavior.skipRate * (this.viewingHistory.length - 1) + 
       (1 - session.completionRate)) / this.viewingHistory.length;
    
    this.userProfile.behavior.engagementScore = 
      (this.userProfile.behavior.engagementScore * (this.viewingHistory.length - 1) + 
       engagementScore) / this.viewingHistory.length;
    
    this.userProfile.behavior.lastActive = Date.now();
  }

  /**
   * Calculate engagement score for a session
   */
  private calculateEngagementScore(session: ViewingSession): number {
    let score = session.completionRate * 0.4; // 40% weight for completion
    
    // Analyze engagement events
    const eventWeights = {
      pause: -0.05,
      seek: -0.02,
      volumeChange: 0.02,
      rateChange: 0.01,
      fullscreenToggle: 0.1,
      completed: 0.3
    };
    
    for (const event of session.engagementEvents) {
      const weight = eventWeights[event.type as keyof typeof eventWeights] || 0;
      score += weight;
    }
    
    // Normalize to 0-1
    return Math.max(0, Math.min(1, score));
  }

  /**
   * Update recommendations based on current context
   */
  private async updateRecommendations(): Promise<void> {
    const newRecommendations: Recommendation[] = [];
    const config = this.config as RecommendationConfig;
    
    // Generate recommendations using different strategies
    if (config.strategies.collaborative) {
      const collabRecs = await this.generateCollaborativeRecommendations();
      newRecommendations.push(...collabRecs);
    }
    
    if (config.strategies.contentBased) {
      const contentRecs = await this.generateContentBasedRecommendations();
      newRecommendations.push(...contentRecs);
    }
    
    if (config.strategies.trending) {
      const trendingRecs = await this.generateTrendingRecommendations();
      newRecommendations.push(...trendingRecs);
    }
    
    if (config.strategies.contextual) {
      const contextualRecs = await this.generateContextualRecommendations();
      newRecommendations.push(...contextualRecs);
    }
    
    if (config.strategies.hybrid) {
      const hybridRecs = await this.generateHybridRecommendations();
      newRecommendations.push(...hybridRecs);
    }
    
    // Sort by score and apply diversity
    const rankedRecommendations = this.rankAndDiversifyRecommendations(newRecommendations);
    
    // Limit to max recommendations
    this.recommendations = rankedRecommendations.slice(0, config.maxRecommendations);
    
    this.emit('recommendationsUpdated', { 
      recommendations: this.recommendations,
      timestamp: Date.now()
    });
  }

  /**
   * Generate collaborative filtering recommendations
   */
  private async generateCollaborativeRecommendations(): Promise<Recommendation[]> {
    // Simplified collaborative filtering
    // In a real implementation, this would use matrix factorization or similar techniques
    
    const recommendations: Recommendation[] = [];
    const currentTime = Date.now();
    
    // Find similar users based on viewing patterns
    const similarUsers = this.findSimilarUsers();
    
    for (const [contentId, content] of this.contentDatabase) {
      if (this.hasUserWatched(contentId)) continue;
      
      let score = 0;
      let confidence = 0;
      
      // Calculate score based on similar users' preferences
      for (const similarUser of similarUsers) {
        const userScore = this.getUserContentScore(similarUser, contentId);
        const similarity = this.calculateUserSimilarity(this.userProfile, similarUser);
        score += userScore * similarity;
        confidence += similarity;
      }
      
      if (confidence > 0) {
        score /= confidence;
        confidence /= similarUsers.length;
        
        recommendations.push({
          id: `collab_${contentId}_${currentTime}`,
          contentId,
          content,
          score,
          confidence,
          strategy: 'collaborative',
          explanation: `Recommended based on users with similar viewing patterns`,
          timestamp: currentTime,
          context: {
            reasonCode: 'collaborative_filtering',
            factors: { similarity: confidence },
            diversity: 0.5
          }
        });
      }
    }
    
    return recommendations;
  }

  /**
   * Generate content-based recommendations
   */
  private async generateContentBasedRecommendations(): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];
    const currentTime = Date.now();
    
    // Get user's preferred content characteristics
    const userPrefs = this.userProfile.preferences;
    
    for (const [contentId, content] of this.contentDatabase) {
      if (this.hasUserWatched(contentId)) continue;
      
      let score = 0;
      let factors: { [key: string]: number } = {};
      
      // Genre matching
      let genreScore = 0;
      for (const genre of content.genres) {
        genreScore += userPrefs.genres[genre] || 0.5;
      }
      genreScore /= content.genres.length;
      factors.genre = genreScore;
      
      // Topic matching
      let topicScore = 0;
      for (const topic of content.topics) {
        topicScore += userPrefs.topics[topic] || 0.5;
      }
      topicScore /= content.topics.length;
      factors.topic = topicScore;
      
      // Complexity matching
      const complexityScore = 1 - Math.abs(content.complexity - userPrefs.complexity);
      factors.complexity = complexityScore;
      
      // Duration matching
      const durationScore = 1 - Math.abs(content.duration - userPrefs.duration) / Math.max(content.duration, userPrefs.duration);
      factors.duration = durationScore;
      
      // Combine factors
      score = (genreScore * 0.3 + topicScore * 0.3 + complexityScore * 0.2 + durationScore * 0.2);
      
      recommendations.push({
        id: `content_${contentId}_${currentTime}`,
        contentId,
        content,
        score,
        confidence: 0.8,
        strategy: 'content-based',
        explanation: `Matches your preferences for ${content.genres.join(', ')} content`,
        timestamp: currentTime,
        context: {
          reasonCode: 'content_similarity',
          factors,
          diversity: 0.6
        }
      });
    }
    
    return recommendations;
  }

  /**
   * Generate trending recommendations
   */
  private async generateTrendingRecommendations(): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];
    const currentTime = Date.now();
    
    // Sort content by popularity and recency
    const trendingContent = Array.from(this.contentDatabase.values())
      .filter(content => !this.hasUserWatched(content.id))
      .sort((a, b) => {
        const aScore = a.popularity * 0.7 + (1 - (currentTime - a.releaseDate) / (7 * 24 * 60 * 60 * 1000)) * 0.3;
        const bScore = b.popularity * 0.7 + (1 - (currentTime - b.releaseDate) / (7 * 24 * 60 * 60 * 1000)) * 0.3;
        return bScore - aScore;
      })
      .slice(0, 5);
    
    for (const content of trendingContent) {
      const recencyFactor = 1 - Math.min(1, (currentTime - content.releaseDate) / (7 * 24 * 60 * 60 * 1000));
      const score = content.popularity * 0.7 + recencyFactor * 0.3;
      
      recommendations.push({
        id: `trending_${content.id}_${currentTime}`,
        contentId: content.id,
        content,
        score,
        confidence: 0.6,
        strategy: 'trending',
        explanation: `Currently trending and popular content`,
        timestamp: currentTime,
        context: {
          reasonCode: 'trending_content',
          factors: {
            popularity: content.popularity,
            recency: recencyFactor
          },
          diversity: 0.8
        }
      });
    }
    
    return recommendations;
  }

  /**
   * Generate contextual recommendations
   */
  private async generateContextualRecommendations(): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];
    const currentTime = Date.now();
    const currentHour = new Date().getHours();
    
    // Consider time of day preferences
    const timePreference = this.userProfile.preferences.timeOfDay[currentHour.toString()] || 0.5;
    
    for (const [contentId, content] of this.contentDatabase) {
      if (this.hasUserWatched(contentId)) continue;
      
      let score = timePreference;
      const factors: { [key: string]: number } = { timeOfDay: timePreference };
      
      // Device context
      let deviceScore = 0.5;
      if (this.userProfile.context.device === 'mobile' && content.duration < 600) {
        deviceScore = 0.8; // Prefer shorter content on mobile
      } else if (this.userProfile.context.device === 'tv' && content.duration > 1200) {
        deviceScore = 0.8; // Prefer longer content on TV
      }
      factors.device = deviceScore;
      
      // Language matching
      const languageScore = content.language === this.userProfile.context.language ? 1.0 : 0.3;
      factors.language = languageScore;
      
      score = (score + deviceScore + languageScore) / 3;
      
      recommendations.push({
        id: `contextual_${contentId}_${currentTime}`,
        contentId,
        content,
        score,
        confidence: 0.7,
        strategy: 'contextual',
        explanation: `Recommended for current context (${this.userProfile.context.device}, ${currentHour}:00)`,
        timestamp: currentTime,
        context: {
          reasonCode: 'contextual_match',
          factors,
          diversity: 0.4
        }
      });
    }
    
    return recommendations;
  }

  /**
   * Generate hybrid recommendations
   */
  private async generateHybridRecommendations(): Promise<Recommendation[]> {
    // Combine multiple strategies with weighted scores
    const collabRecs = await this.generateCollaborativeRecommendations();
    const contentRecs = await this.generateContentBasedRecommendations();
    const contextRecs = await this.generateContextualRecommendations();
    
    const hybridMap = new Map<string, Recommendation>();
    
    // Weighted combination
    const weights = { collaborative: 0.3, 'content-based': 0.4, contextual: 0.3 };
    
    [...collabRecs, ...contentRecs, ...contextRecs].forEach(rec => {
      const existing = hybridMap.get(rec.contentId);
      const weight = weights[rec.strategy as keyof typeof weights] || 0.33;
      
      if (existing) {
        existing.score = (existing.score + rec.score * weight) / 2;
        existing.confidence = (existing.confidence + rec.confidence) / 2;
        existing.explanation += ` & ${rec.explanation}`;
      } else {
        hybridMap.set(rec.contentId, {
          ...rec,
          id: `hybrid_${rec.contentId}_${Date.now()}`,
          strategy: 'hybrid',
          score: rec.score * weight,
          explanation: `Hybrid: ${rec.explanation}`
        });
      }
    });
    
    return Array.from(hybridMap.values());
  }

  /**
   * Rank and diversify recommendations
   */
  private rankAndDiversifyRecommendations(recommendations: Recommendation[]): Recommendation[] {
    const config = this.config as RecommendationConfig;
    // Sort by score
    recommendations.sort((a, b) => b.score - a.score);
    
    // Apply diversity factor
    const diversified: Recommendation[] = [];
    const selectedGenres = new Set<string>();
    const selectedTopics = new Set<string>();
    
    for (const rec of recommendations) {
      let diversityBonus = 0;
      
      // Promote diversity in genres
      const newGenres = rec.content.genres.filter(g => !selectedGenres.has(g));
      if (newGenres.length > 0) {
        diversityBonus += 0.1 * config.diversityFactor;
        newGenres.forEach(g => selectedGenres.add(g));
      }
      
      // Promote diversity in topics
      const newTopics = rec.content.topics.filter(t => !selectedTopics.has(t));
      if (newTopics.length > 0) {
        diversityBonus += 0.1 * config.diversityFactor;
        newTopics.forEach(t => selectedTopics.add(t));
      }
      
      rec.score += diversityBonus;
      rec.context.diversity = diversityBonus / (0.2 * config.diversityFactor);
      
      diversified.push(rec);
    }
    
    // Re-sort after diversity adjustment
    return diversified.sort((a, b) => b.score - a.score);
  }

  // Helper methods for collaborative filtering

  /**
   * Find users with similar viewing patterns
   */
  private findSimilarUsers(): UserProfile[] {
    // In a real implementation, this would query a user database
    // For now, return synthetic similar users
    return [];
  }

  /**
   * Check if user has watched content
   */
  private hasUserWatched(contentId: string): boolean {
    return this.viewingHistory.some(session => session.contentId === contentId);
  }

  /**
   * Get user's score for specific content
   */
  private getUserContentScore(user: UserProfile, contentId: string): number {
    // Simplified scoring based on user preferences
    const content = this.contentDatabase.get(contentId);
    if (!content) return 0.5;
    
    let score = 0;
    let factors = 0;
    
    // Genre preferences
    for (const genre of content.genres) {
      score += user.preferences.genres[genre] || 0.5;
      factors++;
    }
    
    return factors > 0 ? score / factors : 0.5;
  }

  /**
   * Calculate similarity between users
   */
  private calculateUserSimilarity(user1: UserProfile, user2: UserProfile): number {
    // Simplified cosine similarity for genre preferences
    const genres1 = user1.preferences.genres;
    const genres2 = user2.preferences.genres;
    
    const allGenres = new Set([...Object.keys(genres1), ...Object.keys(genres2)]);
    
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (const genre of allGenres) {
      const score1 = genres1[genre] || 0;
      const score2 = genres2[genre] || 0;
      
      dotProduct += score1 * score2;
      norm1 += score1 * score1;
      norm2 += score2 * score2;
    }
    
    const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2);
    return magnitude > 0 ? dotProduct / magnitude : 0;
  }

  // Public API methods

  /**
   * Get current recommendations
   */
  getRecommendations(): Recommendation[] {
    return [...this.recommendations];
  }

  /**
   * Get user profile
   */
  getUserProfile(): UserProfile {
    return { ...this.userProfile };
  }

  /**
   * Get viewing history
   */
  getViewingHistory(): ViewingSession[] {
    return [...this.viewingHistory];
  }

  /**
   * Add explicit user feedback
   */
  addUserFeedback(contentId: string, rating: number, feedback?: string): void {
    const content = this.contentDatabase.get(contentId);
    if (!content) return;
    
    const config = this.config as RecommendationConfig;
    const learningRate = config.learningRate * 2; // Explicit feedback has higher weight
    
    // Update preferences based on rating
    content.genres.forEach(genre => {
      const current = this.userProfile.preferences.genres[genre] || 0.5;
      this.userProfile.preferences.genres[genre] = 
        current + learningRate * (rating - current);
    });
    
    content.topics.forEach(topic => {
      const current = this.userProfile.preferences.topics[topic] || 0.5;
      this.userProfile.preferences.topics[topic] = 
        current + learningRate * (rating - current);
    });
    
    this.emit('userFeedback', { contentId, rating, feedback });
    this.updateRecommendations();
  }

  /**
   * Reset user profile
   */
  resetUserProfile(): void {
    this.userProfile = this.createDefaultUserProfile();
    this.viewingHistory = [];
    this.recommendations = [];
    
    localStorage.removeItem('videoPlayer_userProfile');
    
    this.emit('userProfileReset', {});
    this.updateRecommendations();
  }

  /**
   * Export user data
   */
  exportUserData(): string {
    return JSON.stringify({
      userProfile: this.userProfile,
      viewingHistory: this.viewingHistory,
      recommendations: this.recommendations,
      exportTime: Date.now()
    }, null, 2);
  }

  /**
   * Import user data
   */
  importUserData(data: string): void {
    try {
      const parsed = JSON.parse(data);
      
      if (parsed.userProfile) {
        this.userProfile = parsed.userProfile;
      }
      
      if (parsed.viewingHistory) {
        this.viewingHistory = parsed.viewingHistory;
      }
      
      this.emit('userDataImported', { success: true });
      this.updateRecommendations();
    } catch (error) {
      console.error('Failed to import user data:', error);
      this.emit('userDataImported', { success: false, error });
    }
  }
}

// Default configuration
export const defaultRecommendationConfig: RecommendationConfig = {
  enabled: true,
  strategies: {
    collaborative: true,
    contentBased: true,
    hybrid: true,
    trending: true,
    contextual: true
  },
  learningRate: 0.1,
  diversityFactor: 0.3,
  recencyWeight: 0.2,
  trackingConfig: {
    watchTime: true,
    engagement: true,
    preferences: true,
    skipPatterns: true,
    deviceContext: true
  },
  contentAnalysis: {
    genres: true,
    topics: true,
    sentiment: true,
    complexity: true,
    visualFeatures: true
  },
  apiServices: {
    enabled: false
  },
  maxRecommendations: 10,
  updateInterval: 30000, // 30 seconds
  showConfidence: true,
  enableExplanations: true
};
