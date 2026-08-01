import { PostRepository } from '../repositories/post.repository';
import { prisma } from '../config/db';
import { Post, Comment, Role } from '@prisma/client';
import { NotFoundError, ForbiddenError } from '../utils/errors';

export class PostService {
  private postRepository = new PostRepository();

  async createPost(
    userId: string,
    userRole: Role,
    data: { title?: string; content: string; clubId?: string }
  ): Promise<Post> {
    if (data.clubId) {
      // Check if user is president/officer or Admin
      if (userRole !== Role.SUPER_ADMIN && userRole !== Role.COLLEGE_ADMIN) {
        const membership = await prisma.membership.findFirst({
          where: {
            userId,
            clubId: data.clubId,
            status: 'APPROVED',
            role: { in: ['PRESIDENT', 'OFFICER'] },
          },
        });
        if (!membership) {
          throw new ForbiddenError('You do not have permission to post to this club feed');
        }
      }
    }
    return this.postRepository.create({ ...data, authorId: userId });
  }

  async getPostById(postId: string): Promise<any> {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new NotFoundError('Post not found');
    }
    return post;
  }

  async getFeed(userId: string, userRole: Role): Promise<any[]> {
    // Admins/Faculty see everything
    if (userRole === Role.SUPER_ADMIN || userRole === Role.COLLEGE_ADMIN || userRole === Role.FACULTY_COORDINATOR) {
      return this.postRepository.fetchAllFeeds();
    }

    // Students / Presidents see general feed plus their own club feeds
    const memberships = await prisma.membership.findMany({
      where: {
        userId,
        status: 'APPROVED',
      },
      select: { clubId: true },
    });

    const clubIds = memberships.map((m) => m.clubId);
    return this.postRepository.fetchFilteredFeed(clubIds);
  }

  async addComment(postId: string, authorId: string, content: string): Promise<Comment> {
    await this.getPostById(postId);
    return this.postRepository.addComment(postId, authorId, content);
  }

  async toggleLike(postId: string, userId: string): Promise<boolean> {
    await this.getPostById(postId);
    return this.postRepository.toggleLike(postId, userId);
  }

  async toggleBookmark(postId: string, userId: string): Promise<boolean> {
    await this.getPostById(postId);
    return this.postRepository.toggleBookmark(postId, userId);
  }

  async deletePost(id: string): Promise<Post> {
    await this.getPostById(id);
    return this.postRepository.delete(id);
  }
}
