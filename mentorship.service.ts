import { Mentorship } from '../models/Mentorship';
import { User } from '../models/User';

export class MentorshipService {
  static async matchMentor(menteeId: string, preferences: any) {
    const mentors = await User.find({
      mentorStatus: 'mentor',
      interests: { $in: preferences.interests }
    });

    // Simple matching algorithm
    const matches = mentors.map(mentor => ({
      mentor,
      score: this.calculateMatchScore(mentor, preferences)
    }));

    return matches.sort((a, b) => b.score - a.score);
  }

  static calculateMatchScore(mentor: any, preferences: any) {
    let score = 0;
    // Calculate compatibility based on various factors
    if (mentor.businessType === preferences.businessType) score += 2;
    const commonInterests = mentor.interests.filter((i: string) => 
      preferences.interests.includes(i)
    ).length;
    score += commonInterests;
    return score;
  }

  static async createMentorshipSession(mentorId: string, menteeId: string) {
    const mentorship = new Mentorship({
      mentor: mentorId,
      mentee: menteeId,
      startDate: new Date(),
      status: 'active'
    });
    await mentorship.save();
    return mentorship;
  }
}