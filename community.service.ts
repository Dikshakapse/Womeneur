import { Post, Event } from '../models/Community';
import { User } from '../models/User';
import { ObjectId } from 'mongodb';

export interface EventData {
  // Define properties expected in event data (e.g., title, description, date)
}

export class CommunityService {
  static async createPost(userId: string, content: string, tags: string[]) {
    const post = new Post({
      author: userId,
      content,
      tags,
    });
    await post.save();
    return post;
  }

  static async organizeEvent(eventData: EventData) {
    const event = new Event({
      ...eventData,
      status: 'upcoming',
    });
    await event.save();
    return event;
  }

  static async joinEvent(eventId: string, userId: string) {
    try {
      const objectId = new ObjectId(eventId);

      const event = await Event.findById(objectId);

      if (!event) {
        return { error: 'Event not found' };
      }

      if (event.maxParticipants && event.participants.length >= event.maxParticipants) {
        return { error: 'Event is full' };
      }

      // Convert userId (string) to ObjectId before adding it to participants
      event.participants.push(new ObjectId(userId));
      await event.save();

      return { success: true, event };
    } catch (error) {
      console.error('Error joining event:', error);
      return { error: 'Failed to join event' };
    }
  }
}
