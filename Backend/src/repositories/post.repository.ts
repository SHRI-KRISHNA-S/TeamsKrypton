import { prisma } from '../config/db';
import { Post, Comment } from '@prisma/client';

export class PostRepository {
  async create(data: { title?: string; content: string; authorId: string; clubId?: string }): Promise<Post> {
    return prisma.post.create({
      data,
      include: {
        author: {
          select: { id: true, name: true, avatar: true, role: true },
        },
      },
    });
  }

  async findById(id: string): Promise<any | null> {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, role: true, department: true },
        },
        comments: {
          include: {
            author: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
        likes: true,
        bookmarks: true,
      },
    });
  }

  async fetchFilteredFeed(permittedClubIds: string[]): Promise<any[]> {
    // Shows college posts (clubId = null) plus posts in the permitted clubs
    return prisma.post.findMany({
      where: {
        OR: [
          { clubId: null },
          { clubId: { in: permittedClubIds } },
        ],
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, role: true, department: true },
        },
        comments: { select: { id: true } },
        likes: true,
        bookmarks: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async fetchAllFeeds(): Promise<any[]> {
    return prisma.post.findMany({
      include: {
        author: {
          select: { id: true, name: true, avatar: true, role: true, department: true },
        },
        comments: { select: { id: true } },
        likes: true,
        bookmarks: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addComment(postId: string, authorId: string, content: string): Promise<Comment> {
    return prisma.comment.create({
      data: {
        postId,
        authorId,
        content,
      },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  async toggleLike(postId: string, userId: string): Promise<boolean> {
    const existing = await prisma.postLike.findUnique({
      where: {
        postId_userId: { postId, userId },
      },
    });

    if (existing) {
      await prisma.postLike.delete({
        where: {
          postId_userId: { postId, userId },
        },
      });
      return false; // Unliked
    } else {
      await prisma.postLike.create({
        data: { postId, userId },
      });
      return true; // Liked
    }
  }

  async toggleBookmark(postId: string, userId: string): Promise<boolean> {
    const existing = await prisma.bookmark.findUnique({
      where: {
        postId_userId: { postId, userId },
      },
    });

    if (existing) {
      await prisma.bookmark.delete({
        where: {
          postId_userId: { postId, userId },
        },
      });
      return false; // Removed bookmark
    } else {
      await prisma.bookmark.create({
        data: { postId, userId },
      });
      return true; // Bookmarked
    }
  }

  async delete(id: string): Promise<Post> {
    return prisma.post.delete({ where: { id } });
  }
}
