import { Request, Response, NextFunction } from 'express';
import { PostService } from '../services/post.service';
import { UnauthorizedError } from '../utils/errors';

const postService = new PostService();

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const { title, content, clubId } = req.body;
    const post = await postService.createPost(req.user.id, req.user.role, { title, content, clubId });
    res.status(201).json({
      status: 'success',
      message: 'Post published successfully',
      data: { post },
    });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const post = await postService.getPostById(req.params.postId);
    res.status(200).json({
      status: 'success',
      data: { post },
    });
  } catch (error) {
    next(error);
  }
};

export const getFeed = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const posts = await postService.getFeed(req.user.id, req.user.role);
    res.status(200).json({
      status: 'success',
      data: { posts },
    });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const { content } = req.body;
    const comment = await postService.addComment(req.params.postId, req.user.id, content);
    res.status(201).json({
      status: 'success',
      message: 'Comment added successfully',
      data: { comment },
    });
  } catch (error) {
    next(error);
  }
};

export const toggleLike = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const liked = await postService.toggleLike(req.params.postId, req.user.id);
    res.status(200).json({
      status: 'success',
      message: liked ? 'Post liked successfully' : 'Post unliked successfully',
      data: { liked },
    });
  } catch (error) {
    next(error);
  }
};

export const toggleBookmark = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const bookmarked = await postService.toggleBookmark(req.params.postId, req.user.id);
    res.status(200).json({
      status: 'success',
      message: bookmarked ? 'Post bookmarked' : 'Post unbookmarked',
      data: { bookmarked },
    });
  } catch (error) {
    next(error);
  }
};
